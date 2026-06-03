import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const OPCIONES = [
  { key: 'entrenamientos', icon: '🏋️', title: 'Compartir entrenamientos', sub: 'Visible para amigos y grupos', initial: true },
  { key: 'progreso', icon: '📊', title: 'Compartir progreso', sub: 'Permite comparativas y rankings', initial: true },
  { key: 'medidas', icon: '📏', title: 'Compartir medidas corporales', sub: 'Peso, cintura y evolución corporal', initial: false },
  { key: 'notas', icon: '📝', title: 'Compartir notas de entrenamiento', sub: 'Desactivado por seguridad y privacidad', initial: false },
];

export default function PrivacidadScreen({ navigation }) {
  const [permisos, setPermisos] = useState(Object.fromEntries(OPCIONES.map(o => [o.key, o.initial])));
  const activos = Object.values(permisos).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={styles.backBtn}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidad</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>RF67 · RF68 · RNF29</Text>
          <Text style={styles.heroTitle}>Permisos sociales</Text>
          <Text style={styles.heroSub}>Controla qué información pueden ver tus amigos. Las notas no se comparten por defecto.</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{activos}/{OPCIONES.length}</Text>
          <Text style={styles.summaryLabel}>permisos activos</Text>
          <Text style={styles.summarySub}>Esto afecta visualización de progreso, comparativas y ranking.</Text>
        </View>

        {OPCIONES.map(o => {
          const active = permisos[o.key];
          return (
            <TouchableOpacity key={o.key} style={styles.optionCard} onPress={() => setPermisos(prev => ({ ...prev, [o.key]: !prev[o.key] }))} activeOpacity={0.78}>
              <Text style={styles.optionIcon}>{o.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>{o.title}</Text>
                <Text style={styles.optionSub}>{o.sub}</Text>
              </View>
              <View style={[styles.switchTrack, active && styles.switchTrackOn]}>
                <View style={[styles.switchKnob, active && styles.switchKnobOn]} />
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>🔒 Regla de privacidad</Text>
          <Text style={styles.warningText}>Las notas de sesión, ejercicio o serie se muestran en tu historial personal, pero no entran en dashboard social ni rankings.</Text>
        </View>
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
  badge: { color: '#f87171', fontSize: 11, fontWeight: '800', marginBottom: 8 },
  heroTitle: { color: 'white', fontSize: 21, fontWeight: '900' },
  heroSub: { color: '#9a9aa8', fontSize: 12, lineHeight: 18, marginTop: 5 },
  summaryCard: { backgroundColor: 'rgba(124,111,205,0.14)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(124,111,205,0.32)', marginBottom: 14 },
  summaryValue: { color: 'white', fontSize: 28, fontWeight: '900' },
  summaryLabel: { color: '#5eead4', fontSize: 12, fontWeight: '900', marginTop: 2 },
  summarySub: { color: '#a5a5b4', fontSize: 11, lineHeight: 17, marginTop: 8 },
  optionCard: { backgroundColor: '#2a2a35', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#333', marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  optionTitle: { color: 'white', fontSize: 14, fontWeight: '900' },
  optionSub: { color: '#888', fontSize: 11, marginTop: 3, lineHeight: 16 },
  switchTrack: { width: 46, height: 26, borderRadius: 13, backgroundColor: '#3a3a49', padding: 3, justifyContent: 'center' },
  switchTrackOn: { backgroundColor: '#7c6fcd' },
  switchKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#aaa' },
  switchKnobOn: { alignSelf: 'flex-end', backgroundColor: 'white' },
  warningCard: { backgroundColor: 'rgba(248,113,113,0.08)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(248,113,113,0.28)', marginTop: 4 },
  warningTitle: { color: '#f87171', fontSize: 13, fontWeight: '900', marginBottom: 5 },
  warningText: { color: '#c7c7d6', fontSize: 11, lineHeight: 17 },
});