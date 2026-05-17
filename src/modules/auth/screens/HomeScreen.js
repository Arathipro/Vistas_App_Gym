import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getProfile, deleteSession } from '../db/database';
import DrawerMenu from '../../../shared/components/DrawerMenu';
import { useAppSession } from '../../../context/AppSessionContext';

export default function HomeScreen({ navigation, route }) {
  const { user: userCtx, setUser, perfil, setPerfil, clearSession } = useAppSession();
  const routeUser = route.params?.user;
  const user = userCtx || routeUser;
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (routeUser && !userCtx) setUser(routeUser);
  }, [routeUser, userCtx, setUser]);

  useEffect(() => {
    if (user?.id) {
      loadProfile();
      const unsub = navigation.addListener('focus', loadProfile);
      return unsub;
    }
  }, [navigation, user?.id]);

  async function loadProfile() {
    if (!user?.id) return;
    const data = await getProfile(user.id);
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
          clearSession();
          navigation.replace('Login');
        }
      }
    ]);
  }

  const nombre = perfil?.nombre || user?.nombre || 'Usuario';
  const iniciales = nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const objetivo = perfil?.objetivo || '—';
  const nivel = perfil?.nivel || '—';

  const quickActions = [
    { icon: '📏', label: 'Medidas', screen: 'Medidas' },
    { icon: '🏋️', label: 'Entrena', screen: 'Rutinas' },
    { icon: '🤖', label: 'IA Chat', screen: 'Chat' },
    { icon: '📷', label: 'Escáner', screen: 'ScannerGym' },
  ];

  const navItems = [
    { icon: '📊', label: 'Ver mi progreso', screen: 'Progreso' },
    { icon: '🥗', label: 'Escáner alimentos', screen: 'ScannerFood' },
    { icon: '👥', label: 'Comunidad', screen: 'Social' },
    { icon: '🏆', label: 'Rankings', screen: 'Ranking' },
  ];

  return (
    <View style={styles.container}>
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} navigation={navigation} perfil={perfil || user} userId={user?.id} onLogout={handleLogout} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.greetRow}>
          <TouchableOpacity style={styles.greetLeft} onPress={() => navigation.navigate('Profile', { userId: user?.id })}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{iniciales}</Text></View>
            <View>
              <Text style={styles.greetSub}>Hola de nuevo 👋</Text>
              <Text style={styles.greetName}>{nombre}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)} activeOpacity={0.7}>
            <View style={styles.menuLine} /><View style={styles.menuLine} /><View style={styles.menuLine} />
          </TouchableOpacity>
        </View>

        <View style={styles.streakCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.streakLabel}>Objetivo · Nivel</Text>
            <Text style={styles.streakValue}>🎯 {objetivo}</Text>
            <Text style={styles.streakSub}>{nivel} · ¡Sigue así!</Text>
          </View>
          <View style={styles.ringCircle}><Text style={{ fontSize: 26 }}>💪</Text></View>
        </View>

        <Text style={styles.sectionLabel}>Acceso rápido</Text>
        <View style={styles.quickGrid}>
          {quickActions.map(a => (
            <TouchableOpacity key={a.screen} style={styles.quickCard} onPress={() => navigation.navigate(a.screen)}>
              <Text style={styles.quickIcon}>{a.icon}</Text><Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Esta semana</Text>
        <View style={styles.statsGrid}>
          {[
            { value: '—', label: 'Sesiones', color: '#fff' },
            { value: '—', label: 'Cal quemadas', color: '#5eead4' },
            { value: perfil?.peso ? `${perfil.peso}kg` : '—', label: 'Peso actual', color: '#7c6fcd' },
            { value: '—', label: 'Ejercicios', color: '#34d399' },
          ].map((s, i) => <View key={i} style={styles.statCard}><Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text><Text style={styles.statLabel}>{s.label}</Text></View>)}
        </View>

        <Text style={styles.sectionLabel}>Explorar</Text>
        {navItems.map(n => (
          <TouchableOpacity key={n.screen} style={styles.navCard} onPress={() => navigation.navigate(n.screen)}>
            <Text style={styles.navIcon}>{n.icon}</Text><Text style={styles.navLabel}>{n.label}</Text><Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13132a' },
  content: { padding: 20, paddingTop: 52, paddingBottom: 40 },
  greetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  greetLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#7c6fcd', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: 'white', fontWeight: '800', fontSize: 16 },
  greetSub: { fontSize: 12, color: '#888' },
  greetName: { fontSize: 18, fontWeight: '800', color: 'white' },
  menuBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2a2a35', borderWidth: 1, borderColor: '#333', alignItems: 'center', justifyContent: 'center', gap: 4 },
  menuLine: { width: 16, height: 2, backgroundColor: '#aaa', borderRadius: 2 },
  streakCard: { backgroundColor: '#7c6fcd', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  streakLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 4 },
  streakValue: { fontSize: 22, fontWeight: '800', color: 'white' },
  streakSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  ringCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 10 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  quickCard: { flexBasis: '47%', backgroundColor: '#2a2a35', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#333' },
  quickIcon: { fontSize: 26 },
  quickLabel: { fontSize: 14, fontWeight: '600', color: 'white' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: { flexBasis: '47%', backgroundColor: '#2a2a35', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#333' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  navCard: { backgroundColor: '#2a2a35', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  navIcon: { fontSize: 20, marginRight: 12 },
  navLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: 'white' },
  navArrow: { fontSize: 22, color: '#555' },
});
