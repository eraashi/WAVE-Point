import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StyleSheet, ScrollView, Text, View, Alert, ImageBackground, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import { Routes } from './routes';
import { Ionicons } from '@expo/vector-icons'
import { Edicao } from './pages/Edicao';
import { Login } from './pages/Login';
import * as Location from 'expo-location';

const Drawer = createDrawerNavigator();

export function DrawerRoutes({route, navigation}){

    const {id, email, senha, cpf, nome, endereco, enderecoLogin} = route.params;

    const DrawerContent = (props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <View style={{ marginTop: 696 }}>
              <Button
                title="Sair"
                onPress={() => navigation.navigate(Login)}
              />
            </View>
          </DrawerContentScrollView>
        );
      };

    return(
        <Drawer.Navigator screenOptions={{headerTitle: ''}}
        drawerContent={props => <DrawerContent {...props} />}
        >
            <Drawer.Screen
            name = "home"
            component={Routes}
            initialParams={{id: id, cpf: cpf, nome: nome, email: email, senha: senha, endereco: endereco, enderecoLogin: enderecoLogin}}
            options={{
                drawerIcon: ({color, size}) => <Ionicons name="home" color={color} size={size}/>,
                title: 'Início'
            }}
            />
            <Drawer.Screen
            name = "perfil"
            component={Edicao}
            initialParams={{id: id, cpf: cpf, nome: nome, email: email, senha: senha, endereco: endereco, enderecoLogin: enderecoLogin}}
            options={{
                drawerIcon: ({color, size}) => <Ionicons name="person-circle-outline" color={color} size={size}/>,
                title: 'Meu Perfil'
            }}
            />
        </Drawer.Navigator>
    )
}
