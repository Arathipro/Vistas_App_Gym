import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, StatusBar,
} from 'react-native';

export default function MedidasRegScreen({ navigation }) {
  const [fecha, setFecha]         = useState('2026-03-12');
  const [peso, setPeso]           = useState('');
  const [altura, setAltura]       = useState('');
  const [cintura, setCintura]     = useState('');
  const [cadera, setCadera]       = useState('');
  const [pecho, setPecho]         = useState('');
  const [brazoDer, setBrazoDer]   = useState('');
  const [brazoIzq, setBrazoIzq]   = useState('');
  const [musloIzq, setMusloIzq]   = useState('');
  const [musloDer, setMusloDer]   = useState('');
  const [cuello, setCuello]       = useState('');
  const [pantDer, setPantDer]     = useState('');
  const [pantIzq, setPantIzq]     = useState('');
  const [notas, setNotas]         = useState('');

  const campos = [
    { label: 'Peso (kg)',              val: peso,      set: setPeso,      ph: '74.2', tipo: 'decimal' },
    { label: 'Altura (cm)',            val: altura,    set: setAltura,    ph: '176',  tipo: 'entero'  },
    { label: 'Cintura (cm)',           val: cintura,   set: setCintura,   ph: '88',   tipo: 'decimal' },
    { label: 'Cadera (cm)',            val: cadera,    set: setCadera,    ph: '96',   tipo: 'decimal' },
    { label: 'Pecho (cm)',             val: pecho,     set: setPecho,     ph: '100',  tipo: 'decimal' },
    { label: 'Cuello (cm)',            val: cuello,    set: setCuello,    ph: '38',   tipo: 'decimal' },
    { label: 'Brazo derecho (cm)',     val: brazoDer,  set: setBrazoDer,  ph: '35',   tipo: 'decimal' },
    { label: 'Brazo izquierdo (cm)',   val: brazoIzq,  set: setBrazoIzq,  ph: '35',   tipo: 'decimal' },
    { label: 'Muslo derecho (cm)',     val: musloDer,  set: setMusloDer,  ph: '54',   tipo: 'decimal' },
    { label: 'Muslo izquierdo (cm)',   val: musloIzq,  set: setMusloIzq,  ph: '54',   tipo: 'decimal' },
    { label: 'Pantorrilla derecha (cm)', val: pantDer, set: setPantDer,   ph: '36',   tipo: 'decimal' },
    { label: 'Pantorrilla izquierda (cm)', val: pantIzq, set: setPantIzq, ph: '36',  tipo: 'decimal' },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Medidas')} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Nueva medición</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>

        {/* Badge */}
        <View style={s.badge}>
          <Text style={s.badgeText}>RF07 — Registrar medidas</Text>
        </View>

        {/* Fecha */}
        <View style={s.inputGroup}>
          <Text style={s.inputLabel}>Fecha</Text>
          <TextInput
            style={s.input}
            value={fecha}
            onChangeText={setFecha}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#555"
          />
        </View>

        {/* Campos de medidas */}
        {campos.map((c, i) => (
          <View key={i} style={s.inputGroup}>
            <Text style={s.inputLabel}>{c.label}</Text>
            <TextInput
              style={s.input}
              value={c.val}
              onChangeText={c.set}
              placeholder={c.ph}
              placeholderTextColor="#555"
              keyboardType={c.tipo === 'entero' ? 'number-pad' : 'decimal-pad'}
            />
          </View>
        ))}

        {/* Notas */}
        <View style={s.inputGroup}>
          <Text style={s.inputLabel}>Notas</Text>
          <TextInput
            style={[s.input, s.textarea]}
            value={notas}
            onChangeText={setNotas}
            placeholder="Observaciones opcionales..."
            placeholderTextColor="#555"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Guardar */}
        <TouchableOpacity
          style={s.btnPrimary}
          onPress={() => navigation.navigate('Medidas')}
        >
          <Text style={s.btnPrimaryText}>Guardar medición</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#1a1a22' },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#2a2a35' },
  backBtn:        { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' },
  backText:       { color: 'white', fontSize: 18, fontWeight: '600' },
  headerTitle:    { fontSize: 17, fontWeight: '800', color: 'white' },

  body:           { padding: 16, paddingBottom: 40 },

  badge:          { alignSelf: 'flex-start', backgroundColor: 'rgba(94,234,212,0.12)', borderWidth: 1, borderColor: 'rgba(94,234,212,0.3)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 18 },
  badgeText:      { fontSize: 10, fontWeight: '700', color: '#5eead4' },

  inputGroup:     { marginBottom: 14 },
  inputLabel:     { fontSize: 12, fontWeight: '600', color: '#aaa', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
  input:          { backgroundColor: '#2a2a35', borderRadius: 10, padding: 14, color: 'white', fontSize: 14, borderWidth: 1, borderColor: '#333' },
  textarea:       { height: 80, textAlignVertical: 'top' },

  btnPrimary:     { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnPrimaryText: { color: 'white', fontWeight: '700', fontSize: 15 },
});
