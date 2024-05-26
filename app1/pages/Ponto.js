import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export function Ponto({route}) {
    
    const {email, senha, cpf, nome} = route.params;

    return(
        <View style={styles.container}>
            <Text style={styles.textodisplay}>{nome}</Text>
            <Text style={styles.textodisplay}>Ponto</Text>
        <TouchableOpacity style={styles.button}>
            <Text style={styles.textobotao}>Ponto</Text>
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
})