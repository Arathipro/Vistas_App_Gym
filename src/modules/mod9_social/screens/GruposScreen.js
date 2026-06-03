import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';

const BASE_GRUPOS = [
  { id: 1, nombre: 'Gym DPUAS', miembros: 5, estado: 'Activo', aviso: 'María inició entrenamiento hace 10 min', color: '#7c6fcd' },
  { id: 2, nombre: 'Reto Junio', miembros: 8, estado: 'Reto mensual', aviso: 'Meta: 20 sesiones por integrante', color: '#5eead4' },
];

export default function GruposScreen({ navigation }) {
  const [grupos, setGrupos] = useState(BASE_GRUPOS);
  const [nombre, setNombre] = useState('');

  function crearGrupo() {
    if (!nombre.trim()) {
      Alert.alert('Nombre requerido', 'Escribe un nombre para crear el grupo demo.');
      return;
    }
    setGrupos(prev => [{ id: Date.now(), nombre: nombre.trim(), miembros: 1, estado: 'Nuevo', aviso: 'Grupo creado · invita amigos desde la lista', color: '#ffa032' }, ...prev]);
    setNombre('');
  }

  function notificar(nombreGrupo) {
    Alert.alert('Notificación demo', `Se enviaría aviso al grupo ${nombreGrupo}: “Arath inició entrenamiento”.`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={styles.backBtn}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Grupos</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>RF71 · RF72</Text>
          <Text style={styles.heroTitle}>Grupos de amigos</Text>
          <Text style={styles.heroSub}>Crea grupos, revisa miembros y simula notificaciones de inicio de actividad.</Text>
        </View>

        <View style={styles.createCard}>
          <Text style={styles.sectionTitle}>Crear grupo demo</Text>
          <TextInput style={styles.input} placeholder="Ej. Equipo pierna DPUAS" placeholderTextColor="#777" value={nombre} onChangeText={setNombre} />
          <TouchableOpacity style={styles.primaryBtn} onPress={crearGrupo}><Text style={styles.primaryText}>＋ Crear grupo</Text></TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Mis grupos</Text>
        {grupos.map(g => (
          <View key={g.id} style={styles.groupCard}>
            <View style={[styles.groupIcon, { backgroundColor: `${g.color}22`, borderColor: `${g.color}55` }]}><Text style={{ fontSize: 22 }}>👥</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.groupTitle}>{g.nombre}</Text>
              <Text style={styles.groupSub}>{g.miembros} miembros · {g.estado}</Text>
              <Text style={styles.groupNotice}>🔔 {g.aviso}</Text>
              <View style={styles.memberRow}>
                {['CM', 'MG', 'LT', '+'].map((m, i) => <View key={i} style={styles.miniAvatar}><Text style={styles.miniAvatarText}>{m}</Text></View>)}
              </View>
            </View>
            <TouchableOpacity style={styles.notifyBtn} onPress={() => notificar(g.nombre)}><Text style={styles.notifyText}>Avisar</Text></TouchableOpacity>
          </View>
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
  content: { padding: 20, paddingBottom: 42 },
  heroCard: { backgroundColor: '#2a2a35', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#393948', marginBottom: 14 },
  badge: { color: '#5eead4', fontSize: 11, fontWeight: '800', marginBottom: 8 },
  heroTitle: { color: 'white', fontSize: 21, fontWeight: '900' },
  heroSub: { color: '#9a9aa8', fontSize: 12, lineHeight: 18, marginTop: 5 },
  createCard: { backgroundColor: 'rgba(124,111,205,0.14)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(124,111,205,0.32)', marginBottom: 16 },
  sectionTitle: { color: 'white', fontSize: 15, fontWeight: '900', marginBottom: 10 },
  input: { backgroundColor: '#2a2a35', borderColor: '#393948', borderWidth: 1, borderRadius: 13, color: 'white', padding: 13, marginBottom: 10, fontSize: 13 },
  primaryBtn: { backgroundColor: '#7c6fcd', borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  primaryText: { color: 'white', fontWeight: '900', fontSize: 13 },
  sectionLabel: { color: '#888', fontSize: 12, fontWeight: '800', marginBottom: 10 },
  groupCard: { backgroundColor: '#2a2a35', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#333', marginBottom: 12, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  groupIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  groupTitle: { color: 'white', fontSize: 15, fontWeight: '900' },
  groupSub: { color: '#888', fontSize: 11, marginTop: 3 },
  groupNotice: { color: '#c7c7d6', fontSize: 11, marginTop: 8, lineHeight: 16 },
  memberRow: { flexDirection: 'row', marginTop: 9 },
  miniAvatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#7c6fcd', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#2a2a35', marginRight: -6 },
  miniAvatarText: { color: 'white', fontSize: 9, fontWeight: '900' },
  notifyBtn: { backgroundColor: 'rgba(94,234,212,0.12)', borderWidth: 1, borderColor: 'rgba(94,234,212,0.35)', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 7 },
  notifyText: { color: '#5eead4', fontSize: 11, fontWeight: '900' },
});