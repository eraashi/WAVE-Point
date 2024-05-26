import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { Routes } from './routes';
import { Historico } from './pages/Historico';
import { Ponto } from './pages/Ponto';
import { Edicao } from './pages/Edicao';
import { DrawerRoutes } from './drawer.routes';
import 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function Caminho() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Registro" 
        component={Registro}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Routes"
        component={Routes}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Ponto" 
        component={Ponto}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Historico" 
        component={Historico}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Edicao" 
        component={Edicao}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

