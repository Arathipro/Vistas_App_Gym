import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { getProfile, logout as logoutApi } from '../services/authApiService';
import { useAppSession } from '../../../context/AppSessionContext';

export default function ProfileScreen({ navigation, route }) {
  const { userId } = route.params || {};
  const { perfil: perfilCtx, setPerfil, clearSession } = useAppSession();
  const [perfil, setPerfilLocal] = useState(perfilCtx || null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    loadProfile();
    const unsubscribe = navigation.addListener('focus', loadProfile);
    return unsubscribe;
  }, [navigation]);

  async function loadProfile() {
    try {
      const data = await getProfile();
      setPerfilLocal(data);
      setPerfil(data);
    } catch (error) {
      console.log('Profile load error:', error.message);
    }
  }

  async function handleLogout() {
    await logoutApi();
    clearSession();
    navigation.replace('Login');
  }

  const nombre = perfil?.nombre || 'Usuario';
  const iniciales = nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <View style={{ flex: 1 }}>
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
            ['Edad',    perfil?.edad    ? `${perfil.edad} años` : '—'],
            ['Peso',    perfil?.peso    ? `${perfil.peso} kg`   : '—'],
            ['Altura',  perfil?.altura  ? `${perfil.altura} m`  : '—'],
            ['Género',  perfil?.genero  || '—'],
            ['Objetivo',perfil?.objetivo|| '—'],
            ['Nivel',   perfil?.nivel   || '—'],
          ].map(([k, v]) => (
            <View key={k} style={styles.row}>
              <Text style={styles.rowKey}>{k}</Text>
              <Text style={styles.rowVal}>{v}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('EditProfile', { userId: userId || perfil?.id_usuario, perfil, onUpdate: loadProfile })}
        >
          <Text style={styles.btnText}>✏️ Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Privacidad')}
        >
          <Text style={styles.btnSecondaryText}>🔒 Configurar privacidad</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnDanger}
          onPress={() => setConfirmLogout(true)}
        >
          <Text style={styles.btnDangerText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal
        visible={confirmLogout}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirmLogout(false)}
      >
        <Pressable style={styles.sheetOverlay} onPress={() => setConfirmLogout(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>¿Cerrar sesión?</Text>
          <Text style={styles.sheetSub}>Tu sesión activa será invalidada.</Text>
          <TouchableOpacity style={styles.sheetBtnDanger} onPress={handleLogout}>
            <Text style={styles.sheetBtnDangerText}>Sí, cerrar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetBtnCancel} onPress={() => setConfirmLogout(false)}>
            <Text style={styles.sheetBtnCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#1a1a22' },
  content:          { padding: 24, paddingTop: 50, paddingBottom: 40 },

  header:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  back:             { fontSize: 24, color: 'white' },
  title:            { fontSize: 18, fontWeight: '800', color: 'white' },

  avatarContainer:  { alignItems: 'center', marginBottom: 24 },
  avatar:           { width: 72, height: 72, borderRadius: 36, backgroundColor: '#7c6fcd', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText:       { color: 'white', fontWeight: '800', fontSize: 24 },
  name:             { fontSize: 20, fontWeight: '800', color: 'white' },
  email:            { fontSize: 13, color: '#aaa', marginTop: 4 },

  card:             { backgroundColor: '#2a2a35', borderRadius: 16, padding: 20, marginBottom: 20 },
  cardTitle:        { fontSize: 14, fontWeight: '700', color: '#7c6fcd', marginBottom: 12 },
  row:              { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#333' },
  rowKey:           { fontSize: 13, color: '#aaa' },
  rowVal:           { fontSize: 13, color: 'white', fontWeight: '600' },

  btn:              { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 10 },
  btnText:          { color: 'white', fontWeight: '700', fontSize: 15 },

  btnSecondary:     { backgroundColor: '#2a2a35', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#3a3a45' },
  btnSecondaryText: { color: '#ccc', fontWeight: '600', fontSize: 15 },

  btnDanger:        { borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,90,90,0.3)' },
  btnDangerText:    { color: '#f87171', fontWeight: '600', fontSize: 14 },

  sheetOverlay:     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet:            { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#1a1a22', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderColor: '#2a2a35', padding: 20, paddingBottom: 36, gap: 12 },
  sheetHandle:      { width: 36, height: 4, backgroundColor: '#3a3a45', borderRadius: 2, alignSelf: 'center', marginBottom: 8 },
  sheetTitle:       { fontSize: 16, fontWeight: '800', color: 'white' },
  sheetSub:         { fontSize: 13, color: '#888' },
  sheetBtnDanger:   { backgroundColor: '#f87171', borderRadius: 12, padding: 15, alignItems: 'center' },
  sheetBtnDangerText: { color: 'white', fontWeight: '700', fontSize: 15 },
  sheetBtnCancel:   { backgroundColor: '#2a2a35', borderRadius: 12, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#3a3a45' },
  sheetBtnCancelText: { color: '#ccc', fontWeight: '600', fontSize: 14 },
});
