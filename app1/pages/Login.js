import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Alert, Text, View, TextInput, Button, TouchableOpacity, Pressable } from 'react-native';
import React, {useState, useEffect} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('WaveDB');

export function Login({ navigation }) {
    
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    useEffect(() => {
        createTable();
        showTableData();
    }, []);

    const showTableData = () => {
        console.log('olá');
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT id, cpf, email, senha, nome FROM Funcionario",
                    [],
                    (tx, results) => {
                        var len = results.rows.length;
                        console.log("Registros da tabela Funcionario:");
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log('ID:', row.id, 'CPF:', row.cpf, 'Nome:', row.nome, 'Email:', row.email, 'Senha:', row.senha);
                        }
                    }
                );
            });
        } catch (error) {
            console.log('Erro ao exibir dados da tabela:', error);
        }
    }

    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "Funcionario "
                + "(id INTEGER PRIMARY KEY AUTOINCREMENT, cpf INTEGER(11), nome VARCHAR(50), email VARCHAR(30), senha VARCHAR(10))"
            )
        })
        console.log('tabela criada')
    }

    const getData = () => {
        try{
            db.transaction((tx) => {
            tx.executeSql(
                "SELECT id, cpf, email, senha, nome FROM Funcionario",
                [],
                (tx, results) => {
                    var len = results.rows.length;
                    if (len > 0) {
                        var userCpf = results.rows.item(0).cpf;
                        var userNome = results.rows.item(0).nome;
                        var userEmail = results.rows.item(0).email;
                        var userSenha = results.rows.item(0).senha;
                        setCpf(userCpf);
                        setEmail(userEmail);
                        setNome(userNome);
                        setSenha(userSenha);
                        navigation.navigate('Routes', {cpf: userCpf, nome: userNome, email: userEmail, senha: userSenha}
                          );
                        } else {
                            Alert.alert('Atenção', 'Por favor insira seus dados.')
                        }
                    }
                )
            })
        } catch (error){
            console.log('Erro ao exibir dados da tabela:', error);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.textodisplay}>Login</Text>
            <TextInput
                style = {styles.input}
                placeholder="Digite seu e-mail"
                value = {email}
                onChangeText = {setEmail}>
        </TextInput>
        <Text style = {styles.textodisplay}>Senha:</Text>
        <TextInput
                style = {styles.input}
                placeholder="Digite seu senha"
                value = {senha}
                onChangeText = {setSenha}>
        </TextInput>
        <TouchableOpacity style={styles.button} onPress={() => getData()}>
            <Text style={styles.textobotao}>Logar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
            onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.textobotao}>Registro</Text>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    button:{
        backgroundColor: '#00CED1',
        width: "40%",
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        borderRadius: 10,
    },
    textodisplay: {
        marginBottom: 10,
        fontSize: 20,
        fontWeight: "bold",
    },
    textobotao: {
        color: '#fff',
        fontWeight: "bold",
        fontSize: 15,
    },
    input: {
        backgroundColor: '#87CEEB',
        width: "80%",
        marginBottom: 14,
        padding: 8,
        borderRadius: 10,
    },
})