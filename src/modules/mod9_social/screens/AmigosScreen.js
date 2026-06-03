import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';

const USUARIOS = [
  { id: 1, nombre: 'María García', codigo: 'MAR-104', meta: 'Racha 12 días · Push hoy', estado: 'amigo' },
  { id: 2, nombre: 'Luis Torres', codigo: 'LUI-228', meta: '28 sesiones este mes', estado: 'amigo' },
  { id: 3, nombre: 'Ana López', codigo: 'ANA-512', meta: 'Objetivo: tonificación', estado: 'pendiente' },
  { id: 4, nombre: 'Juan Pérez', codigo: 'JUA-887', meta: 'Solicitó conectar contigo', estado: 'recibida' },
  { id: 5, nombre: 'Sofía Ramos', codigo: 'SOF-341', meta: 'Gimnasio DPUAS', estado: 'buscar' },
];

export default function AmigosScreen({ navigation }) {
  const [busqueda, setBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState(USUARIOS);
  const [tab, setTab] = useState('Todos');

  const filtrados = useMemo(() => usuarios.filter(u => {
    const matchText = !busqueda || `${u.nombre} ${u.codigo}`.toLowerCase().includes(busqueda.toLowerCase());
    const matchTab = tab === 'Todos' || (tab === 'Amigos' && u.estado === 'amigo') || (tab === 'Solicitudes' && ['pendiente', 'recibida'].includes(u.estado)) || (tab === 'Buscar' && u.estado === 'buscar');
    return matchText && matchTab;
  }), [usuarios, busqueda, tab]);

  function enviar(id) {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, estado: 'pendiente', meta: 'Solicitud enviada · pendiente' } : u));
  }

  function aceptar(id) {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, estado: 'amigo', meta: 'Amistad aceptada · ya pueden comparar progreso' } : u));
  }

  function rechazar(id) {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  }

  function cancelar(id) {
    Alert.alert('Cancelar solicitud', '¿Eliminar esta solicitud pendiente?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => setUsuarios(prev => prev.map(u => u.id === id ? { ...u, estado: 'buscar', meta: 'Solicitud cancelada · puedes reenviar' } : u)) },
    ]);
  }

  function eliminar(id) {
    Alert.alert('Eliminar amistad', 'Ambos perderán acceso a comparación y ranking entre sí.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setUsuarios(prev => prev.map(u => u.id === id ? { ...u, estado: 'buscar', meta: 'Amistad eliminada · puedes reenviar solicitud' } : u)) },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={styles.backBtn}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Amigos</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>RF58–RF66</Text>
          <Text style={styles.heroTitle}>Conexiones y solicitudes</Text>
          <Text style={styles.heroSub}>Busca por nombre o código, envía solicitudes, acepta/rechaza y elimina amistades.</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Buscar usuario o código de amigo..."
          placeholderTextColor="#777"
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <View style={styles.chipsRow}>
          {['Todos', 'Amigos', 'Solicitudes', 'Buscar'].map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.chip, tab === t && styles.chipActive]}>
              <Text style={[styles.chipText, tab === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {filtrados.map(u => (
          <View key={u.id} style={styles.userCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{u.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{u.nombre}</Text>
              <Text style={styles.userMeta}>{u.codigo} · {u.meta}</Text>
              <View style={styles.statusWrap}>
                <Text style={[styles.status, u.estado === 'amigo' && styles.statusOk, u.estado === 'recibida' && styles.statusWarn]}>
                  {u.estado === 'amigo' ? 'Amigo' : u.estado === 'pendiente' ? 'Pendiente' : u.estado === 'recibida' ? 'Solicitud recibida' : 'Disponible'}
                </Text>
              </View>
            </View>
            <View style={styles.actions}>
              {u.estado === 'buscar' && <TouchableOpacity onPress={() => enviar(u.id)} style={styles.smallPrimary}><Text style={styles.smallPrimaryText}>Agregar</Text></TouchableOpacity>}
              {u.estado === 'pendiente' && <TouchableOpacity onPress={() => cancelar(u.id)} style={styles.smallDanger}><Text style={styles.smallDangerText}>Cancelar</Text></TouchableOpacity>}
              {u.estado === 'recibida' && (
                <>
                  <TouchableOpacity onPress={() => aceptar(u.id)} style={styles.iconAction}><Text>✓</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => rechazar(u.id)} style={styles.iconDanger}><Text>✕</Text></TouchableOpacity>
                </>
              )}
              {u.estado === 'amigo' && <TouchableOpacity onPress={() => eliminar(u.id)} style={styles.iconDanger}><Text>🗑</Text></TouchableOpacity>}
            </View>
          </View>
        ))}

        {filtrados.length === 0 && (
          <View style={styles.empty}><Text style={styles.emptyIcon}>🔍</Text><Text style={styles.emptyText}>Sin resultados para esta búsqueda.</Text></View>
        )}
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
  badge: { color: '#5eead4', fontSize: 11, fontWeight: '800', marginBottom: 8 },
  heroTitle: { color: 'white', fontSize: 21, fontWeight: '900' },
  heroSub: { color: '#9a9aa8', fontSize: 12, lineHeight: 18, marginTop: 5 },
  input: { backgroundColor: '#2a2a35', borderColor: '#393948', borderWidth: 1, borderRadius: 13, color: 'white', padding: 14, marginBottom: 12, fontSize: 13 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 10, backgroundColor: '#24242f', borderWidth: 1, borderColor: '#333' },
  chipActive: { backgroundColor: 'rgba(124,111,205,0.22)', borderColor: '#7c6fcd' },
  chipText: { color: '#888', fontSize: 11, fontWeight: '800' },
  chipTextActive: { color: 'white' },
  userCard: { backgroundColor: '#2a2a35', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#333', marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#7c6fcd', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: 'white', fontWeight: '900', fontSize: 14 },
  userName: { color: 'white', fontSize: 14, fontWeight: '900' },
  userMeta: { color: '#888', fontSize: 11, marginTop: 3, lineHeight: 16 },
  statusWrap: { flexDirection: 'row', marginTop: 7 },
  status: { color: '#999', fontSize: 10, fontWeight: '900', backgroundColor: '#24242f', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, overflow: 'hidden' },
  statusOk: { color: '#34d399', backgroundColor: 'rgba(52,211,153,0.12)' },
  statusWarn: { color: '#ffa032', backgroundColor: 'rgba(255,160,50,0.12)' },
  actions: { alignItems: 'flex-end', gap: 6 },
  smallPrimary: { backgroundColor: '#7c6fcd', borderRadius: 9, paddingHorizontal: 10, paddingVertical: 7 },
  smallPrimaryText: { color: 'white', fontSize: 11, fontWeight: '900' },
  smallDanger: { backgroundColor: 'rgba(248,113,113,0.12)', borderRadius: 9, paddingHorizontal: 10, paddingVertical: 7, borderWidth: 1, borderColor: 'rgba(248,113,113,0.35)' },
  smallDangerText: { color: '#f87171', fontSize: 11, fontWeight: '900' },
  iconAction: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(52,211,153,0.16)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(52,211,153,0.35)' },
  iconDanger: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(248,113,113,0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(248,113,113,0.35)' },
  empty: { alignItems: 'center', paddingVertical: 28 },
  emptyIcon: { fontSize: 34, marginBottom: 8 },
  emptyText: { color: '#888', fontSize: 13 },
});