import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { updateProfile } from '../db/database';

const OBJETIVOS = ['Perder peso', 'Ganar músculo', 'Mantenerme', 'Tonificación', 'Mejorar resistencia'];

export default function EditProfileScreen({ navigation, route }) {
  const { userId, perfil } = route.params || {};

  const [nombre, setNombre] = useState(perfil?.nombre || '');
  const [edad, setEdad] = useState(String(perfil?.edad || ''));
  const [peso, setPeso] = useState(String(perfil?.peso || ''));
  const [altura, setAltura] = useState(String(perfil?.altura || ''));
  const [genero, setGenero] = useState(perfil?.genero || '');
  const [objetivo, setObjetivo] = useState(perfil?.objetivo || '');
  const [loading, setLoading] = useState(false);

  const puedeGuardar = nombre.trim() && edad && peso && altura && genero && objetivo;

  async function handleSave() {
    if (!puedeGuardar) return;
    setLoading(true);
    try {
      await updateProfile(userId, {
        nombre: nombre.trim(),
        email: perfil?.email,
        edad: parseInt(edad),
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        genero,
        objetivo,
      });
      Alert.alert('✅ Listo', 'Perfil actualizado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  }

  // ✅ Handler real para cambiar correo (RF07)
  function handleChangeEmail() {
    navigation.navigate('ChangeEmail', {
      userId,
      currentEmail: perfil?.email,
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar perfil</Text>
        <View style={{ width: 32 }} />
      </View>

      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Tu nombre"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Correo electrónico</Text>
      <View style={styles.emailRow}>
        <TextInput
          style={[styles.input, styles.inputDisabled, { flex: 1 }]}
          value={perfil?.email || ''}
          editable={false}
        />
        {/* ✅ Botón Cambiar con handler real */}
        <TouchableOpacity style={styles.btnCambiar} onPress={handleChangeEmail}>
          <Text style={styles.btnCambiarText}>Cambiar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>Para cambiar tu correo se enviará un código de verificación</Text>

      <Text style={styles.label}>Género</Text>
      <View style={styles.row}>
        {['Hombre', 'Mujer', 'Otro'].map(g => (
          <TouchableOpacity
            key={g}
            onPress={() => setGenero(g)}
            style={[styles.optBtn, genero === g && styles.optBtnSelected]}
          >
            <Text style={[styles.optBtnText, genero === g && styles.optBtnTextSelected]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {[
          { label: 'Edad', val: edad, set: setEdad, ph: '25' },
          { label: 'Peso (kg)', val: peso, set: setPeso, ph: '70' },
          { label: 'Altura (m)', val: altura, set: setAltura, ph: '1.75' },
        ].map(f => (
          <View key={f.label} style={{ flex: 1 }}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput
              style={[styles.input, { textAlign: 'center' }]}
              value={f.val}
              onChangeText={f.set}
              placeholder={f.ph}
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>

      <Text style={styles.label}>Objetivo fitness</Text>
      {OBJETIVOS.map(o => (
        <TouchableOpacity
          key={o}
          onPress={() => setObjetivo(o)}
          style={[styles.objBtn, objetivo === o && styles.objBtnSelected]}
        >
          <Text style={[styles.objBtnText, objetivo === o && styles.objBtnTextSelected]}>{o}</Text>
          {objetivo === o && <Text style={styles.check}>✓</Text>}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.btn, { opacity: puedeGuardar && !loading ? 1 : 0.45 }]}
        onPress={handleSave}
        disabled={!puedeGuardar || loading}
      >
        <Text style={styles.btnText}>{loading ? 'Guardando...' : 'Guardar cambios'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}>
        <Text style={styles.btnCancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a22' },
  content: { padding: 24, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  back: { fontSize: 24, color: 'white' },
  title: { fontSize: 18, fontWeight: '800', color: 'white' },
  label: { fontSize: 12, color: '#aaa', marginBottom: 6, marginTop: 12 },
  hint: { fontSize: 10, color: '#555', marginTop: 4 },
  input: { backgroundColor: '#2a2a35', borderRadius: 10, padding: 14, color: 'white', fontSize: 14, borderWidth: 1, borderColor: '#333' },
  inputDisabled: { color: '#666', backgroundColor: '#222' },
  emailRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  btnCambiar: { backgroundColor: 'rgba(124,111,205,0.15)', borderWidth: 1, borderColor: 'rgba(124,111,205,0.4)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  btnCambiarText: { color: '#7c6fcd', fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8 },
  optBtn: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#2a2a35', borderWidth: 1.5, borderColor: 'transparent', alignItems: 'center' },
  optBtnSelected: { borderColor: '#7c6fcd', backgroundColor: 'rgba(124,111,205,0.15)' },
  optBtnText: { color: '#aaa', fontSize: 13 },
  optBtnTextSelected: { color: 'white', fontWeight: '700' },
  objBtn: { padding: 14, borderRadius: 10, backgroundColor: '#2a2a35', borderWidth: 1.5, borderColor: 'transparent', marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  objBtnSelected: { borderColor: '#7c6fcd', backgroundColor: 'rgba(124,111,205,0.15)' },
  objBtnText: { color: '#aaa', fontSize: 14, flex: 1 },
  objBtnTextSelected: { color: 'white', fontWeight: '700' },
  check: { color: '#7c6fcd', fontSize: 16 },
  btn: { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  btnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  btnCancel: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnCancelText: { color: '#666', fontSize: 14 },
});