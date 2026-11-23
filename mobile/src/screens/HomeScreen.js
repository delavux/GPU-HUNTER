
import React, { useEffect, useState, useCallback } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TextInput,
  Pressable,
  RefreshControl,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { imagensGPUs } from '../dados/imagensGPUs';

export default function HomeScreen({ navigation }) {
  const [gpus, setGpus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  const carregarGPUs = useCallback(async (atualizar = false) => {
    try {
      if (atualizar) setRefreshing(true);
      else setLoading(true);

      setErro('');

      const resposta = await api.get('/gpus');
      setGpus(resposta.data);
    } catch (error) {
      setErro('Não foi possível conectar ao servidor.');
      console.log('Erro ao carregar GPUs:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarGPUs();
  }, [carregarGPUs]);

  const gpusFiltradas = gpus.filter((gpu) => {
    const termo = busca.toLowerCase();

    return (
      gpu.nome.toLowerCase().includes(termo) ||
      gpu.fabricante.toLowerCase().includes(termo)
    );
  });

  function abrirDetalhes(gpu) {
    navigation.navigate('Detalhes', { gpu });
  }

  function renderizarGPU({ item }) {
    const fabricante = item.fabricante.toLowerCase();
    const ehAMD = fabricante.includes('amd');
    const imagem = imagensGPUs[item.id];

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        onPress={() => abrirDetalhes(item)}
      >
        <View style={styles.cardTop}>
          <View style={styles.gpuIcon}>
            {imagem ? (
              <Image
                source={imagem}
                style={styles.gpuImage}
                resizeMode="contain"
              />
            ) : (
              <Ionicons
                name="hardware-chip-outline"
                size={29}
                color="#38BDF8"
              />
            )}
          </View>

          <View style={styles.fabricanteContainer}>
            <Text style={styles.fabricante}>{item.fabricante}</Text>

            <Text style={styles.disponivel}>
              <Ionicons name="checkmark-circle" size={11} color="#4ADE80" />
              {' '}Monitoramento disponível
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={21} color="#64748B" />
        </View>

        <Text style={styles.nome}>{item.nome}</Text>

        <View style={styles.cardFooter}>
          <View style={[
            styles.badge,
            { backgroundColor: ehAMD ? '#7C3AED22' : '#2563EB22' },
          ]}>
            <Text style={[
              styles.badgeText,
              { color: ehAMD ? '#C4B5FD' : '#60A5FA' },
            ]}>
              {ehAMD ? 'AMD RADEON' : 'NVIDIA GEFORCE'}
            </Text>
          </View>

          <Text style={styles.verDetalhes}>
            Ver análise <Ionicons name="arrow-forward" size={12} color="#38BDF8" />
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={gpusFiltradas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderizarGPU}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => carregarGPUs(true)}
            tintColor="#38BDF8"
          />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.logo}>GPU HUNTER</Text>
                <Text style={styles.subtitulo}>INTELIGÊNCIA DE PREÇOS</Text>
              </View>

              <Pressable
                style={styles.refreshButton}
                onPress={() => carregarGPUs(true)}
              >
                <Ionicons name="refresh" size={21} color="#38BDF8" />
              </Pressable>
            </View>

            <View style={styles.hero}>
              <View style={styles.heroBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.heroBadgeText}>RADAR DE HARDWARE</Text>
              </View>

              <Text style={styles.titulo}>
                Encontre sua próxima <Text style={styles.tituloDestaque}>GPU.</Text>
              </Text>

              <Text style={styles.descricao}>
                Compare históricos de preços e descubra o melhor momento
                para investir na sua próxima placa de vídeo.
              </Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="hardware-chip-outline" size={22} color="#38BDF8" />
                <Text style={styles.statNumber}>{gpus.length}</Text>
                <Text style={styles.statLabel}>GPUs monitoradas</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="analytics-outline" size={22} color="#4ADE80" />
                <Text style={styles.statNumber}>1.065</Text>
                <Text style={styles.statLabel}>Registros históricos</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>CATÁLOGO DE GPUs</Text>
                <Text style={styles.sectionSubtitle}>
                  Selecione uma placa para ver sua análise
                </Text>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar placa de vídeo..."
                placeholderTextColor="#64748B"
                value={busca}
                onChangeText={setBusca}
                autoCapitalize="none"
              />

              {busca.length > 0 && (
                <Pressable onPress={() => setBusca('')}>
                  <Ionicons name="close-circle" size={19} color="#64748B" />
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.feedback}>
              <ActivityIndicator size="large" color="#38BDF8" />
              <Text style={styles.feedbackText}>Carregando catálogo...</Text>
            </View>
          ) : erro ? (
            <View style={styles.feedback}>
              <Ionicons name="cloud-offline-outline" size={38} color="#F87171" />
              <Text style={styles.erro}>{erro}</Text>
              <Pressable style={styles.retryButton} onPress={() => carregarGPUs()}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.feedback}>
              <Ionicons name="search-outline" size={38} color="#64748B" />
              <Text style={styles.feedbackText}>Nenhuma GPU encontrada.</Text>
            </View>
          )
        }
        ListFooterComponent={
          !loading && !erro && gpusFiltradas.length > 0 ? (
            <Text style={styles.footer}>GPU HUNTER â€¢ MONITORAMENTO DE PREÃ‡OS</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1120' },
  lista: { paddingHorizontal: 20, paddingTop: 55, paddingBottom: 25, flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 35 },
  logo: { color: '#38BDF8', fontSize: 25, fontWeight: '900', letterSpacing: 2 },
  subtitulo: { color: '#64748B', fontSize: 9, letterSpacing: 3, marginTop: 5 },
  refreshButton: { backgroundColor: '#172338', borderWidth: 1, borderColor: '#263750', width: 43, height: 43, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  hero: { marginBottom: 25 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#38BDF815', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20, marginBottom: 17 },
  statusDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: '#4ADE80', marginRight: 7 },
  heroBadgeText: { color: '#38BDF8', fontSize: 9, fontWeight: 'bold', letterSpacing: 1.5 },
  titulo: { color: '#F8FAFC', fontSize: 31, fontWeight: '900', lineHeight: 39 },
  tituloDestaque: { color: '#38BDF8' },
  descricao: { color: '#94A3B8', fontSize: 13, lineHeight: 21, marginTop: 12 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 35 },
  statCard: { flex: 1, backgroundColor: '#172338', borderRadius: 15, padding: 16, borderWidth: 1, borderColor: '#263750' },
  statNumber: { color: '#F8FAFC', fontSize: 25, fontWeight: 'bold', marginTop: 10 },
  statLabel: { color: '#94A3B8', fontSize: 11, marginTop: 5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: 'bold', letterSpacing: 1.5 },
  sectionSubtitle: { color: '#64748B', fontSize: 11, marginTop: 5 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#172338', borderRadius: 13, paddingHorizontal: 14, height: 51, borderWidth: 1, borderColor: '#263750', marginBottom: 20 },
  searchInput: { flex: 1, color: '#F8FAFC', marginLeft: 10, fontSize: 13 },
  card: { backgroundColor: '#172338', padding: 17, borderRadius: 16, marginBottom: 13, borderWidth: 1, borderColor: '#263750' },
  cardPressed: { opacity: 0.75, borderColor: '#38BDF8' },
  cardTop: { flexDirection: 'row', alignItems: 'center' },

gpuIcon: {
  width: 110,
  height: 80,
  borderRadius: 12,
  backgroundColor: '#0B1120',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 14,
  overflow: 'hidden',
},

gpuImage: {
  width: '100%',
  height: '100%',
},
  gpuImage: { width: '100%', height: '100%' },
  fabricanteContainer: { flex: 1 },
  fabricante: { color: '#38BDF8', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  disponivel: { color: '#4ADE80', fontSize: 10, marginTop: 6 },
  nome: { color: '#F8FAFC', fontSize: 21, fontWeight: 'bold', marginTop: 17 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 17, paddingTop: 13, borderTopWidth: 1, borderTopColor: '#263750' },
  badge: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 7 },
  badgeText: { fontSize: 9, fontWeight: 'bold', letterSpacing: 0.6 },
  verDetalhes: { color: '#38BDF8', fontSize: 11, fontWeight: 'bold' },
  feedback: { alignItems: 'center', justifyContent: 'center', paddingVertical: 35 },
  feedbackText: { color: '#94A3B8', marginTop: 12, fontSize: 13 },
  erro: { color: '#F87171', marginTop: 12, textAlign: 'center' },
  retryButton: { backgroundColor: '#172338', padding: 12, borderRadius: 9, marginTop: 15 },
  retryText: { color: '#38BDF8', fontWeight: 'bold' },
  footer: { color: '#475569', fontSize: 9, textAlign: 'center', marginTop: 15, letterSpacing: 1 },
});

