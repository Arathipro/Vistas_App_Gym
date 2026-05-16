/**
 * DrawerMenu.js
 * Panel lateral que se desliza desde la derecha.
 * Se abre desde el botón hamburguesa del HomeScreen.
 * Diseño fiel al NavDrawer del prototipo App.jsx.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';

const DRAWER_ITEMS = [
  { screen: 'Home',        label: 'Inicio',              icon: '🏠' },
  { screen: 'Rutinas',     label: 'Entrenamientos',       icon: '🏋️' },
  { screen: 'Progreso',    label: 'Progreso',             icon: '📊' },
  { screen: 'Medidas',     label: 'Medidas corporales',   icon: '📏' },
  { screen: 'Chat',        label: 'Asistente IA',         icon: '🤖' },
  { screen: 'ScannerGym',  label: 'Escáner gym',          icon: '📷' },
  { screen: 'ScannerFood', label: 'Escáner alimentos',    icon: '🥗' },
  { screen: 'Social',      label: 'Comunidad',            icon: '👥' },
  { screen: 'Profile',     label: 'Mi perfil',            icon: '👤' },
];

export default function DrawerMenu({ visible, onClose, navigation, perfil = {}, userId, onLogout }) {
  const nombre = perfil?.nombre || 'Usuario';
  const email  = perfil?.email  || '';
  const iniciales = nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  function handleNav(screen) {
    onClose();
    if (screen === 'Profile') {
      navigation.navigate('Profile', { userId });
    } else {
      navigation.navigate(screen);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay semitransparente */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Panel lateral derecho */}
      <View style={styles.panel}>
        {/* Cabecera con datos del usuario */}
        <View style={styles.drawerHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciales}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.drawerName}>{nombre}</Text>
            {email ? <Text style={styles.drawerEmail}>{email}</Text> : null}
          </View>
        </View>

        {/* Items de navegación */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {DRAWER_ITEMS.map(item => (
            <TouchableOpacity
              key={item.screen}
              style={styles.drawerItem}
              onPress={() => handleNav(item.screen)}
              activeOpacity={0.7}
            >
              <Text style={styles.drawerItemIcon}>{item.icon}</Text>
              <Text style={styles.drawerItemLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cerrar sesión al fondo */}
        <View style={styles.drawerFooter}>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => { onClose(); onLogout && onLogout(); }}
            activeOpacity={0.7}
          >
            <Text style={styles.drawerItemIcon}>🚪</Text>
            <Text style={[styles.drawerItemLabel, { color: '#f87171' }]}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  panel: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0,
    width: '72%',
    backgroundColor: '#1a1a22',
    borderLeftWidth: 1,
    borderLeftColor: '#2a2a35',
    paddingTop: 52,
    paddingBottom: 24,
    flexDirection: 'column',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a35',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7c6fcd',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { color: 'white', fontWeight: '800', fontSize: 16 },
  drawerName:  { fontSize: 14, fontWeight: '700', color: 'white' },
  drawerEmail: { fontSize: 11, color: '#888', marginTop: 2 },

  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  drawerItemIcon:  { fontSize: 18, width: 24, textAlign: 'center' },
  drawerItemLabel: { fontSize: 14, fontWeight: '500', color: '#ccc' },

  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#2a2a35',
    paddingTop: 4,
  },
});
