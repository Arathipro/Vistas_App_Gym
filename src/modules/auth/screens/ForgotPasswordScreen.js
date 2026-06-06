import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { confirmPasswordReset, requestPasswordResetCode } from '../services/authApiService';

export default function ForgotPasswordScreen({ navigation }) {
  const [paso, setPaso] = useState(0);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputsRef = useRef([]);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const codigoCompleto = codigo.join('').length === 6;
  const passValida = pass1.length >= 8;
  const passCoincide = pass1 === pass2 && pass2.length > 0;
  const puedeGuardar = passValida && passCoincide;

  function handleDigit(val, i) {
    const c = [...codigo];
    c[i] = val.slice(-1);
    setCodigo(c);
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
  }

  function handleDigitBackspace(e, i) {
    if (e.nativeEvent.key === 'Backspace' && !codigo[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  }

  async function handleEnviarCodigo() {
    if (!emailValido) return;
    setLoading(true);
    try {
      const emailLower = email.trim().toLowerCase();
      const result = await requestPasswordResetCode({ email: emailLower });
      setCodigo(['', '', '', '', '', '']);
      const devCodeMsg = !result?.email_sent && result?.dev_code
        ? `\n\nNo se pudo enviar el correo real. Código de desarrollo: ${result.dev_code}`
        : '';

      const mensaje = result?.email_sent || result?.dev_code
        ? `Enviamos un código de verificación a: ${emailLower}.${devCodeMsg}`
        : 'Si el correo está registrado, recibirás un código en los próximos minutos.';

      Alert.alert(
        'Código enviado',
        mensaje,
        [{ text: 'Entendido', onPress: () => setPaso(1) }]
      );
    } catch (e) {
      Alert.alert('Error', e.message || 'No se pudo procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  }

  function mostrarErrorCodigo(error) {
    const mensaje = error?.message || 'No se pudo actualizar la contraseña.';
    const esErrorCodigo = mensaje.toLowerCase().includes('código');

    if (!esErrorCodigo) {
      Alert.alert('Error', mensaje);
      return;
    }

    Alert.alert(
      'Error con el código',
      `${mensaje}\n\nPuedes solicitar un código nuevo sin volver a escribir tu correo.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reenviar código',
          onPress: () => {
            setCodigo(['', '', '', '', '', '']);
            setPass1('');
            setPass2('');
            setPaso(1);
            handleEnviarCodigo();
          },
        },
      ]
    );
  }

  function handleVerificarCodigo() {
    if (!codigoCompleto) return;
    setPaso(2);
  }

  async function handleGuardarPassword() {
    if (!puedeGuardar) return;
    setLoading(true);
    try {
      await confirmPasswordReset({
        email: email.trim().toLowerCase(),
        code: codigo.join(''),
        password: pass1,
      });

      setDone(true);
    } catch (e) {
      mostrarErrorCodigo(e);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <View style={styles.container}>
        <View style={styles.doneBox}>
          <View style={styles.doneIcon}><Text style={{ fontSize: 36 }}>✅</Text></View>
          <Text style={styles.doneTitle}>¡Contraseña actualizada!</Text>
          <Text style={styles.doneSub}>
            Tu contraseña fue cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
          </Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnText}>Ir al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => paso === 0 ? navigation.goBack() : setPaso(p => p - 1)}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Recuperar acceso</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.stepsRow}>
        {['Correo', 'Código', 'Nueva contraseña'].map((l, i) => (
          <View key={l} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <View style={[styles.stepBar, i <= paso && styles.stepBarActive]} />
            <Text style={[styles.stepLabel, i === paso && styles.stepLabelActive]}>{l}</Text>
          </View>
        ))}
      </View>

      {paso === 0 && (
        <View style={styles.card}>
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>🔐</Text>
          <Text style={styles.cardTitle}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.cardText}>
            Ingresa tu correo registrado y te enviaremos un código de recuperación.
          </Text>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={[styles.input, email.length > 0 && { borderColor: emailValido ? '#34d399' : '#f87171' }]}
            placeholder="correo@email.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.btn, { opacity: emailValido && !loading ? 1 : 0.45, marginTop: 20 }]}
            onPress={handleEnviarCodigo}
            disabled={!emailValido || loading}
          >
            <Text style={styles.btnText}>{loading ? 'Enviando...' : 'Enviar código de recuperación'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>← Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      {paso === 1 && (
        <View style={styles.card}>
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>📧</Text>
          <Text style={styles.cardTitle}>Revisa tu correo</Text>
          <Text style={styles.cardText}>
            Ingresa el código de 6 dígitos enviado a <Text style={{ color: '#7c6fcd', fontWeight: '600' }}>{email}</Text>. Expira en 10 minutos.
          </Text>
          <View style={styles.digitRow}>
            {codigo.map((d, i) => (
              <TextInput
                key={i}
                ref={r => inputsRef.current[i] = r}
                maxLength={1}
                value={d}
                onChangeText={val => handleDigit(val, i)}
                onKeyPress={e => handleDigitBackspace(e, i)}
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
            onPress={() => { setCodigo(['', '', '', '', '', '']); handleEnviarCodigo(); }}
          >
            <Text style={styles.linkText}>¿No te llegó? Reenviar código</Text>
          </TouchableOpacity>
        </View>
      )}

      {paso === 2 && (
        <View style={styles.card}>
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>🔑</Text>
          <Text style={styles.cardTitle}>Nueva contraseña</Text>
          <Text style={styles.cardText}>Elige una contraseña segura para tu cuenta.</Text>

          <Text style={styles.label}>Nueva contraseña</Text>
          <View style={styles.passContainer}>
            <TextInput
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              placeholder="Mín. 8 caracteres"
              placeholderTextColor="#666"
              value={pass1}
              onChangeText={setPass1}
              secureTextEntry={!showPass1}
            />
            <TouchableOpacity onPress={() => setShowPass1(v => !v)} style={styles.eyeBtn}>
              <Ionicons name={showPass1 ? 'eye-off' : 'eye'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {pass1.length > 0 && (
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
              {[
                { label: '≥8 car.', ok: pass1.length >= 8 },
                { label: 'Mayúsc.', ok: /[A-Z]/.test(pass1) },
                { label: 'Número', ok: /[0-9]/.test(pass1) },
              ].map(r => (
                <Text key={r.label} style={[styles.req, { color: r.ok ? '#34d399' : '#f87171' }]}>
                  {r.ok ? '✓' : '✗'} {r.label}
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.label}>Confirmar nueva contraseña</Text>
          <View style={[styles.passContainer, pass2.length > 0 && { borderColor: passCoincide ? '#34d399' : '#f87171' }]}>
            <TextInput
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              placeholder="Repite tu contraseña"
              placeholderTextColor="#666"
              value={pass2}
              onChangeText={setPass2}
              secureTextEntry={!showPass2}
            />
            <TouchableOpacity onPress={() => setShowPass2(v => !v)} style={styles.eyeBtn}>
              <Ionicons name={showPass2 ? 'eye-off' : 'eye'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {passCoincide && <Text style={styles.ok}>✓ Las contraseñas coinciden</Text>}

          <TouchableOpacity
            style={[styles.btn, { opacity: puedeGuardar && !loading ? 1 : 0.45, marginTop: 20 }]}
            onPress={handleGuardarPassword}
            disabled={!puedeGuardar || loading}
          >
            <Text style={styles.btnText}>{loading ? 'Guardando...' : 'Guardar nueva contraseña'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a22' },
  content: { padding: 24, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  back: { fontSize: 24, color: 'white' },
  title: { fontSize: 17, fontWeight: '800', color: 'white' },
  stepsRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  stepBar: { width: '100%', height: 3, borderRadius: 2, backgroundColor: '#2a2a35' },
  stepBarActive: { backgroundColor: '#7c6fcd' },
  stepLabel: { fontSize: 9, color: '#555' },
  stepLabelActive: { color: '#7c6fcd', fontWeight: '600' },
  card: { backgroundColor: '#2a2a35', borderRadius: 16, padding: 20 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: 'white', marginBottom: 8, textAlign: 'center' },
  cardText: { fontSize: 13, color: '#aaa', lineHeight: 20, marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 12, color: '#aaa', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#1a1a22', borderRadius: 10, padding: 14, color: 'white', fontSize: 14, borderWidth: 1, borderColor: '#333' },
  passContainer: { backgroundColor: '#1a1a22', borderRadius: 10, borderWidth: 1, borderColor: '#333', flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { paddingHorizontal: 14 },
  digitRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 16 },
  digitInput: { width: 42, height: 52, textAlign: 'center', fontSize: 22, fontWeight: '800', borderRadius: 10, borderWidth: 2, borderColor: '#333', backgroundColor: '#1a1a22', color: 'white' },
  req: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
  ok: { fontSize: 11, color: '#34d399', marginTop: 4 },
  btn: { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  linkBtn: { alignItems: 'center', marginTop: 14 },
  linkText: { color: '#555', fontSize: 13 },
  doneBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16 },
  doneIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(52,211,153,0.15)', justifyContent: 'center', alignItems: 'center' },
  doneTitle: { fontSize: 20, fontWeight: '800', color: 'white', textAlign: 'center' },
  doneSub: { fontSize: 13, color: '#aaa', textAlign: 'center', lineHeight: 20 },
});