import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { loginUser, saveSession } from '../db/database';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin() {
    if (!email || !pass) return;
    setLoading(true);
    try {
      const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pass);
      const user = await loginUser(email.trim().toLowerCase(), hash);
      if (!user) {
        Alert.alert(
          'Credenciales incorrectas',
          'El correo o contraseña no son correctos. Verifica tus datos.',
          [{ text: 'Reintentar' }]
        );
        return;
      }
      const token = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        email + Date.now()
      );
      await saveSession(user.id, token);
      await SecureStore.setItemAsync('session_token', token);
      navigation.replace('Home', { user });
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.emoji}>💪</Text>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.sub}>RF03 — Inicio de sesión</Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="correo@email.com"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.passContainer}>
        <TextInput
          style={[styles.input, { flex: 1, borderWidth: 0 }]}
          placeholder="Tu contraseña"
          placeholderTextColor="#666"
          value={pass}
          onChangeText={setPass}
          secureTextEntry={!showPass}
        />
        <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
          <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* ✅ Botón recuperar contraseña (RF05) */}
      <TouchableOpacity
        style={styles.forgotRow}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { opacity: email && pass && !loading ? 1 : 0.45 }]}
        onPress={handleLogin}
        disabled={!email || !pass || loading}
      >
        <Text style={styles.btnText}>{loading ? 'Entrando...' : 'Iniciar sesión'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>
          ¿Sin cuenta? <Text style={styles.linkAccent}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a22' },
  content: { padding: 24, paddingTop: 80, alignItems: 'center' },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: 'white', marginBottom: 4 },
  sub: { fontSize: 12, color: '#7c6fcd', marginBottom: 32 },
  label: { fontSize: 13, color: '#aaa', marginBottom: 6, marginTop: 12, alignSelf: 'flex-start', width: '100%' },
  input: { backgroundColor: '#2a2a35', borderRadius: 10, padding: 14, color: 'white', fontSize: 14, borderWidth: 1, borderColor: '#333', width: '100%' },
  forgotRow: { alignSelf: 'flex-end', marginTop: 8, marginBottom: 4 },
  forgotText: { color: '#7c6fcd', fontSize: 13 },
  passContainer: { backgroundColor: '#2a2a35', borderRadius: 10, borderWidth: 1, borderColor: '#333', flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { paddingHorizontal: 14 },
  btn: { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16, width: '100%' },
  btnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  link: { textAlign: 'center', color: '#666', fontSize: 13, marginTop: 16 },
  linkAccent: { color: '#7c6fcd' },
});