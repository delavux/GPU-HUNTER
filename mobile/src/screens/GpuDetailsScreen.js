
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { imagensGPUs } from '../dados/imagensGPUs';

export default function GpuDetailsScreen({ route }) {
  const { gpu } = route.params;

  const [historico, setHistorico] = useState([]);
  const [analise, setAnalise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const imagem = imagensGPUs[gpu.id];

  useEffect(() => {
    async function carregarDetalhes() {
      try {
        const [historicoResponse, analiseResponse] = await Promise.all([
          api.get(`/gpus/${gpu.id}/historico`),
          api.get(`/gpus/${gpu.id}/analise`),
        ]);

        setHistorico(historicoResponse.data.historico || []);
        setAnalise(analiseResponse.data.analise);
      } catch (error) {
        console.log('Erro nos detalhes:', error.response?.data || error.message);
        setErro('Não foi possível carregar os detalhes desta GPU.');
      } finally {
        setLoading(false);
      }
    }

    carregarDetalhes();
  }, [gpu.id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.muted}>Carregando histórico...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{erro}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {imagem ? (
          <Image
            source={imagem}
            style={styles.gpuImage}
            resizeMode="contain"
          />
        ) : (
          <Ionicons name="hardware-chip-outline" size={100} color="#38BDF8" />
        )}
      </View>

      <Text style={styles.label}>{gpu.fabricante}</Text>
      <Text style={styles.title}>{gpu.nome}</Text>

      <Text style={styles.sectionTitle}>ANÁLISE HISTÓRICA</Text>

      {analise && (
        <View style={styles.card}>
          <Text style={styles.metricLabel}>Menor preço registrado</Text>
          <Text style={styles.price}>
            R$ {Number(analise.menor_preco).toFixed(2)}
          </Text>

          <Text style={styles.metricLabel}>Preço médio histórico</Text>
          <Text style={styles.value}>
            R$ {Number(analise.preco_medio).toFixed(2)}
          </Text>

          <Text style={styles.metricLabel}>Maior preço registrado</Text>
          <Text style={styles.value}>
            R$ {Number(analise.maior_preco).toFixed(2)}
          </Text>

          <Text style={styles.metricLabel}>Registros históricos</Text>
          <Text style={styles.value}>{analise.total_registros}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>HISTÓRICO DE PREÇOS</Text>

      {historico.map((item, index) => (
        <View style={styles.historyRow} key={item.id ?? index}>
          <Text style={styles.date}>
            {item.data_observacao ?? item.data_registro ?? 'Data não informada'}
          </Text>
          <Text style={styles.priceSmall}>
            R$ {Number(item.preco_minimo ?? item.preco).toFixed(2)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1120', padding: 20 },
  center: { flex: 1, backgroundColor: '#0B1120', justifyContent: 'center', alignItems: 'center' },
  imageContainer: { height: 210, backgroundColor: '#172338', borderRadius: 18, marginTop: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  gpuImage: { width: '100%', height: '100%' },
  label: { color: '#38BDF8', fontWeight: 'bold', marginTop: 25 },
  title: { color: '#F8FAFC', fontSize: 30, fontWeight: 'bold', marginTop: 8 },
  sectionTitle: { color: '#64748B', fontWeight: 'bold', letterSpacing: 2, marginTop: 30, marginBottom: 14 },
  card: { backgroundColor: '#172338', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#263750' },
  metricLabel: { color: '#94A3B8', marginTop: 12 },
  price: { color: '#4ADE80', fontSize: 27, fontWeight: 'bold', marginTop: 5 },
  value: { color: '#F8FAFC', fontSize: 19, fontWeight: 'bold', marginTop: 5 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#172338', padding: 15, borderRadius: 10, marginBottom: 8 },
  date: { color: '#94A3B8' },
  priceSmall: { color: '#4ADE80', fontWeight: 'bold' },
  muted: { color: '#94A3B8', marginTop: 12 },
  error: { color: '#F87171', padding: 20 },
});
