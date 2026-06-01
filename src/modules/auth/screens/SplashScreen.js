/**
 * SplashScreen.js
 * Pantalla de inicio de la app.
 *
 * Flujo:
 * 1. Carga la BD e inicializa (initDB)
 * 2. Si hay sesión activa y perfil completo → va directo a Home
 * 3. Si hay sesión activa sin encuesta → va a Survey
 * 4. Si no hay sesión → muestra la pantalla de bienvenida
 *    con botones "Crear cuenta" y "Ya tengo cuenta"
 *
 * Fiel al diseño del prototipo App.jsx.
 */
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { initDB, getSession, hasProfile } from '../db/database';

export default function SplashScreen({ navigation }) {
  const [estado, setEstado] = useState('loading');

  useEffect(() => {
    async function init() {
      await initDB();
      const token = await SecureStore.getItemAsync('session_token');
      if (token) {
        const user = await getSession(token);
        if (user) {
          const perfilCompleto = await hasProfile(user.id);
          if (!perfilCompleto) {
            navigation.replace('Survey', { nombre: user.nombre, email: user.email, userId: user.id });
            return;
          }
          navigation.replace('Home', { user });
          return;
        }
      }
      setEstado('welcome');
    }
    init();
  }, []);

  if (estado === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>💪</Text>
        </View>
        <Text style={styles.appName}>DPUAS</Text>
        <Text style={styles.appSub}>FITNESS</Text>
        <ActivityIndicator color="#7c6fcd" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>💪</Text>
        </View>
        <Text style={styles.appName}>DPUAS</Text>
        <Text style={styles.appSub}>FITNESS</Text>
        <Text style={styles.gymTag}>Gimnasio DPUAS · Lázaro Cárdenas</Text>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Crear cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSecondaryText}>Ya tengo cuenta</Text>
        </TouchableOpacity>

        <Text style={styles.tagline}>
          Tu entrenamiento. Tu progreso. Tu comunidad.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#13132a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#13132a',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 48,
  },

  heroSection: {
    alignItems: 'center',
    gap: 8,
  },

  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: 'transparent',
    backgroundImage: undefined,
    backgroundColor: '#7c6fcd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#7c6fcd',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  logoEmoji: { fontSize: 48 },

  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -1,
  },
  appSub: {
    fontSize: 14,
    color: '#5eead4',
    fontWeight: '600',
    letterSpacing: 4,
  },
  gymTag: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },

  actionsSection: {
    gap: 12,
    alignItems: 'stretch',
  },

  btnPrimary: {
    backgroundColor: '#7c6fcd',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#7c6fcd',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  btnPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  btnSecondary: {
    backgroundColor: '#2a2a35',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a45',
  },
  btnSecondaryText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
  },

  tagline: {
    textAlign: 'center',
    fontSize: 11,
    color: '#444',
    marginTop: 8,
  },
});
