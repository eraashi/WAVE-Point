import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, ScrollView, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('WaveDB');

export function Historico({ route }) {

  const {id, email, senha, cpf, nome, endereco, enderecoLogin } = route.params;

  const [itens, setItens] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleExpand = (dia) => {
    setExpandedItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [dia]: !prevExpandedItems[dia],
    }));
  };

  const isItemExpanded = (dia) => {
    return expandedItems[dia];
  };

  const carregarTabelaRegistro = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM RegistroPonto WHERE idFuncionario=? ORDER BY id DESC',
        [id],
        (_, { rows }) => {
          setItens(rows._array);
        }
      );
    });
  };

  useEffect(() => {
    carregarTabelaRegistro();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarTabelaRegistro();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleExpand(item.dia)}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Registros do dia: {item.dia}</Text>
        {isItemExpanded(item.dia) && (
          <View style={styles.detailsContainer}>
            <Text style={styles.texto}>Nome: {item.nome}</Text>
            <Text style={styles.texto}>Entrada: {item.hora1}</Text>
            <Text style={styles.texto}>Saída para Almoço: {item.hora2}</Text>
            <Text style={styles.texto}>Volta do Almoço: {item.hora3}</Text>
            <Text style={styles.texto}>Saída: {item.hora4}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require("./src/Degradefundo (2)_20240428_105938_0003.png")} style={styles.background}>
      <SafeAreaView style={{ flex: 1, }}>
        <View style={styles.header}>
          <Text style={styles.textodisplay}>
            Este é o seu histórico de Registro de Ponto na WAVEPoint!</Text>
        </View>

          <FlatList style={styles.container}
            data={itens}
            renderItem={renderItem}
            keyExtractor={(item) => item.idFuncionario}
          />
        
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  content:{
    
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: "white",
  },
  detailsContainer: {
    paddingLeft: 20,
  },
  itemContainer: {
    padding: 10,
    backgroundColor: '#1E90FF',
    marginBottom: 5,
    borderRadius: 8,
  },
  texto: {
    color: "white",
    fontWeight: "bold",
  },
  caixa: {
    backgroundColor: "#6495ED",
    padding: 14,
    width: "100%",
    marginBottom: 14,
    borderRadius: 8,
    //flexDirection: 'row',
    //alignItems: 'center',
    //justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 14,
    
  },
  header: {
    backgroundColor: '#1E90FF',
    marginTop: -30,
    paddingTop: 100,
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 14,
  },
  textodisplay: {
    marginBottom: 10,
    fontSize: 22,
    color: 'white',
    fontWeight: "bold",
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  }
})