import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { initDB, getSession } from '../db/database';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    async function init() {
      await initDB();
      const token = await SecureStore.getItemAsync('session_token');
      if (token) {
        const user = await getSession(token);
        if (user) {
          navigation.replace('Home', { user });
          return;
        }
      }
      navigation.replace('Login');
    }
    init();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💪</Text>
      <Text style={styles.title}>DPUAS</Text>
      <Text style={styles.sub}>FITNESS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13132a', justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 36, fontWeight: '800', color: 'white', letterSpacing: -1 },
  sub: { fontSize: 14, color: '#5eead4', fontWeight: '600', letterSpacing: 4 },
});