import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, ImageBackground, Image, SafeAreaView, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import * as Location from 'expo-location';
import * as SplashScreen from 'expo-splash-screen';

const db = SQLite.openDatabase('WaveDB');

export function Registro({navigation}) {

  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [endereco, setEndereco] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    //Funções iniciadas quando a tela é exibida
    showTableData();
    obterEndereco();
  }, []);

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
        setEndereco(formattedAddress);
        // Obtém a data e hora atual
    } catch (error) {
        console.error('Erro ao obter endereço:', error);
        setErro('Erro ao obter endereço: ' + error.message);
    }
};

  const showTableData = () => {
    //Exibe no Terminal a tabela Funcionario2
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

  const setData = () => {
    //Registra os dados do funcionario
    if(cpf.length == 0 || nome.length == 0 || email.length == 0 || senha.length == 0){
      Alert.alert('Atenção', 'Por favor digite seus dados.')
      limparCampo()
    } else {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO Funcionario (cpf, nome, email, senha, endereco) VALUES (?, ?, ?, ?, ?)",
            [cpf, nome, email, senha, endereco]
          );
        })
        Alert.alert('Sucesso!', 'Seus dados foram registrados.')
        
        navigation.navigate('Login');
      } catch (error){
        console.log(error);
      }
    }
  }

  const limparCampo = () => {
    // Atualiza o estado do texto para uma string vazia
    setEmail('');
    setSenha('');
    setCpf('');
    setNome('');
  };

  return (
    <ImageBackground source={require("./src/FundoVetor (2)_20240428_105938_0001.png")} style={styles.background}>
    <SafeAreaView style={{marginTop: 50}}>

      <Image source={require("./src/Captura_de_tela_2024-05-02_203411-removebg-preview.png")} style={styles.image}></Image>
      
      <Text style = {styles.textodisplay}>CPF</Text>
      
      <TextInput
        style = {styles.input}
        placeholder="Digite seu CPF"
        value = {cpf}
        onChangeText = {setCpf}/>
      
      <Text style = {styles.textodisplay}>Nome</Text>
      
      <TextInput
        style = {styles.input}
        placeholder="Digite seu nome completo"
        value = {nome}
        onChangeText = {setNome}>
      </TextInput>
      
      <Text style = {styles.textodisplay}>E-mail</Text>
      
      <TextInput
        style = {styles.input}
        placeholder="Digite seu e-mail"
        value = {email}
        onChangeText = {setEmail}>
      </TextInput>
      
      <Text style = {styles.textodisplay}>Senha</Text>
      
      <TextInput
        style = {styles.input}
        placeholder="Digite seu senha"
        value = {senha}
        onChangeText = {setSenha}>
      </TextInput>
      
      <Text style= {styles.titulo}>Este é o seu endereço atual:</Text>
      <Text style = {styles.enderecostyle}>"{endereco}"</Text>
      <Text style= {styles.rodape}>Será registrado como seu local de trabalho.</Text>
      
      <View style={styles.buttonarea}>
      <TouchableOpacity style={styles.buttonvoltar} 
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.textobotaovoltar}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setData()}>
        <Text style={styles.textobotao}>Salvar</Text>
      </TouchableOpacity>

      </View>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  image: {
    resizeMode: 'contain',
    height: 100,
    width: 200,
    marginLeft: 110,
    marginBottom: 40,
  },
  rodape:{
    fontSize: 18,
    fontWeight: "bold",
    width: "70%",
    color: 'white',
    textAlign: "center",
    marginLeft: 68,
    textShadowOffset: {
      width: 1, height: 1
  },
  textShadowRadius: 5,
  textShadowColor: '#1E90FF',
  },
  titulo:{
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    width: "70%",
    color: 'white',
    alignItems: "center",
    textAlign: "center",
    marginLeft: 65,
    textShadowOffset: {
      width: 1, height: 1
  },
  textShadowRadius: 2,
  textShadowColor: '#1E90FF',
  },
  enderecostyle:{
    marginBottom: 10,
    color: '#1E90FF',
    fontSize: 20,
    fontWeight: "bold",
    width: "60%",
    textAlign: "center",
    marginLeft: 85,
    textShadowOffset: {
    width: 1, height: 1
  },
  textShadowRadius: 1,
  textShadowColor: 'white',
  },
  buttonarea:{
    flexDirection: 'row',
    width: '60%',
    marginTop: 8,
    marginLeft: 90,
    alignItems: "center",
    justifyContent: 'space-between',
  },
  button:{
    flex: 1,
    backgroundColor: '#1E90FF',
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
  display: {
    marginBottom: 55,
    fontFamily: 'Horizon',
    fontSize: 40,
    fontWeight: "bold",
    color: '#00FFFF',
    textAlign: "center",
    marginLeft: 0,
    textShadowOffset: {
      width: 1, height: 1
  },
  textShadowRadius: 2,
  textShadowColor: '#008080',
  },
  input: {
    backgroundColor: 'white',
    width: "80%",
    marginBottom: 14,
    marginLeft: 45,
    padding: 8,
    borderRadius: 10,
  },
  textodisplay: {
    marginBottom: 5,
    fontSize: 20,
    color: 'white',
    fontWeight: "bold",
    marginLeft: 53,
    textShadowOffset: {
    width: 1, height: 1
  },
  textShadowRadius: 5,
  textShadowColor: '#1E90FF',
  },
  textobotao: {
    color: '#fff',
    fontWeight: "bold",
    fontSize: 15,
  },
  textobotaovoltar: {
    fontWeight: "bold",
    color: 'white',
    fontSize: 15,
    textShadowOffset: {
    width: 1, height: 1
  },
  textShadowRadius: 10,
  textShadowColor: '#1E90FF',
  },
});
