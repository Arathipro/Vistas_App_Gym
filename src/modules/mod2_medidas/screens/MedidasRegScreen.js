import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, StatusBar, Modal, Pressable,
} from 'react-native';

export default function MedidasRegScreen({ navigation, route }) {
  const user         = route?.params?.user;
  const modoEdicion  = route?.params?.modoEdicion || false;
  const datosIniciales = route?.params?.datos || {};

  const [fecha,    setFecha]    = useState(datosIniciales.fecha    || '2026-03-12');
  const [peso,     setPeso]     = useState(String(datosIniciales.peso    || ''));
  const [altura,   setAltura]   = useState(String(datosIniciales.altura  || ''));
  const [cintura,  setCintura]  = useState(String(datosIniciales.cintura || ''));
  const [cadera,   setCadera]   = useState(String(datosIniciales.cadera  || ''));
  const [pecho,    setPecho]    = useState(String(datosIniciales.pecho   || ''));
  const [brazoDer, setBrazoDer] = useState(String(datosIniciales.brazoDer || ''));
  const [brazoIzq, setBrazoIzq] = useState(String(datosIniciales.brazoIzq || ''));
  const [musloDer, setMusloDer] = useState(String(datosIniciales.musloDer || ''));
  const [musloIzq, setMusloIzq] = useState(String(datosIniciales.musloIzq || ''));
  const [cuello,   setCuello]   = useState(String(datosIniciales.cuello  || ''));
  const [pantDer,  setPantDer]  = useState(String(datosIniciales.pantDer || ''));
  const [pantIzq,  setPantIzq]  = useState(String(datosIniciales.pantIzq || ''));
  const [notas,    setNotas]    = useState(datosIniciales.notas    || '');
  const [modalConfirm, setModalConfirm] = useState(false);

  const campos = [
    { label: 'Peso (kg)',                  val: peso,     set: setPeso,     ph: '74.2', tipo: 'decimal' },
    { label: 'Altura (cm)',                val: altura,   set: setAltura,   ph: '176',  tipo: 'entero'  },
    { label: 'Cintura (cm)',               val: cintura,  set: setCintura,  ph: '88',   tipo: 'decimal' },
    { label: 'Cadera (cm)',                val: cadera,   set: setCadera,   ph: '96',   tipo: 'decimal' },
    { label: 'Pecho (cm)',                 val: pecho,    set: setPecho,    ph: '100',  tipo: 'decimal' },
    { label: 'Cuello (cm)',                val: cuello,   set: setCuello,   ph: '38',   tipo: 'decimal' },
    { label: 'Brazo derecho (cm)',         val: brazoDer, set: setBrazoDer, ph: '35',   tipo: 'decimal' },
    { label: 'Brazo izquierdo (cm)',       val: brazoIzq, set: setBrazoIzq, ph: '35',   tipo: 'decimal' },
    { label: 'Muslo derecho (cm)',         val: musloDer, set: setMusloDer, ph: '54',   tipo: 'decimal' },
    { label: 'Muslo izquierdo (cm)',       val: musloIzq, set: setMusloIzq, ph: '54',   tipo: 'decimal' },
    { label: 'Pantorrilla derecha (cm)',   val: pantDer,  set: setPantDer,  ph: '36',   tipo: 'decimal' },
    { label: 'Pantorrilla izquierda (cm)', val: pantIzq,  set: setPantIzq,  ph: '36',   tipo: 'decimal' },
  ];

  function handleGuardar() {
    if (modoEdicion) { setModalConfirm(true); }
    else { navigation.navigate('Medidas', { user }); }
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => modoEdicion
            ? navigation.navigate('MedidasHist', { user })
            : navigation.navigate('Medidas', { user })
          }
          style={s.backBtn}
        >
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{modoEdicion ? 'Editar medición' : 'Nueva medición'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.badge}>
          <Text style={s.badgeText}>{modoEdicion ? 'RF11 — Editar medidas' : 'RF07 — Registrar medidas'}</Text>
        </View>

        <View style={s.inputGroup}>
          <Text style={s.inputLabel}>Fecha</Text>
          <TextInput style={s.input} value={fecha} onChangeText={setFecha} placeholder="YYYY-MM-DD" placeholderTextColor="#555" />
        </View>

        {campos.map((c, i) => (
          <View key={i} style={s.inputGroup}>
            <Text style={s.inputLabel}>{c.label}</Text>
            <TextInput
              style={s.input} value={c.val} onChangeText={c.set}
              placeholder={c.ph} placeholderTextColor="#555"
              keyboardType={c.tipo === 'entero' ? 'number-pad' : 'decimal-pad'}
            />
          </View>
        ))}

        <View style={s.inputGroup}>
          <Text style={s.inputLabel}>Notas</Text>
          <TextInput style={[s.input, s.textarea]} value={notas} onChangeText={setNotas}
            placeholder="Observaciones opcionales..." placeholderTextColor="#555" multiline numberOfLines={3} />
        </View>

        <TouchableOpacity style={s.btnPrimary} onPress={handleGuardar}>
          <Text style={s.btnPrimaryText}>{modoEdicion ? 'Guardar cambios' : 'Guardar medición'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal confirmación edición */}
      <Modal visible={modalConfirm} transparent animationType="slide" onRequestClose={() => setModalConfirm(false)}>
        <Pressable style={s.sheetOverlay} onPress={() => setModalConfirm(false)} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>¿Guardar cambios?</Text>
          <Text style={s.sheetSub}>Estás editando una medición ya guardada. Los valores anteriores se reemplazarán.</Text>
          <TouchableOpacity style={s.sheetBtnPrimary} onPress={() => { setModalConfirm(false); navigation.navigate('MedidasHist', { user }); }}>
            <Text style={s.sheetBtnPrimaryText}>Sí, guardar cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.sheetBtnCancel} onPress={() => setModalConfirm(false)}>
            <Text style={s.sheetBtnCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container:           { flex: 1, backgroundColor: '#1a1a22' },
  header:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#2a2a35' },
  backBtn:             { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' },
  backText:            { color: 'white', fontSize: 18, fontWeight: '600' },
  headerTitle:         { fontSize: 17, fontWeight: '800', color: 'white' },
  body:                { padding: 16, paddingBottom: 40 },
  badge:               { alignSelf: 'flex-start', backgroundColor: 'rgba(94,234,212,0.12)', borderWidth: 1, borderColor: 'rgba(94,234,212,0.3)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 18 },
  badgeText:           { fontSize: 10, fontWeight: '700', color: '#5eead4' },
  inputGroup:          { marginBottom: 14 },
  inputLabel:          { fontSize: 12, fontWeight: '600', color: '#aaa', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
  input:               { backgroundColor: '#2a2a35', borderRadius: 10, padding: 14, color: 'white', fontSize: 14, borderWidth: 1, borderColor: '#333' },
  textarea:            { height: 80, textAlignVertical: 'top' },
  btnPrimary:          { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnPrimaryText:      { color: 'white', fontWeight: '700', fontSize: 15 },
  sheetOverlay:        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet:               { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#1a1a22', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderColor: '#2a2a35', padding: 20, paddingBottom: 36, gap: 12 },
  sheetHandle:         { width: 36, height: 4, backgroundColor: '#3a3a45', borderRadius: 2, alignSelf: 'center', marginBottom: 8 },
  sheetTitle:          { fontSize: 16, fontWeight: '800', color: 'white' },
  sheetSub:            { fontSize: 13, color: '#888', lineHeight: 19 },
  sheetBtnPrimary:     { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 15, alignItems: 'center' },
  sheetBtnPrimaryText: { color: 'white', fontWeight: '700', fontSize: 15 },
  sheetBtnCancel:      { backgroundColor: '#2a2a35', borderRadius: 12, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#3a3a45' },
  sheetBtnCancelText:  { color: '#ccc', fontWeight: '600', fontSize: 14 },
});
