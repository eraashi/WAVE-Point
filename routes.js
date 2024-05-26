import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Historico } from "./pages/Historico"
import { Ponto } from "./pages/Ponto";
import { Login } from "./pages/Login";
import React, {useState} from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { Edicao } from './pages/Edicao';
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

export function Routes({route, navigation}){

    const {id, email, senha, cpf, nome, endereco, enderecoLogin} = route.params;

    const HandleLogout = () => {
        // Implemente o código para deslogar o usuário aqui
        // Por exemplo, limpar o estado ou a token de autenticação
        navigation.navigate('Login');
      };

    return(
        <Tab.Navigator initialRouteName= {'Ponto'} screenOptions={{
            headerShown: false,
            tabBarStyle: {
                height: 60,
                position: 'absolute',
                bottom: 20,
                right: 16,
                left: 16,
                borderRadius: 16,
                backgroundColor: '#1E90FF'
            },
            }}
            >
            <Tab.Screen
            name = "Perfil"
            component={Edicao}
            initialParams={{id: id, cpf: cpf, nome: nome, email: email, senha: senha, endereco: endereco, enderecoLogin: enderecoLogin}}
            options={{
                tabBarIcon: ({focused, color, size}) => {
                    if(focused){
                        return <Ionicons name="person-circle" color={'white'} size={size}/>
                    }
                    return <Ionicons name="person-circle-outline" color={'white'} size={size}/>
                },
            tabBarLabelStyle: {
                color: 'white',
                fontSize: 13,
            }
            }}
            />
            <Tab.Screen
            name="Ponto"
            component={Ponto}
            initialParams={{id: id, cpf: cpf, nome: nome, email: email, senha: senha, endereco: endereco, enderecoLogin: enderecoLogin}}
            options={{tabBarIcon: ({focused, size, color}) => {
                if(focused){
                    return <Ionicons size={size} color={'white'} name="location" />
                }
                return <Ionicons size={size} color={'white'} name="location-outline" />
            },
            tabBarLabelStyle: {
                color: 'white',
                fontSize: 13,
            }
            }}
            />
            <Tab.Screen
            name="Historico"
            component={Historico}
            initialParams={{id: id, cpf: cpf, nome: nome, email: email, senha: senha, endereco: endereco, enderecoLogin: enderecoLogin}}
            options={{headerShown: false, tabBarIcon: ({focused, size, color}) => {
                if(focused){
                    return <Ionicons size={size} color={'white'} name="book" />
                }
                return <Ionicons size={size} color={'white'} name="book-outline" />
            },
            tabBarLabelStyle: {
                color: 'white',
                fontSize: 13,
            }    
            }}
            />
            <Tab.Screen name="Sair" component={HandleLogout}
            options={{headerShown: false, tabBarIcon: ({focused, size, color}) => {
                if(focused){
                    return <Ionicons size={size} color={'white'} name="log-out" />
                }
                return <Ionicons size={size} color={'white'} name="log-out-outline" />
            },
            tabBarLabelStyle: {
                color: 'white',
                fontSize: 13,
            }    
            }}>
            </Tab.Screen>
        </Tab.Navigator>
    )
}