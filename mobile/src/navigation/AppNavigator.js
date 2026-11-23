
import React from 'react';
import { View, Text } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import GpuDetailsScreen from '../screens/GpuDetailsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PlaceholderScreen({ route }) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#0B1120',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{ color: '#F8FAFC', fontSize: 22 }}>
        {route.name}
      </Text>

      <Text style={{ color: '#94A3B8', marginTop: 8 }}>
        Em desenvolvimento
      </Text>
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#111C30',
          borderTopColor: '#263750',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#64748B',

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size }) => {
          const icons = {
            Início: 'home-outline',
            Explorar: 'search-outline',
            Favoritos: 'heart-outline',
            Perfil: 'person-outline',
          };

          return (
            <Ionicons
              name={icons[route.name]}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Explorar" component={PlaceholderScreen} />
      <Tab.Screen name="Favoritos" component={PlaceholderScreen} />
      <Tab.Screen name="Perfil" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#111C30',
          },
          headerTintColor: '#F8FAFC',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Entrar',
          }}
        />

        <Stack.Screen
          name="Cadastro"
          component={RegisterScreen}
          options={{
            title: 'Criar conta',
          }}
        />

        <Stack.Screen
          name="Principal"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Detalhes"
          component={GpuDetailsScreen}
          options={{
            title: 'Detalhes da GPU',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
