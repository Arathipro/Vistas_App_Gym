import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registerConfirm, registerRequestCode } from '../services/authApiService';

export default function RegisterScreen({ navigation }) {
  const [paso, setPaso] = useState(0);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const inputsRef = useRef([]);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passValida = pass.length >= 8;
  const passCoincide = pass === pass2 && pass2.length > 0;
  const puedeEnviarCodigo = nombre.trim() && emailValido && passValida && passCoincide;
  const codigoCompleto = codigo.join('').length === 6;

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

  async function handleEnviarCodigoRegistro() {
    if (!puedeEnviarCodigo) return;
    setLoading(true);
    try {
      const emailLower = email.trim().toLowerCase();
      const result = await registerRequestCode({
        nombre,
        email: emailLower,
        password: pass,
      });

      setCodigo(['', '', '', '', '', '']);
      setPaso(1);

      const devCodeMsg = result?.dev_code
        ? `\n\nCódigo de desarrollo: ${result.dev_code}`
        : '';

      Alert.alert(
        'Código generado',
        `Generamos el código para ${emailLower}. Revisa el correo cuando se integre Nodemailer.${devCodeMsg}`
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo generar el código de verificación.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!codigoCompleto) return;

    setLoading(true);
    try {
      const emailLower = email.trim().toLowerCase();
      await registerConfirm({
        email: emailLower,
        code: codigo.join(''),
      });

      Alert.alert(
        'Cuenta creada',
        'Tu correo fue verificado y tu cuenta fue registrada correctamente. Ahora inicia sesión para completar tu encuesta inicial.',
        [{ text: 'Ir a iniciar sesión', onPress: () => navigation.replace('Login', { emailPrefill: emailLower }) }]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => paso === 0 ? navigation.goBack() : setPaso(0)}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.sub}>RF01 — Registro de usuario</Text>
        </View>
      </View>

      <View style={styles.stepsRow}>
        {['Datos', 'Código'].map((l, i) => (
          <View key={l} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <View style={[styles.stepBar, i <= paso && styles.stepBarActive]} />
            <Text style={[styles.stepLabel, i === paso && styles.stepLabelActive]}>{l}</Text>
          </View>
        ))}
      </View>

      {paso === 0 && (
        <View>
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
            style={[styles.btn, { opacity: puedeEnviarCodigo && !loading ? 1 : 0.45 }]}
            onPress={handleEnviarCodigoRegistro} disabled={!puedeEnviarCodigo || loading}>
            <Text style={styles.btnText}>{loading ? 'Enviando código...' : 'Enviar código de verificación'}</Text>
          </TouchableOpacity>

          <Text style={styles.note}>Después de verificar tu correo, tu cuenta será creada y podrás iniciar sesión para completar la encuesta inicial.</Text>

          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.link}>¿Ya tienes cuenta? <Text style={styles.linkAccent}>Iniciar sesión</Text></Text>
          </TouchableOpacity>
        </View>
      )}

      {paso === 1 && (
        <View style={styles.card}>
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>📧</Text>
          <Text style={styles.cardTitle}>Verifica tu correo</Text>
          <Text style={styles.cardText}>Ingresa el código de 6 dígitos generado para <Text style={styles.mailText}>{email.trim().toLowerCase()}</Text>.</Text>
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
            style={[styles.btn, { opacity: codigoCompleto && !loading ? 1 : 0.45 }]}
            onPress={handleRegister} disabled={!codigoCompleto || loading}>
            <Text style={styles.btnText}>{loading ? 'Creando cuenta...' : 'Verificar y crear cuenta'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkBtn} onPress={handleEnviarCodigoRegistro} disabled={loading}>
            <Text style={styles.linkText}>¿No recibiste el código? Reenviar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a22' },
  content: { padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 14 },
  back: { fontSize: 24, color: 'white' },
  title: { fontSize: 28, fontWeight: '800', color: 'white', marginBottom: 4 },
  sub: { fontSize: 12, color: '#7c6fcd' },
  stepsRow: { flexDirection: 'row', gap: 6, marginBottom: 18 },
  stepBar: { width: '100%', height: 3, borderRadius: 2, backgroundColor: '#2a2a35' },
  stepBarActive: { backgroundColor: '#7c6fcd' },
  stepLabel: { fontSize: 9, color: '#555' },
  stepLabelActive: { color: '#7c6fcd', fontWeight: '600' },
  label: { fontSize: 13, color: '#aaa', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#2a2a35', borderRadius: 10, padding: 14, color: 'white', fontSize: 14, borderWidth: 1, borderColor: '#333' },
  reqRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  req: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
  ok: { fontSize: 11, color: '#34d399', marginTop: 4 },
  note: { color: '#777', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 12 },
  passContainer: { backgroundColor: '#2a2a35', borderRadius: 10, borderWidth: 1, borderColor: '#333', flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { paddingHorizontal: 14 },
  btn: { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  btnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  link: { textAlign: 'center', color: '#666', fontSize: 13, marginTop: 16 },
  linkAccent: { color: '#7c6fcd' },
  card: { backgroundColor: '#2a2a35', borderRadius: 16, padding: 20, marginTop: 8 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: 'white', marginBottom: 8, textAlign: 'center' },
  cardText: { fontSize: 13, color: '#aaa', lineHeight: 20, textAlign: 'center' },
  mailText: { color: '#7c6fcd', fontWeight: '700' },
  digitRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 16 },
  digitInput: { width: 42, height: 52, textAlign: 'center', fontSize: 22, fontWeight: '800', borderRadius: 10, borderWidth: 2, borderColor: '#333', backgroundColor: '#1a1a22', color: 'white' },
  linkBtn: { alignItems: 'center', marginTop: 14 },
  linkText: { color: '#555', fontSize: 13 },
});
