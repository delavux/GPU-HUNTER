
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Informe seu e-mail e sua senha.');
      return;
    }

    try {
      setLoading(true);

      const emailLogin = email.trim().toLowerCase();

      const resposta = await api.post('/auth/login', {
        email: emailLogin,
        senha,
      });

      const token = resposta.data.token;

      if (!token) {
        throw new Error('A API não retornou o token de autenticação.');
      }

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('usuarioEmail', emailLogin);

      Alert.alert(
        'Login realizado!',
        'Bem-vindo ao GPU HUNTER!',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Principal'),
          },
        ]
      );

    } catch (error) {
      console.log('Erro no login:', error.response?.data || error.message);

      Alert.alert(
        'Falha no login',
        error.response?.data?.mensagem ||
        error.response?.data?.erro ||
        error.message ||
        'E-mail ou senha incorretos.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Ionicons
          name="hardware-chip"
          size={65}
          color="#38BDF8"
          style={styles.logo}
        />

        <Text style={styles.title}>GPU HUNTER</Text>

        <Text style={styles.subtitle}>
          Entre e acompanhe as melhores oportunidades.
        </Text>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Entrar na sua conta</Text>

          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#64748B"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Senha</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Sua senha"
              placeholderTextColor="#64748B"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
            />

            <Pressable onPress={() => setMostrarSenha(!mostrarSenha)}>
              <Ionicons
                name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#94A3B8"
              />
            </Pressable>
          </View>

          <Pressable
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={entrar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0B1120" />
            ) : (
              <Text style={styles.buttonText}>ENTRAR</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.registerText}>
              Não tem conta?{' '}
              <Text style={styles.link}>Criar cadastro</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  form: {
    backgroundColor: '#111C30',
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#263750',
  },
  formTitle: {
    color: '#F8FAFC',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    color: '#CBD5E1',
    marginTop: 18,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0B1120',
    borderWidth: 1,
    borderColor: '#263750',
    borderRadius: 10,
    padding: 14,
    color: '#F8FAFC',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1120',
    borderWidth: 1,
    borderColor: '#263750',
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    color: '#F8FAFC',
  },
  button: {
    backgroundColor: '#38BDF8',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: {
    color: '#0B1120',
    fontWeight: '900',
    letterSpacing: 1,
  },
  registerText: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 22,
  },
  link: {
    color: '#38BDF8',
    fontWeight: 'bold',
  },
});
