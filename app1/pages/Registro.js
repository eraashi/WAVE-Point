import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import React, {useState, useEffect} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('WaveDB');

export function Registro({navigation}) {
  
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
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

  const setData = () => {
    if(cpf.length == 0 || nome.length == 0 || email.length == 0 || senha.length == 0){
      Alert.alert('Atenção', 'Por favor digite seus dados.')
    } else {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO Funcionario (cpf, nome, email, senha) VALUES (?, ?, ?, ?)",
            [cpf, nome, email, senha]
          );
        })
        Alert.alert('Sucesso!', 'Seus dados foram registrados.')
        
        navigation.navigate('Login');
      } catch (error){
        console.log(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style = {styles.display}>Registro de Funcionário</Text>
      <Text style = {styles.textodisplay}>CPF:</Text>
      <TextInput
        style = {styles.input}
        placeholder="Digite seu CPF"
        value = {cpf}
        onChangeText = {setCpf}/>
      <Text style = {styles.textodisplay}>Nome:</Text>
      <TextInput
        style = {styles.input}
        placeholder="Digite seu nome completo"
        value = {nome}
        onChangeText = {setNome}>
      </TextInput>
      <Text style = {styles.textodisplay}>E-mail:</Text>
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
      <View style={styles.buttonarea}>
      <TouchableOpacity style={styles.buttonvoltar} 
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.textobotaovoltar}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setData()}>
        <Text style={styles.textobotao}>Salvar</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonarea:{
    flexDirection: 'row',
    width: '60%',
    marginTop: 8,
    alignItems: "center",
    justifyContent: 'space-between',
  },
  button:{
    flex: 1,
    backgroundColor: '#00CED1',
    width: "40%",
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    borderRadius: 10,
  },
  buttonvoltar:{
    flex: 1,
    width: "40%",
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  display: {
    marginBottom: 100,
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: '#87CEEB',
    width: "80%",
    marginBottom: 14,
    padding: 8,
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
  textobotaovoltar: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
