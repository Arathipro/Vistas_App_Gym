import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { hashPassword, registerUser, emailExists } from '../db/database';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passValida = pass.length >= 8;
  const passCoincide = pass === pass2 && pass2.length > 0;
  const puedeRegistrar = nombre.trim() && emailValido && passValida && passCoincide;

  async function handleRegister() {
    if (!puedeRegistrar) return;
    setLoading(true);
    try {
      const emailLower = email.trim().toLowerCase();

      // Verificar si el correo ya existe antes de intentar insertar
      const existe = await emailExists(emailLower);
      if (existe) {
        Alert.alert('Error', 'Este correo ya está registrado.');
        return;
      }

      const hash = await hashPassword(pass);
      // registerUser devuelve el lastInsertRowId (el userId)
      const userId = await registerUser(nombre.trim(), emailLower, hash);

      if (!userId) {
        Alert.alert('Error', 'No se pudo crear la cuenta. Intenta de nuevo.');
        return;
      }

      // ✅ Pasamos userId a Survey para que saveProfile funcione
      navigation.replace('Survey', { nombre: nombre.trim(), email: emailLower, userId });
    } catch (error) {
      console.error('Register error:', error);
      if (error.message?.includes('UNIQUE')) {
        Alert.alert('Error', 'Este correo ya está registrado.');
      } else {
        Alert.alert('Error', 'Ocurrió un error al registrarte: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.sub}>RF01 — Registro de usuario</Text>

      <Text style={styles.label}>Nombre completo</Text>
      <TextInput style={styles.input} placeholder="Ej. Carlos Mendoza"
        placeholderTextColor="#666" value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput style={styles.input} placeholder="correo@email.com"
        placeholderTextColor="#666" value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.passContainer}>
        <TextInput style={[styles.input, { flex: 1, borderWidth: 0 }]} placeholder="Mín. 8 caracteres"
          placeholderTextColor="#666" value={pass} onChangeText={setPass}
          secureTextEntry={!showPass} />
        <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
          <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color="#666" />
        </TouchableOpacity>
      </View>
      {pass.length > 0 && (
        <View style={styles.reqRow}>
          {[
            { label: '≥8 car.', ok: pass.length >= 8 },
            { label: 'Mayúsc.', ok: /[A-Z]/.test(pass) },
            { label: 'Número', ok: /[0-9]/.test(pass) },
          ].map(r => (
            <Text key={r.label} style={[styles.req, { color: r.ok ? '#34d399' : '#f87171' }]}>
              {r.ok ? '✓' : '✗'} {r.label}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.label}>Confirmar contraseña</Text>
      <View style={[styles.passContainer, pass2.length > 0 && { borderColor: passCoincide ? '#34d399' : '#f87171' }]}>
        <TextInput
          style={[styles.input, { flex: 1, borderWidth: 0 }]}
          placeholder="Repite tu contraseña" placeholderTextColor="#666"
          value={pass2} onChangeText={setPass2} secureTextEntry={!showPass2} />
        <TouchableOpacity onPress={() => setShowPass2(v => !v)} style={styles.eyeBtn}>
          <Ionicons name={showPass2 ? 'eye-off' : 'eye'} size={20} color="#666" />
        </TouchableOpacity>
      </View>
      {passCoincide && <Text style={styles.ok}>✓ Las contraseñas coinciden</Text>}

      <TouchableOpacity
        style={[styles.btn, { opacity: puedeRegistrar && !loading ? 1 : 0.45 }]}
        onPress={handleRegister} disabled={!puedeRegistrar || loading}>
        <Text style={styles.btnText}>{loading ? 'Registrando...' : 'Registrarme'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? <Text style={styles.linkAccent}>Iniciar sesión</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a22' },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', color: 'white', marginBottom: 4 },
  sub: { fontSize: 12, color: '#7c6fcd', marginBottom: 24 },
  label: { fontSize: 13, color: '#aaa', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#2a2a35', borderRadius: 10, padding: 14, color: 'white', fontSize: 14, borderWidth: 1, borderColor: '#333' },
  reqRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  req: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
  ok: { fontSize: 11, color: '#34d399', marginTop: 4 },
  passContainer: { backgroundColor: '#2a2a35', borderRadius: 10, borderWidth: 1, borderColor: '#333', flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { paddingHorizontal: 14 },
  btn: { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  btnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  link: { textAlign: 'center', color: '#666', fontSize: 13, marginTop: 16 },
  linkAccent: { color: '#7c6fcd' },
});