import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Historico } from "./pages/Historico"
import { Ponto } from "./pages/Ponto";
import React, {useState} from 'react';
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export function Routes({route}){

    const {email, senha, cpf, nome} = route.params;

    return(
        <Tab.Navigator>
            <Tab.Screen
            name="Ponto"
            component={Ponto}
            initialParams={{cpf: cpf, nome: nome, email: email, senha: senha}}
            />
            <Tab.Screen
            name="Historico"
            component={Historico}
            initialParams={{cpf: cpf, nome: nome, email: email, senha: senha}}
            />
        </Tab.Navigator>
    )
}