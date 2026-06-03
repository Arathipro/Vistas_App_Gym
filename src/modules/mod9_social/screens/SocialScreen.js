import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const CARDS = [
  { icon: '🤝', title: 'Amigos', sub: '3 conexiones · 2 solicitudes pendientes', screen: 'Amigos', color: '#7c6fcd' },
  { icon: '👥', title: 'Grupos', sub: 'Gym DPUAS · avisos de entreno', screen: 'Grupos', color: '#5eead4' },
  { icon: '🏆', title: 'Ranking', sub: 'Comparativas amistosas del mes', screen: 'Ranking', color: '#ffa032' },
  { icon: '🔔', title: 'Notificaciones', sub: 'Actividad reciente y solicitudes', screen: 'Notificaciones', color: '#34d399' },
  { icon: '🔒', title: 'Privacidad', sub: 'Controla qué compartes', screen: 'Privacidad', color: '#f87171' },
];

export default function SocialScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backBtn}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Comunidad</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notificaciones')} style={styles.bellBtn}><Text>🔔</Text><View style={styles.dot} /></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.badge}>Módulo 9 · RF58–RF72</Text>
            <Text style={styles.heroTitle}>Tu comunidad fitness</Text>
            <Text style={styles.heroSub}>Busca amigos, acepta solicitudes, crea grupos y compite en rankings sanos.</Text>
          </View>
          <View style={styles.heroIcon}><Text style={{ fontSize: 30 }}>👥</Text></View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}><Text style={styles.statValue}>3</Text><Text style={styles.statLabel}>Amigos</Text></View>
          <View style={styles.statCard}><Text style={[styles.statValue, { color: '#5eead4' }]}>1</Text><Text style={styles.statLabel}>Grupo</Text></View>
          <View style={styles.statCard}><Text style={[styles.statValue, { color: '#ffa032' }]}>#3</Text><Text style={styles.statLabel}>Ranking</Text></View>
        </View>

        <Text style={styles.sectionLabel}>Flujo social demo</Text>
        {CARDS.map(card => (
          <TouchableOpacity key={card.screen} style={styles.navCard} onPress={() => navigation.navigate(card.screen)} activeOpacity={0.75}>
            <View style={[styles.navIconBox, { backgroundColor: `${card.color}22`, borderColor: `${card.color}55` }]}><Text style={styles.navIcon}>{card.icon}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.navTitle}>{card.title}</Text>
              <Text style={styles.navSub}>{card.sub}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.activityCard}>
          <Text style={styles.sectionTitle}>Actividad reciente</Text>
          {[
            ['🏋️', 'María comenzó entrenamiento', 'Hace 10 min · Grupo Gym DPUAS'],
            ['🤝', 'Juan Pérez envió solicitud', 'Pendiente de respuesta'],
            ['🏆', 'Luis subió al #1 del ranking', '28 sesiones este mes'],
          ].map((a, i) => (
            <View key={i} style={styles.activityRow}>
              <Text style={styles.activityIcon}>{a[0]}</Text>
              <View style={{ flex: 1 }}><Text style={styles.activityTitle}>{a[1]}</Text><Text style={styles.activitySub}>{a[2]}</Text></View>
            </View>
          ))}
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
  bellBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dot: { position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#f87171' },
  content: { padding: 20, paddingBottom: 42 },
  heroCard: { backgroundColor: '#2a2a35', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#393948', flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  badge: { color: '#5eead4', fontSize: 11, fontWeight: '800', marginBottom: 8 },
  heroTitle: { color: 'white', fontSize: 22, fontWeight: '900' },
  heroSub: { color: '#9a9aa8', fontSize: 12, lineHeight: 18, marginTop: 5 },
  heroIcon: { width: 58, height: 58, borderRadius: 18, backgroundColor: 'rgba(124,111,205,0.18)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(124,111,205,0.35)' },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  statCard: { flex: 1, backgroundColor: '#2a2a35', borderRadius: 15, padding: 14, borderWidth: 1, borderColor: '#333' },
  statValue: { color: 'white', fontSize: 23, fontWeight: '900' },
  statLabel: { color: '#888', fontSize: 10, marginTop: 2 },
  sectionLabel: { color: '#888', fontSize: 12, fontWeight: '800', marginBottom: 10 },
  navCard: { backgroundColor: '#2a2a35', borderRadius: 15, padding: 14, borderWidth: 1, borderColor: '#333', marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  navIconBox: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  navIcon: { fontSize: 22 },
  navTitle: { color: 'white', fontSize: 14, fontWeight: '900' },
  navSub: { color: '#888', fontSize: 11, marginTop: 3 },
  arrow: { color: '#666', fontSize: 24, fontWeight: '300' },
  activityCard: { backgroundColor: 'rgba(124,111,205,0.14)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(124,111,205,0.32)', marginTop: 4 },
  sectionTitle: { color: 'white', fontSize: 15, fontWeight: '900', marginBottom: 10 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  activityIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  activityTitle: { color: 'white', fontSize: 12, fontWeight: '800' },
  activitySub: { color: '#a6a6b5', fontSize: 11, marginTop: 2 },
});