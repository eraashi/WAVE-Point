import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, ImageBackground, Image, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns-tz';
import { Localization } from 'expo';
import * as Location from 'expo-location';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('WaveDB');

export function Ponto({ route }) {
    const [entrada, setEntrada] = useState('Sem registro'); // Estado para armazenar a hora de entrada
    const [saidaAlmoco, setSaidaAlmoco] = useState('Sem registro'); // Estado para armazenar a hora de saída para o almoço
    const [voltaAlmoco, setVoltaAlmoco] = useState('Sem registro'); // Estado para armazenar a hora de volta do almoço
    const [saida, setSaida] = useState('Sem registro'); // Estado para armazenar a hora de saída
    const [localizacao, setLocalizacao] = useState(''); // Estado para armazenar a localização atual
    const [contadorPress, setContadorPress] = useState(0); // Estado para contar quantas vezes o botão foi pressionado
    const [observacao, setObservacao] = useState(''); // Estado para armazenar a observação digitada pelo usuário
    const [erro, setErro] = useState('');

    const [existeDia, setExisteDia] = useState(false);

    const { id, email, senha, cpf, nome, endereco, enderecoLogin } = route.params;

    //Precisa ser criado uma checagem de localização no Login, pois está bugando 2 CONSULTAS de localização ao mesmo tempo
    useEffect(() => {
        createTable();
        showRegistroPonto();
        compararEnderecos();
        getLocationPermission(); // Chama a função para obter permissão de localização quando o componente é montado
        verificarDiaAtual();
        getCurrentDate();
    }, []);

    const createTable = () => {
        //Cria a tabela Funcionario2
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "RegistroPonto1 "
                + "(id INTEGER PRIMARY KEY, idFuncionario TEXT, nome VARCHAR(50), dia TEXT, local TEXT, hora1 TEXT, hora2 TEXT, hora3 TEXT, hora4 TEXT)"
            )
        })
        console.log('Tabela RegistroPonto criada')
    }

    const showRegistroPonto = () => {
        //Exibe no Terminal a tabela RegistroPonto
        console.log('olá');
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    //adicionar o id (chave primaria da tabela RegistroPonto)
                    "SELECT id, idFuncionario, nome, dia, local, hora1, hora2, hora3, hora4 FROM RegistroPonto1",
                    [],
                    (tx, results) => {
                        var len = results.rows.length;
                        console.log("Registros da tabela RegistroPonto:");
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log('ID:', row.id, 'IdFuncionario:', row.idFuncionario, 'Nome:', row.nome, 'Local:', row.local, 'Hora de Entrada:', row.hora1, 'Saída de Almoço:', row.hora2, 'Volta do Almoço:', row.hora3, 'Saída:', row.hora4);
                        }
                    }
                );
            });
        } catch (error) {
            console.log('Erro ao exibir dados da tabela:', error);
        }
    }

    const compararEnderecos = () => {
        if (endereco !== enderecoLogin) {
            Alert.alert(
                'Atenção! Você está em um endereço diferente do seu local de trabalho',
                `Endereço no seu registro: ${endereco}\n\nEndereço atual: ${enderecoLogin}\n\nCaso ainda deseje registrar seu ponto informe no campo "Observações" sobre a disparidade.`,
                [{ text: 'OK' }]
            );
        }
    };

    const setRegistroFinal = () => {
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "INSERT INTO RegistroPonto1 (idFuncionario, nome, dia, local, hora1, hora2, hora3, hora4) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [id, nome, hoje, enderecoLogin, entrada, saidaAlmoco, voltaAlmoco, saida]
                );
            })
        } catch (error) {
            console.log(error);
        }
    }

    const getLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync(); // Solicita permissão de localização
        if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Você precisa permitir o acesso à localização para usar este aplicativo.'); // Alerta se a permissão for negada
        }
    };

    const getLocation = async () => {
        let location = await Location.getCurrentPositionAsync({}); // Obtém a localização atual
        let address = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        }); // Obtém o endereço reverso com base na latitude e longitude
        const municipio = address[0].subregion || address[0].city; // Obtém o município a partir da resposta
        setLocalizacao({
            ...address[0], // Mantém o resto das informações de localização
            municipio: municipio, // Adiciona o município ao objeto de localização
        });
    };

    const formatTime = (date) => {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`; // Formata a hora como HH:MM
    };

    //teste

    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const disableButton = () => {
        setButtonDisabled(true);
    };

    const hoje = new Date().toISOString().slice(0, 10); // Obtém a data atual no formato 'YYYY-MM-DD'
    const verificarDiaAtual = () => {
    
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM RegistroPonto1 WHERE dia = ?',
                [hoje],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        verificarHorariosPreenchidos(rows);
                        return;
                    } else {
                        inserirNovaLinha();
                    }
                },
                (_, error) => {
                    console.error('Erro ao verificar o dia atual:', error);
                }
            );
        });
    };
    
    const verificarHorariosPreenchidos = (rows) => {
        let algumSemRegistro = false;
        for (let i = 0; i < rows.length; i++) {
            const horario1 = rows.item(i).hora1;
            const horario2 = rows.item(i).hora2;
            const horario3 = rows.item(i).hora3;
            const horario4 = rows.item(i).hora4;
            if (horario1 === 'Sem registro' || horario2 === 'Sem registro' || horario3 === 'Sem registro' || horario4 === 'Sem registro') {
                algumSemRegistro = true;
                break;
            }
        }
        if (!algumSemRegistro) {
            setExisteDia(true);
            disableButton(true);
        }
    };
    
    const inserirNovaLinha = () => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO RegistroPonto1 (idFuncionario, nome, dia, local, hora1, hora2, hora3, hora4) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [id, nome, hoje, enderecoLogin, entrada, saidaAlmoco, voltaAlmoco, saida],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        Alert.alert('Olá!', 'Um novo registro de ponto foi iniciado. Clique uma vez no relógio quando entrar e sair do expediente e do horário de almoço.');
                    } else {
                        Alert.alert('Erro', 'Falha ao iniciar seu registro de horário.');
                    }
                },
                (_, error) => {
                    console.error('Erro ao inserir nova linha na tabela:', error);
                }
            );
        });
    };

    const atualizarHorarios = (horaFormatada) => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `UPDATE RegistroPonto1 SET hora1 = ?, hora2 = ?, hora3 = ?, hora4 = ? WHERE dia=?`,
                    [entrada, saidaAlmoco, voltaAlmoco, saida, hoje],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            resolve(); // Horários atualizados com sucesso
                        } else {
                            reject('Nenhum registro atualizado'); // Nenhum registro atualizado
                        }
                    },
                    (_, error) => {
                        reject(error); // Erro ao executar a consulta SQL
                    }
                );
            });
        });
    };

    const registrarPonto2 = async () => {
        await getLocation(); // Obtém a localização atual (sem formatação)
        const horaAtual = new Date(); // Obtém a hora atual
        const horaFormatada = formatTime(horaAtual); // Formata a hora atual

        switch (contadorPress) {
            case 0:
                // Define a hora de entrada
                setEntrada(horaFormatada);
                setSaidaAlmoco('Sem Registro');
                setVoltaAlmoco('Sem registro');
                setSaida('Sem Registro');
                break;
            case 1:
                setSaidaAlmoco(horaFormatada); // Define a hora de saída para o almoço
                setVoltaAlmoco('Sem registro');
                setSaida('Sem Registro');
                break;
            case 2:
                setVoltaAlmoco(horaFormatada); // Define a hora de volta do almoço
                setSaida('Sem Registro');
                break;
            case 3:
                setSaida(horaFormatada); // Define a hora de saída
                break;
            default:
                break;
        }

        if (horaFormatada) {
            try {
                // Atualiza os horários no banco de dados SQLite
                await atualizarHorarios();

                // Exibe um alerta para confirmar o registro do ponto
                Alert.alert(
                    'Confirmação',
                    'Deseja mesmo registrar o ponto?',
                    [
                        {
                            text: 'Cancelar',
                            style: 'cancel',
                        },
                        {
                            text: 'Confirmar',
                            onPress: () => {
                                // Atualiza o contador de pressão do botão
                                setContadorPress((prev) => prev + 1);
                            },
                        },
                    ],
                    { cancelable: false }
                );
            } catch (error) {
                console.error('Erro ao registrar ponto:', error);
            }
        }
    };
    //teste

    const confirmarHorarios = () => {
        const resumoHorarios = `Entrada: ${entrada}\nSaída para Almoço: ${saidaAlmoco}\nVolta do Almoço: ${voltaAlmoco}\nSaída: ${saida}`;
        const mensagemObservacao = observacao.trim() !== '' ? `\nObservação: ${observacao}` : '';

        Alert.alert(
            'Confirmação de Horários', // Título do alerta
            `${resumoHorarios}${mensagemObservacao}`, // Conteúdo do alerta
            [
                { text: 'Cancelar', style: 'cancel' }, // Botão de cancelar
                { text: 'Confirmar', onPress: () => enviarHorarios() }, // Botão de confirmar
            ],
            { cancelable: false } // O alerta não pode ser cancelado clicando fora
        );
        console.log('Horários completos:');
        console.log(resumoHorarios);
    };

    const enviarHorarios = () => {
        // Aqui você pode enviar os dados para onde desejar, como um servidor ou outro componente
        // Por enquanto, vamos apenas exibir um alerta de sucesso
        atualizarHorarios();
        showRegistroPonto();
        Alert.alert('Sucesso!', 'Seu dia foi registrado.');
        setExisteDia(true);
        disableButton(true);
    };

    return (
        <ImageBackground source={require("./src/FundoVetor_20240428_105938_0000.png")} style={styles.background}>
            <SafeAreaView style={styles.container}>
                    <View style={styles.cabecalhoView}>
                        <Text style={styles.cabecalhoLinha}>Olá {nome},</Text>
                        <Text style={styles.cabecalho}>Seja Bem vindo a WAVEPoint!</Text>
                    </View>

                    <View style={styles.diacontent}>
                    {existeDia && (
                        <View>
                        <Text style={styles.cabecalho2}>Dia registrado!</Text>
                        </View>
                    )}
                    </View>
                <TouchableOpacity style={[styles.button, isButtonDisabled && styles.disabledButton]} onPress={registrarPonto2} disabled={isButtonDisabled}>
                    <Text>
                        <MaterialIcons name="access-time" size={120} color="white" />
                    </Text>
                </TouchableOpacity>

                <View style={styles.content}>
                    <View style={styles.entryContainer}>
                        <Text style={styles.entryText}>Data: {hoje}</Text>
                        <Text style={styles.entryText}>Entrada: {entrada}</Text>
                        <Text style={styles.entryText}>Saída para Almoço: {saidaAlmoco}</Text>
                        <Text style={styles.entryText}>Volta do Almoço: {voltaAlmoco}</Text>
                        <Text style={styles.entryText}>Saída: {saida}</Text>
                    </View>
                </View>

                <View style={styles.observacaoContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Observação..."
                        value={observacao}
                        onChangeText={setObservacao}
                        multiline={true}
                    />
                </View>
                <View style={styles.confirmarcontainer}>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmarHorarios}>
                        <Text style={styles.confirmButtonText}>Finalizar Dia</Text>
                </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    disabledButton:{
        backgroundColor: '#B0C4DE',
    },
    diacontent:{
        marginTop: 150,
    },
    cabecalhoView:{
        marginTop: 70,
        marginBottom: -80,
    },
    cabecalhoLinha:{
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 8,
        textShadowColor: '#0085F8',
        color: '#00FFFF',
        
        fontSize: 22,
        fontWeight: "bold",
        marginHorizontal: -180,
    },
    cabecalho:{
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 8,
        textShadowColor: '#0085F8',
        color: 'white',
        marginBottom: 70,
        fontSize: 22,
        fontWeight: "bold",
        marginHorizontal: -180,
    },
    cabecalho2:{
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 8,
        textShadowColor: '#1E90FF',
        color: '#00FFFF',
        marginBottom: 5,
        fontSize: 22,
        fontWeight: "bold",
    },
    confirmarcontainer:{
        flex: 4,
        marginTop: -50,
    },
    observacaoContainer: {
        flex: 3,
        marginTop: 10,
        width: '54%',
    },
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginTop: 120,
    },
    entryContainer: {
        backgroundColor: 'rgba(30, 144, 255, 0.5)', // Azul com sombra meio transparente
        borderRadius: 8,
        padding: 8,
        marginBottom: 20,
    },
    entryText: {
        fontSize: 14,
        marginVertical: 5,
        fontWeight: 'bold',
        padding: 0,
        marginTop: 0,
        marginBottom: 0,
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 8,
        textShadowColor: '#1E90FF',
        color: 'white',
    },
    locationContainer: {
        marginTop: 130,
        marginBottom: -100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(30, 144, 255, 0.5)', // Branco com sombra meio transparente
        borderRadius: 12,
    },
    locationText: {
        fontSize: 20,
        fontWeight: 'bold',
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 8,
        textShadowColor: '#1E90FF',
        color: 'white',
        marginBottom: -5,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0085F8',
        borderRadius: 90,
        width: 150,
        height: 150,
        marginBottom: 20,
        marginTop: 10,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        marginTop: 10,
        fontSize: 14,
    },
    confirmButton: {
        backgroundColor: '#0085F8',
        width: '100%',
        padding: 14,
        borderRadius: 10,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});