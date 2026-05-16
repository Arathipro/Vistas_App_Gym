import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getProfile, deleteSession } from '../db/database';

export default function ProfileScreen({ navigation, route }) {
  const { userId } = route.params || {};
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    loadProfile();
    // Recargar datos cada vez que la pantalla recibe foco
    // (necesario para reflejar cambios de EditProfile y ChangeEmail)
    const unsubscribe = navigation.addListener('focus', loadProfile);
    return unsubscribe;
  }, [navigation]);

  async function loadProfile() {
    const data = await getProfile(userId);
    setPerfil(data);
  }

  async function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí, salir', style: 'destructive', onPress: async () => {
          const token = await SecureStore.getItemAsync('session_token');
          if (token) await deleteSession(token);
          await SecureStore.deleteItemAsync('session_token');
          navigation.replace('Login');
        }
      }
    ]);
  }

  const nombre = perfil?.nombre || 'Usuario';
  const iniciales = nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mi perfil</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciales}</Text>
        </View>
        <Text style={styles.name}>{nombre}</Text>
        <Text style={styles.email}>{perfil?.email || '—'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Datos físicos</Text>
        {[
          ['Edad', perfil?.edad ? `${perfil.edad} años` : '—'],
          ['Peso', perfil?.peso ? `${perfil.peso} kg` : '—'],
          ['Altura', perfil?.altura ? `${perfil.altura} m` : '—'],
          ['Género', perfil?.genero || '—'],
          ['Objetivo', perfil?.objetivo || '—'],
          ['Nivel', perfil?.nivel || '—'],
        ].map(([k, v]) => (
          <View key={k} style={styles.row}>
            <Text style={styles.rowKey}>{k}</Text>
            <Text style={styles.rowVal}>{v}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.btn}
        onPress={() => navigation.navigate('EditProfile', { userId, perfil, onUpdate: loadProfile })}>
        <Text style={styles.btnText}>✏️ Editar perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnDanger} onPress={handleLogout}>
        <Text style={styles.btnDangerText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a22' },
  content: { padding: 24, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  back: { fontSize: 24, color: 'white' },
  title: { fontSize: 18, fontWeight: '800', color: 'white' },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#7c6fcd', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: 'white', fontWeight: '800', fontSize: 24 },
  name: { fontSize: 20, fontWeight: '800', color: 'white' },
  email: { fontSize: 13, color: '#aaa', marginTop: 4 },
  card: { backgroundColor: '#2a2a35', borderRadius: 16, padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#7c6fcd', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#333' },
  rowKey: { fontSize: 13, color: '#aaa' },
  rowVal: { fontSize: 13, color: 'white', fontWeight: '600' },
  btn: { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  btnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  btnDanger: { borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,90,90,0.3)' },
  btnDangerText: { color: '#f87171', fontWeight: '600', fontSize: 14 },
});