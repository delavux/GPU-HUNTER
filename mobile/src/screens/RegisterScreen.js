
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
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  async function cadastrar() {
    const emailCadastro = email.trim().toLowerCase();

    if (!nome.trim() || !emailCadastro || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (!emailCadastro.includes('@') || !emailCadastro.includes('.')) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Senha inválida', 'A senha deve possuir pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    try {
      setLoading(true);

      const resposta = await api.post('/auth/cadastro', {
        nome: nome.trim(),
        email: emailCadastro,
        senha,
      });

      await AsyncStorage.setItem('usuarioEmail', emailCadastro);
      await AsyncStorage.setItem('usuarioNome', nome.trim());

      Alert.alert(
        'Cadastro concluído!',
        resposta.data?.mensagem || 'Sua conta foi criada com sucesso. Agora você já pode entrar no GPU HUNTER.',
        [
          {
            text: 'Ir para login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );

    } catch (error) {
      console.log('Erro no cadastro:', error.response?.data || error.message);

      Alert.alert(
        'Erro no cadastro',
        error.response?.data?.mensagem ||
        error.response?.data?.erro ||
        'Não foi possível criar sua conta. Tente novamente.'
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
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Ionicons name="hardware-chip" size={55} color="#38BDF8" />
        </View>

        <Text style={styles.title}>GPU HUNTER</Text>

        <Text style={styles.subtitle}>
          Crie sua conta e acompanhe os melhores preços de placas de vídeo.
        </Text>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Criar conta</Text>

          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#64748B"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />

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
              placeholder="Crie uma senha"
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

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#64748B"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={!mostrarSenha}
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={cadastrar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0B1120" />
            ) : (
              <Text style={styles.buttonText}>CRIAR MINHA CONTA</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Já possui uma conta?{' '}
              <Text style={styles.loginLink}>Entrar</Text>
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          GPU HUNTER • MONITORE. COMPARE. ECONOMIZE.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 29,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 28,
    lineHeight: 20,
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
    marginBottom: 8,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 17,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0B1120',
    borderWidth: 1,
    borderColor: '#263750',
    borderRadius: 10,
    padding: 14,
    color: '#F8FAFC',
    fontSize: 14,
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
    fontSize: 14,
  },
  button: {
    backgroundColor: '#38BDF8',
    padding: 17,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0B1120',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  loginText: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 22,
    fontSize: 13,
  },
  loginLink: {
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  footer: {
    color: '#475569',
    textAlign: 'center',
    fontSize: 9,
    marginTop: 25,
    letterSpacing: 1,
  },
});
