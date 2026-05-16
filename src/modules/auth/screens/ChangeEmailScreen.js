import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { saveEmailChangeCode, confirmEmailChange, emailExists, deleteSession } from '../db/database';

function generarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function ChangeEmailScreen({ navigation, route }) {
  const { userId, currentEmail } = route.params || {};

  // paso 0 = verificar identidad (correo actual)
  // paso 1 = ingresar código de 6 dígitos
  // paso 2 = ingresar nuevo correo
  const [paso, setPaso] = useState(0);
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [confirmarEmail, setConfirmarEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoEmail);
  const emailsCoinciden = nuevoEmail === confirmarEmail && confirmarEmail.length > 0;
  const codigoCompleto = codigo.join('').length === 6;
  const puedeConfirmar = emailValido && emailsCoinciden;

  function handleDigit(val, i) {
    const c = [...codigo];
    c[i] = val.slice(-1);
    setCodigo(c);
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
  }

  function handleBackspace(e, i) {
    if (e.nativeEvent.key === 'Backspace' && !codigo[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  }

  // ── Paso 0: generar y "enviar" código ──────────────────────────────────
  async function handleEnviarCodigo() {
    setLoading(true);
    try {
      const nuevoCodigo = generarCodigo();
      const expira = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

      await saveEmailChangeCode(userId, nuevoCodigo, expira);
      setCodigoGenerado(nuevoCodigo);

      // En producción aquí iría el envío real por correo
      Alert.alert(
        'Código de verificación',
        `Tu código es: ${nuevoCodigo}\n\n(En producción este código llegaría a ${currentEmail})`,
        [{ text: 'Entendido', onPress: () => setPaso(1) }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  // ── Paso 1: verificar código ───────────────────────────────────────────
  function handleVerificarCodigo() {
    if (!codigoCompleto) return;
    if (codigo.join('') !== codigoGenerado) {
      Alert.alert('Código incorrecto', 'El código que ingresaste no es válido. Verifica e intenta de nuevo.');
      return;
    }
    setPaso(2);
  }

  // ── Paso 2: confirmar nuevo correo y cerrar sesión ─────────────────────
  async function handleConfirmarCambio() {
    if (!puedeConfirmar) return;
    setLoading(true);
    try {
      const emailLower = nuevoEmail.trim().toLowerCase();

      // No permitir el mismo correo actual
      if (emailLower === currentEmail?.toLowerCase()) {
        Alert.alert('Error', 'El nuevo correo no puede ser igual al actual.');
        return;
      }

      // Verificar que no esté en uso por otra cuenta
      const existe = await emailExists(emailLower);
      if (existe) {
        Alert.alert('Error', 'Ese correo ya está registrado en otra cuenta.');
        return;
      }

      // Confirmar el cambio en la BD (valida código + actualiza email)
      const resultado = await confirmEmailChange(userId, codigo.join(''), emailLower);

      if (!resultado.ok) {
        Alert.alert('Error', resultado.error || 'No se pudo actualizar el correo.');
        return;
      }

      // Cerrar sesión activa para forzar nuevo login con el correo actualizado
      const token = await SecureStore.getItemAsync('session_token');
      if (token) await deleteSession(token);
      await SecureStore.deleteItemAsync('session_token');

      Alert.alert(
        '✅ Correo actualizado',
        `Tu correo ha sido cambiado a:\n${emailLower}\n\nInicia sesión con tus nuevos datos.`,
        [
          {
            text: 'Ir al inicio de sesión',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el correo. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => paso === 0 ? navigation.goBack() : setPaso(p => p - 1)}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cambiar correo</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Indicador de pasos */}
      <View style={styles.stepsRow}>
        {['Verificar identidad', 'Código', 'Nuevo correo'].map((l, i) => (
          <View key={l} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <View style={[styles.stepBar, i <= paso && styles.stepBarActive]} />
            <Text style={[styles.stepLabel, i === paso && styles.stepLabelActive]}>{l}</Text>
          </View>
        ))}
      </View>

      {/* ── Paso 0: verificar identidad ── */}
      {paso === 0 && (
        <View style={styles.card}>
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>🔐</Text>
          <Text style={styles.cardTitle}>Verificación de seguridad</Text>
          <Text style={styles.cardText}>
            Para cambiar tu correo primero verificaremos que eres el titular de la cuenta.
            Enviaremos un código de verificación a:
          </Text>
          <View style={styles.emailBadge}>
            <Text style={styles.emailBadgeText}>📧 {currentEmail}</Text>
          </View>
          <TouchableOpacity
            style={[styles.btn, { opacity: !loading ? 1 : 0.45, marginTop: 20 }]}
            onPress={handleEnviarCodigo}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? 'Enviando...' : 'Enviar código'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Paso 1: código 6 dígitos ── */}
      {paso === 1 && (
        <View style={styles.card}>
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>📧</Text>
          <Text style={styles.cardTitle}>Ingresa el código</Text>
          <Text style={styles.cardText}>
            Ingresa el código de 6 dígitos enviado a{' '}
            <Text style={{ color: '#7c6fcd', fontWeight: '600' }}>{currentEmail}</Text>. Expira en 15 minutos.
          </Text>
          <View style={styles.digitRow}>
            {codigo.map((d, i) => (
              <TextInput
                key={i}
                ref={r => inputsRef.current[i] = r}
                maxLength={1}
                value={d}
                onChangeText={val => handleDigit(val, i)}
                onKeyPress={e => handleBackspace(e, i)}
                style={[styles.digitInput, d && { borderColor: '#7c6fcd' }]}
                keyboardType="number-pad"
              />
            ))}
          </View>
          <TouchableOpacity
            style={[styles.btn, { opacity: codigoCompleto ? 1 : 0.45, marginTop: 20 }]}
            onPress={handleVerificarCodigo}
            disabled={!codigoCompleto}
          >
            <Text style={styles.btnText}>Verificar código</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => { setCodigo(['', '', '', '', '', '']); setPaso(0); handleEnviarCodigo(); }}
          >
            <Text style={styles.linkText}>¿No recibiste el código? Reenviar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Paso 2: nuevo correo ── */}
      {paso === 2 && (
        <View style={styles.card}>
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>✉️</Text>
          <Text style={styles.cardTitle}>Nuevo correo electrónico</Text>
          <Text style={styles.cardText}>
            Ingresa el correo al que quieres cambiar tu cuenta.
          </Text>

          <Text style={styles.label}>Nuevo correo electrónico</Text>
          <TextInput
            style={[
              styles.input,
              nuevoEmail.length > 0 && { borderColor: emailValido ? '#34d399' : '#f87171' },
            ]}
            placeholder="nuevo@correo.com"
            placeholderTextColor="#666"
            value={nuevoEmail}
            onChangeText={setNuevoEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Confirmar nuevo correo</Text>
          <TextInput
            style={[
              styles.input,
              confirmarEmail.length > 0 && { borderColor: emailsCoinciden ? '#34d399' : '#f87171' },
            ]}
            placeholder="nuevo@correo.com"
            placeholderTextColor="#666"
            value={confirmarEmail}
            onChangeText={setConfirmarEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailsCoinciden && emailValido && (
            <Text style={styles.ok}>✓ Los correos coinciden</Text>
          )}

          <TouchableOpacity
            style={[styles.btn, { opacity: puedeConfirmar && !loading ? 1 : 0.45, marginTop: 20 }]}
            onPress={handleConfirmarCambio}
            disabled={!puedeConfirmar || loading}
          >
            <Text style={styles.btnText}>{loading ? 'Actualizando...' : 'Confirmar cambio'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a22' },
  content: { padding: 24, paddingTop: 50 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  back: { fontSize: 24, color: 'white' },
  title: { fontSize: 17, fontWeight: '800', color: 'white' },
  stepsRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  stepBar: { width: '100%', height: 3, borderRadius: 2, backgroundColor: '#2a2a35' },
  stepBarActive: { backgroundColor: '#7c6fcd' },
  stepLabel: { fontSize: 9, color: '#555' },
  stepLabelActive: { color: '#7c6fcd', fontWeight: '600' },
  card: { backgroundColor: '#2a2a35', borderRadius: 16, padding: 20 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: 'white', marginBottom: 8, textAlign: 'center' },
  cardText: { fontSize: 13, color: '#aaa', lineHeight: 20, marginBottom: 8, textAlign: 'center' },
  emailBadge: {
    backgroundColor: 'rgba(124,111,205,0.1)', borderRadius: 8,
    padding: 12, marginTop: 8,
    borderWidth: 1, borderColor: 'rgba(124,111,205,0.3)',
  },
  emailBadgeText: { color: '#7c6fcd', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  digitRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 16 },
  digitInput: {
    width: 42, height: 52, textAlign: 'center', fontSize: 22, fontWeight: '800',
    borderRadius: 10, borderWidth: 2, borderColor: '#333',
    backgroundColor: '#1a1a22', color: 'white',
  },
  label: { fontSize: 12, color: '#aaa', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#1a1a22', borderRadius: 10, padding: 14,
    color: 'white', fontSize: 14, borderWidth: 1, borderColor: '#333',
  },
  ok: { fontSize: 11, color: '#34d399', marginTop: 4 },
  btn: { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  linkBtn: { alignItems: 'center', marginTop: 14 },
  linkText: { color: '#555', fontSize: 13 },
});
