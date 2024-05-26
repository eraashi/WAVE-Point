import { StatusBar } from 'expo-status-bar';
import { Text, StyleSheet, SafeAreaView, View, Alert, ImageBackground, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('WaveDB');

export function Edicao({ route }) {

    const { id, email, senha, cpf, nome, endereco, enderecoLogin } = route.params;

    const [novoCpf, setCpf] = useState('');
    const [novoNome, setNome] = useState('');
    const [novoEmail, setEmail] = useState('');
    const [novaSenha, setSenha] = useState('');
    const [novoEndereco, setEndereco] = useState('');

    useEffect(() => {
        showTableData();
        Alert.alert('Atenção!', 'Caso deseje alterar o local de trabalho, entre em contato com seu supervisor')
    }, []);

    const atualizarFuncionario = () => {
        if (!novoCpf || !novoNome || !novoEmail || !novaSenha || !endereco) {
            return (Promise.reject('Todos os campos devem ser preenchidos'),
            Alert.alert('Atenção!', 'Todos os campos devem ser preenchidos'))
        }

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE Funcionario SET nome = ?, email = ?, senha = ?, cpf = ? WHERE id = ?',
                    [novoNome, novoEmail, novaSenha, novoCpf, id],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            resolve(true);
                            showTableData();
                        } else {
                            resolve(false);
                        }
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            },
                Alert.alert('Sucesso!', 'Seus dados foram alterados.')
            );
        });
    };

    const showTableData = () => {
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

    const limparCampos = () => {
        // Atualiza o estado do texto para uma string vazia
        setEmail('');
        setSenha('');
        setCpf('');
        setNome('');
    };

    return (
        <ImageBackground source={require("./src/FundoVetor (2)_20240428_105938_0001.png")} style={styles.background}>
            <SafeAreaView>
                <View style={styles.cabecalho}>
                <Text style={styles.titulo}>Este é o seu local de trabalho:</Text>
                <Text style={styles.enderecostyle}>"{endereco}"</Text>
                <Text style={styles.titulo}>Este é o seu endereço atual:</Text>
                <Text style={styles.enderecostyle}>"{enderecoLogin}"</Text>
                </View>

                <Text style={styles.corpo}>Aqui você pode editar seus dados</Text>
                
                <Text style={styles.textodisplay}>CPF:</Text>
                <TextInput
                    style={styles.input}
                    placeholder={'Seu CPF'}
                    onChangeText={setCpf}/>
                <Text style={styles.textodisplay}>Nome:</Text>
                <TextInput
                    style={styles.input}
                    placeholder={nome}
                    onChangeText={setNome}/>
                <Text style={styles.textodisplay}>E-mail:</Text>
                <TextInput
                    style={styles.input}
                    placeholder={email}
                    onChangeText={setEmail}>
                </TextInput>
                <Text style={styles.textodisplay}>Senha:</Text>
                <TextInput
                    style={styles.input}
                    placeholder={senha}
                    onChangeText={setSenha}>
                </TextInput>

                <View style={styles.buttonarea}>
                    <TouchableOpacity style={styles.button} onPress={() => atualizarFuncionario()}>
                        <Text style={styles.textobotao}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    rodape: {
        fontSize: 14,
        fontWeight: "bold",
        width: "70%",
        textAlign: "center",
        color: "white",
    },
    corpo:{
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 8,
        textShadowColor: '#0085F8',
        marginBottom: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginTop: -40,
        marginLeft: 80,
    },
    titulo: {
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 8,
        textShadowColor: '#0085F8',
        marginBottom: 5,
        fontSize: 20,
        fontWeight: "bold",
        width: "70%",
        color: "white",
        marginLeft: 27,
    },
    enderecostyle: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
        width: "90%",
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 8,
        textShadowColor: 'white',
        color: '#0085F8',
        marginLeft: 20,
    },
    buttonarea: {
        flexDirection: 'row',
        width: '60%',
        marginTop: 0,
        alignItems: "center",
        justifyContent: 'space-between',
        marginLeft: 155,
    },
    button: {
        backgroundColor: '#0085F8',
        width: "40%",
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        borderRadius: 10,
    },
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    cabecalho: {
        alignItems: 'baseline',
        justifyContent: 'center',
        marginBottom: 200,
        marginTop: -20,
    },
    display: {
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 8,
        textShadowColor: '#1E90FF',
        color: 'white',
        marginBottom: 5,
        fontSize: 20,
        fontWeight: "bold",
        marginRight: 190,
        marginTop: -160,
    },
    atencao: {
        color: 'red',
        marginBottom: 5,
        fontSize: 14,
        fontWeight: "bold",
    },
    input: {
        backgroundColor: 'white',
        width: "65%",
        height: 40,
        marginBottom: 10,
        padding: 8,
        borderRadius: 10,
        marginLeft: 30,
    },
    textodisplay: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        marginLeft: 40,
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowRadius: 8,
        textShadowColor: '#0085F8',
    },
    textobotao: {
        color: '#fff',
        fontWeight: "bold",
        fontSize: 15,
    },
    textobotaovoltar: {
        fontWeight: "bold",
        fontSize: 15,
    },
})
