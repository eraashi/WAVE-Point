import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Alert, Image, ImageBackground, Text, View, TextInput, Button, TouchableOpacity, Pressable } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import * as Location from 'expo-location';

const db = SQLite.openDatabase('WaveDB');

export function Login({ navigation }) {

    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [endereco, setEndereco] = useState('');
    const [id, setId] = useState('');
    const [enderecoLogin, setEnderecoLogin] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        //Funções iniciadas quando a tela é exibida
        createTable();
        showTableData();
        obterEndereco();
        limparCampo();
    }, []);

    useFocusEffect(
        useCallback(() => {
            limparCampo();
        }, [])
    );

    const obterEndereco = async () => {
        try {
            // Solicita permissão para acessar a localização do dispositivo
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErro('Permissão para acessar a localização negada');
                return;
            }
            // Obtém a localização atual do dispositivo
            const localizacao = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = localizacao.coords;
            // Obtém o endereço reverso a partir das coordenadas de latitude e longitude
            const enderecoReverso = await Location.reverseGeocodeAsync({ latitude, longitude });
            const formattedAddress = enderecoReverso[0].formattedAddress;
            console.log(formattedAddress);
            // Define o endereço obtido no estado
            setEnderecoLogin(formattedAddress);
            // Obtém a data e hora atual
        } catch (error) {
            console.error('Erro ao obter endereço:', error);
            setErro('Erro ao obter endereço: ' + error.message);
        }
    };


    const createTable = () => {
        //Cria a tabela Funcionario
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "Funcionario "
                + "(id INTEGER PRIMARY KEY AUTOINCREMENT, cpf INTEGER(11), nome VARCHAR(50), email VARCHAR(30), senha VARCHAR(10), endereco TEXT)"
            )
        })
        console.log('tabela Funcionario criada')
    }

    const showTableData = () => {
        //Exibe no Terminal a tabela Funcionario
        console.log('olá');
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT id, cpf, email, senha, nome, endereco FROM Funcionario",
                    [],
                    (tx, results) => {
                        var len = results.rows.length;
                        console.log("Registros da tabela Funcionario:");
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log('ID:', row.id, 'CPF:', row.cpf, 'Nome:', row.nome, 'Email:', row.email, 'Senha:', row.senha, 'Endereço', row.endereco);
                        }
                    }
                );
            });
        } catch (error) {
            console.log('Erro ao exibir dados da tabela:', error);
        }
    }

    const getData = () => {
        //Seleciona os dados da tabela Funcionario para validação
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT id, cpf, email, senha, nome, endereco FROM Funcionario WHERE senha=? AND email=?",
                    [senha, email],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            var userCpf = results.rows.item(0).cpf;
                            var userNome = results.rows.item(0).nome;
                            var userEmail = results.rows.item(0).email;
                            var userSenha = results.rows.item(0).senha;
                            var userEndereco = results.rows.item(0).endereco;
                            var userId = results.rows.item(0).id;
                            setCpf(userCpf);
                            setEmail(userEmail);
                            setNome(userNome);
                            setSenha(userSenha);
                            setEndereco(userEndereco);
                            setId(userId);
                            navigation.navigate('Routes', { id: userId, cpf: userCpf, nome: userNome, email: userEmail, senha: userSenha, endereco: userEndereco, enderecoLogin: enderecoLogin }
                            );
                        } else {
                            Alert.alert('Atenção', 'Por favor, verifique seus dados.')
                            limparCampo()
                        }
                    }
                )
            })
        } catch (error) {
            console.log('Erro ao exibir dados da tabela:', error);
        }
    }

    const limparCampo = () => {
        // Atualiza o estado do texto para uma string vazia
        setEmail('');
        setSenha('');
    };

    return (
        <ImageBackground source={require("./src/Degradefundo_20240428_105938_0002.png")} style={styles.background}>
            <Image source={require("./src/Captura_de_tela_2024-05-02_203231-removebg-preview.png")} style={styles.image}></Image>
            <View style={{marginTop: 150}}>
            <View style={styles.LoginSenha}>
                <Text style={styles.textodisplay}>Login</Text>
            </View>
            <View style={styles.inputtext}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}>
                </TextInput>
                </View>
                <View style={styles.LoginSenha}>
                <Text style={styles.textodisplay}>Senha</Text>
                </View>
                <View style={styles.inputtext}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu senha"
                    secureTextEntry={true}
                    value={senha}
                    onChangeText={setSenha}>
                </TextInput>
                </View>
                <View style={styles.botaoespaco}>
                <TouchableOpacity style={styles.button} onPress={() => getData()}>
                    <Text style={styles.textobotao}>Entrar</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.botaoespaco}>
                <TouchableOpacity style={styles.buttonregistro}
                    onPress={() => navigation.navigate('Registro')}>
                    <Text style={styles.textobotaovoltar}>Registro</Text>
                </TouchableOpacity>
            </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
        resizeMode: 'contain',
        height: 200,
        width: 250,
        marginLeft: 80,
        marginTop: 15,
    },
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    LoginSenha: {
        marginLeft: 90,
    },
    inputtext: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    botaoespaco: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#1E90FF',
        width: "40%",
        padding: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        borderRadius: 10,
    },
    textodisplay: {
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 8,
        textShadowColor: '#1E90FF',
        color: 'white',
        marginBottom: 5,
        fontSize: 20,
        fontWeight: "bold",
    },
    textobotao: {
        color: '#fff',
        fontWeight: "bold",
        fontSize: 15,
    },
    input: {
        backgroundColor: 'white',
        width: "60%",
        marginBottom: 14,
        padding: 12,
        borderRadius: 10,
    },
    buttonregistro:{
        width: "40%",
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 10,
    },
    textobotaovoltar: {
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 5,
        textShadowColor: '#1E90FF',
        color: '#fff',
        fontWeight: "bold",
        fontSize: 15,
    },
})