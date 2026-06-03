import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const DATA = {
  Sesiones: [
    { pos: 1, nombre: 'Luis Torres', valor: '28 sesiones', extra: '+4 vs semana pasada' },
    { pos: 2, nombre: 'María García', valor: '24 sesiones', extra: 'Racha 12 días' },
    { pos: 3, nombre: 'Tú', valor: '20 sesiones', extra: 'Meta 80% completada' },
  ],
  Fuerza: [
    { pos: 1, nombre: 'Tú', valor: '115 kg peso muerto', extra: '+7 kg este mes' },
    { pos: 2, nombre: 'Luis Torres', valor: '108 kg peso muerto', extra: '+3 kg este mes' },
    { pos: 3, nombre: 'María García', valor: '72 kg sentadilla', extra: '+5 kg este mes' },
  ],
  Consistencia: [
    { pos: 1, nombre: 'María García', valor: '92% adherencia', extra: '11/12 semanas' },
    { pos: 2, nombre: 'Tú', valor: '86% adherencia', extra: 'Racha 14 días' },
    { pos: 3, nombre: 'Luis Torres', valor: '81% adherencia', extra: 'Racha 8 días' },
  ],
};

const MEDALLAS = ['🥇', '🥈', '🥉'];

export default function RankingScreen({ navigation }) {
  const [categoria, setCategoria] = useState('Sesiones');
  const ranking = DATA[categoria];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={styles.backBtn}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Ranking</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>RF69 · RF70</Text>
          <Text style={styles.heroTitle}>Rankings amistosos</Text>
          <Text style={styles.heroSub}>Comparativas visuales entre amigos con permisos de privacidad activos.</Text>
        </View>

        <View style={styles.chipsRow}>
          {Object.keys(DATA).map(c => (
            <TouchableOpacity key={c} onPress={() => setCategoria(c)} style={[styles.chip, categoria === c && styles.chipActive]}>
              <Text style={[styles.chipText, categoria === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.podiumCard}>
          <Text style={styles.sectionTitle}>Top del mes · {categoria}</Text>
          {ranking.map((r, i) => {
            const isMe = r.nombre === 'Tú';
            return (
              <View key={r.nombre} style={[styles.rankRow, isMe && styles.meRow]}>
                <Text style={styles.medal}>{MEDALLAS[i]}</Text>
                <View style={styles.avatar}><Text style={styles.avatarText}>{r.nombre === 'Tú' ? 'YO' : r.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rankName}>{r.nombre}</Text>
                  <Text style={styles.rankExtra}>{r.extra}</Text>
                </View>
                <Text style={styles.rankValue}>{r.valor}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.compareCard}>
          <Text style={styles.sectionTitle}>Comparación rápida</Text>
          <Text style={styles.sectionSub}>Tú vs líder actual</Text>
          <View style={styles.compareRow}>
            <View style={styles.compareBox}><Text style={styles.compareValue}>{ranking.find(r => r.nombre === 'Tú')?.valor || '—'}</Text><Text style={styles.compareLabel}>Tu métrica</Text></View>
            <Text style={styles.vs}>VS</Text>
            <View style={styles.compareBox}><Text style={styles.compareValue}>{ranking[0].valor}</Text><Text style={styles.compareLabel}>Líder</Text></View>
          </View>
        </View>

        <Text style={styles.privacyNote}>🔒 Las notas de entrenamiento no se comparten por defecto; solo métricas permitidas por privacidad.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13132a' },
  header: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a35', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' },
  backText: { color: 'white', fontSize: 22, fontWeight: '700' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '800' },
  content: { padding: 20, paddingBottom: 42 },
  heroCard: { backgroundColor: '#2a2a35', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#393948', marginBottom: 14 },
  badge: { color: '#ffa032', fontSize: 11, fontWeight: '800', marginBottom: 8 },
  heroTitle: { color: 'white', fontSize: 21, fontWeight: '900' },
  heroSub: { color: '#9a9aa8', fontSize: 12, lineHeight: 18, marginTop: 5 },
  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10, backgroundColor: '#24242f', borderWidth: 1, borderColor: '#333' },
  chipActive: { backgroundColor: 'rgba(255,160,50,0.18)', borderColor: '#ffa032' },
  chipText: { color: '#888', fontSize: 11, fontWeight: '900' },
  chipTextActive: { color: '#ffa032' },
  podiumCard: { backgroundColor: '#2a2a35', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#333', marginBottom: 14 },
  sectionTitle: { color: 'white', fontSize: 15, fontWeight: '900', marginBottom: 10 },
  sectionSub: { color: '#888', fontSize: 11, marginTop: -6, marginBottom: 12 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#333' },
  meRow: { backgroundColor: 'rgba(124,111,205,0.13)', marginHorizontal: -8, paddingHorizontal: 8, borderRadius: 12 },
  medal: { fontSize: 24, width: 30, textAlign: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#7c6fcd', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: 'white', fontSize: 11, fontWeight: '900' },
  rankName: { color: 'white', fontSize: 14, fontWeight: '900' },
  rankExtra: { color: '#888', fontSize: 11, marginTop: 3 },
  rankValue: { color: '#5eead4', fontSize: 11, fontWeight: '900', maxWidth: 88, textAlign: 'right' },
  compareCard: { backgroundColor: 'rgba(94,234,212,0.1)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(94,234,212,0.28)', marginBottom: 14 },
  compareRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  compareBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12 },
  compareValue: { color: 'white', fontSize: 13, fontWeight: '900' },
  compareLabel: { color: '#a5a5b4', fontSize: 10, marginTop: 4 },
  vs: { color: '#5eead4', fontWeight: '900', fontSize: 12 },
  privacyNote: { color: '#9a9aa8', fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 6 },
});