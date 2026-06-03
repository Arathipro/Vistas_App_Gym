import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const BASE = [
  { id: 1, tipo: 'solicitud', icon: '🤝', title: 'Juan Pérez quiere conectar', sub: 'Solicitud de amistad · RF62/RF63', unread: true },
  { id: 2, tipo: 'actividad', icon: '🏋️', title: 'María comenzó entreno', sub: 'Grupo Gym DPUAS · hace 10 minutos', unread: true },
  { id: 3, tipo: 'ranking', icon: '🏆', title: 'Luis subió al primer lugar', sub: 'Ranking mensual de sesiones', unread: false },
  { id: 4, tipo: 'grupo', icon: '👥', title: 'Nuevo reto en Reto Junio', sub: 'Meta: 20 sesiones este mes', unread: false },
];

export default function NotificacionesScreen({ navigation }) {
  const [items, setItems] = useState(BASE);
  const pendientes = items.filter(i => i.unread).length;

  function marcar(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, unread: false } : i));
  }

  function resolverSolicitud(id, accion) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, unread: false, title: accion === 'aceptar' ? 'Solicitud aceptada' : 'Solicitud rechazada', sub: 'Acción aplicada en modo demo' } : i));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={styles.backBtn}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <Text style={styles.countBadge}>{pendientes}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>RF62 · RF63 · RF72</Text>
          <Text style={styles.heroTitle}>Centro de actividad</Text>
          <Text style={styles.heroSub}>Solicitudes, avisos de entrenamiento y actividad de grupos/amigos.</Text>
        </View>

        {items.map(n => (
          <TouchableOpacity key={n.id} style={[styles.card, n.unread && styles.cardUnread]} onPress={() => marcar(n.id)} activeOpacity={0.78}>
            <View style={styles.iconBox}><Text style={{ fontSize: 22 }}>{n.icon}</Text></View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{n.title}</Text>
                {n.unread && <View style={styles.dot} />}
              </View>
              <Text style={styles.sub}>{n.sub}</Text>
              {n.tipo === 'solicitud' && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity onPress={() => resolverSolicitud(n.id, 'aceptar')} style={styles.acceptBtn}><Text style={styles.acceptText}>Aceptar</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => resolverSolicitud(n.id, 'rechazar')} style={styles.rejectBtn}><Text style={styles.rejectText}>Rechazar</Text></TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
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
  countBadge: { color: 'white', backgroundColor: '#f87171', minWidth: 28, textAlign: 'center', borderRadius: 14, paddingHorizontal: 8, paddingVertical: 4, overflow: 'hidden', fontWeight: '900' },
  content: { padding: 20, paddingBottom: 42 },
  heroCard: { backgroundColor: '#2a2a35', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#393948', marginBottom: 14 },
  badge: { color: '#5eead4', fontSize: 11, fontWeight: '800', marginBottom: 8 },
  heroTitle: { color: 'white', fontSize: 21, fontWeight: '900' },
  heroSub: { color: '#9a9aa8', fontSize: 12, lineHeight: 18, marginTop: 5 },
  card: { backgroundColor: '#2a2a35', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#333', marginBottom: 10, flexDirection: 'row', gap: 12 },
  cardUnread: { borderColor: 'rgba(124,111,205,0.65)', backgroundColor: 'rgba(124,111,205,0.12)' },
  iconBox: { width: 43, height: 43, borderRadius: 13, backgroundColor: '#24242f', alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { color: 'white', fontSize: 14, fontWeight: '900', flex: 1 },
  sub: { color: '#888', fontSize: 11, marginTop: 4, lineHeight: 16 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#5eead4' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  acceptBtn: { backgroundColor: '#34d399', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 7 },
  acceptText: { color: '#10251d', fontSize: 11, fontWeight: '900' },
  rejectBtn: { backgroundColor: 'rgba(248,113,113,0.12)', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: 'rgba(248,113,113,0.35)' },
  rejectText: { color: '#f87171', fontSize: 11, fontWeight: '900' },
});