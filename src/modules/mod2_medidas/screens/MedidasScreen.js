import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';

export default function MedidasScreen({ navigation }) {
  const registros = [
    { date: '10 Mar', peso: 74.2, cm: '88/72/96' },
    { date: '25 Feb', peso: 75.0, cm: '89/73/97' },
    { date: '10 Feb', peso: 75.8, cm: '90/74/98' },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Medidas corporales</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MedidasReg')} style={s.actionBtn}>
          <Text style={s.actionText}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>

        {/* Badge */}
        <View style={s.badge}>
          <Text style={s.badgeText}>RF07–RF11</Text>
        </View>

        {/* Última medición card */}
        <View style={s.accentCard}>
          <Text style={s.accentLabel}>Última medición — 10 Mar 2026</Text>
          <View style={s.metricsRow}>
            {[
              { v: '74.2', u: 'kg', l: 'Peso' },
              { v: '1.76', u: 'm', l: 'Altura' },
              { v: '23.9', u: 'IMC', l: '' },
            ].map((m, i) => (
              <View key={i} style={s.metricItem}>
                <Text style={s.metricValue}>
                  {m.v}
                  <Text style={s.metricUnit}>{m.u}</Text>
                </Text>
                <Text style={s.metricLabel}>{m.l || m.u}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sección historial */}
        <Text style={s.sectionLabel}>Historial de medidas</Text>

        {registros.map((r, i) => {
          const diff = (r.peso - 74.2).toFixed(1);
          const isDown = r.peso < 75.0;
          return (
            <TouchableOpacity
              key={i}
              style={s.card}
              onPress={() => navigation.navigate('MedidasHist')}
            >
              <View style={s.cardIcon}>
                <Text style={s.cardIconText}>📏</Text>
              </View>
              <View style={s.cardContent}>
                <Text style={s.cardTitle}>{r.date}</Text>
                <Text style={s.cardSub}>{r.peso} kg · {r.cm} cm</Text>
              </View>
              <Text style={[s.diffText, { color: isDown ? '#34d399' : '#f87171' }]}>
                {isDown ? '▼' : '▲'} {Math.abs(diff)} kg
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Botones */}
        <TouchableOpacity style={s.btnPrimary} onPress={() => navigation.navigate('MedidasReg')}>
          <Text style={s.btnPrimaryText}>+ Nueva medición</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnOutline} onPress={() => navigation.navigate('MedidasHist')}>
          <Text style={s.btnOutlineText}>Ver gráficas →</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#1a1a22' },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#2a2a35' },
  backBtn:       { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' },
  backText:      { color: 'white', fontSize: 18, fontWeight: '600' },
  headerTitle:   { fontSize: 17, fontWeight: '800', color: 'white' },
  actionBtn:     { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' },
  actionText:    { color: '#7c6fcd', fontSize: 20, fontWeight: '700' },

  body:          { padding: 16, paddingBottom: 40 },

  badge:         { alignSelf: 'flex-start', backgroundColor: 'rgba(94,234,212,0.12)', borderWidth: 1, borderColor: 'rgba(94,234,212,0.3)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 14 },
  badgeText:     { fontSize: 10, fontWeight: '700', color: '#5eead4' },

  accentCard:    { backgroundColor: '#7c6fcd', borderRadius: 16, padding: 18, marginBottom: 20 },
  accentLabel:   { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 12 },
  metricsRow:    { flexDirection: 'row', justifyContent: 'space-around' },
  metricItem:    { alignItems: 'center' },
  metricValue:   { fontSize: 22, fontWeight: '800', color: 'white' },
  metricUnit:    { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  metricLabel:   { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  sectionLabel:  { fontSize: 12, fontWeight: '700', color: '#666', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

  card:          { backgroundColor: '#2a2a35', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  cardIcon:      { width: 42, height: 42, backgroundColor: '#1a1a22', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardIconText:  { fontSize: 20 },
  cardContent:   { flex: 1 },
  cardTitle:     { fontSize: 14, fontWeight: '700', color: 'white' },
  cardSub:       { fontSize: 12, color: '#888', marginTop: 2 },
  diffText:      { fontSize: 12, fontWeight: '700' },

  btnPrimary:    { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnPrimaryText:{ color: 'white', fontWeight: '700', fontSize: 15 },
  btnOutline:    { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#3a3a45' },
  btnOutlineText:{ color: '#aaa', fontWeight: '600', fontSize: 14 },
});
