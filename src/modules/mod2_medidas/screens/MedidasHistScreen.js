import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, StatusBar,
} from 'react-native';

export default function MedidasHistScreen({ navigation }) {
  const [registros, setRegistros] = useState([
    { id: 1, fecha: '15 Mar 2025', peso: 69.0, grasa: 18.2, musculo: 42.1, cintura: 81 },
    { id: 2, fecha: '1 Mar 2025',  peso: 69.8, grasa: 18.7, musculo: 41.8, cintura: 82 },
    { id: 3, fecha: '15 Feb 2025', peso: 70.5, grasa: 19.1, musculo: 41.5, cintura: 83 },
    { id: 4, fecha: '1 Feb 2025',  peso: 71.2, grasa: 19.5, musculo: 41.2, cintura: 84 },
    { id: 5, fecha: '15 Ene 2025', peso: 72.0, grasa: 20.1, musculo: 40.8, cintura: 85 },
  ]);
  const [editando, setEditando]       = useState(null);
  const [confirmElim, setConfirmElim] = useState(null);
  const [editForm, setEditForm]       = useState({});

  function iniciarEdicion(r) {
    setEditando(r.id);
    setEditForm({ peso: String(r.peso), grasa: String(r.grasa), musculo: String(r.musculo), cintura: String(r.cintura) });
    setConfirmElim(null);
  }

  function guardarEdicion(id) {
    setRegistros(prev => prev.map(r => r.id !== id ? r : {
      ...r,
      peso:    parseFloat(editForm.peso)    || r.peso,
      grasa:   parseFloat(editForm.grasa)   || r.grasa,
      musculo: parseFloat(editForm.musculo) || r.musculo,
      cintura: parseFloat(editForm.cintura) || r.cintura,
    }));
    setEditando(null);
  }

  function eliminar(id) {
    setRegistros(prev => prev.filter(r => r.id !== id));
    setConfirmElim(null);
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Medidas')} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Historial de medidas</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MedidasReg')} style={s.actionBtn}>
          <Text style={s.actionText}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>

        {/* Badge */}
        <View style={s.badge}>
          <Text style={s.badgeText}>RF09–RF11</Text>
        </View>

        {registros.map((r) => (
          <View key={r.id}>
            {/* Tarjeta del registro */}
            <View style={s.card}>

              {/* Cabecera: fecha + botones */}
              <View style={s.cardHeader}>
                <Text style={s.cardFecha}>{r.fecha}</Text>
                <View style={s.cardActions}>
                  {/* Botón editar */}
                  <TouchableOpacity
                    style={[s.iconBtn, editando === r.id && s.iconBtnActive]}
                    onPress={() => editando === r.id ? setEditando(null) : iniciarEdicion(r)}
                  >
                    <Text style={[s.iconBtnText, editando === r.id && s.iconBtnTextActive]}>
                      {editando === r.id ? '✕' : '✎'}
                    </Text>
                  </TouchableOpacity>
                  {/* Botón eliminar */}
                  <TouchableOpacity
                    style={s.iconBtnDanger}
                    onPress={() => setConfirmElim(confirmElim === r.id ? null : r.id)}
                  >
                    <Text style={s.iconBtnDangerText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Valores — modo lectura */}
              {editando !== r.id && (
                <View style={s.metricsGrid}>
                  {[
                    { label: 'Peso',    value: `${r.peso} kg` },
                    { label: 'Grasa',   value: `${r.grasa}%` },
                    { label: 'Músculo', value: `${r.musculo}%` },
                    { label: 'Cintura', value: `${r.cintura} cm` },
                  ].map((m, j) => (
                    <View key={j} style={s.metricCell}>
                      <Text style={s.metricValue}>{m.value}</Text>
                      <Text style={s.metricLabel}>{m.label}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Formulario de edición — RF11 */}
              {editando === r.id && (
                <View style={s.editForm}>
                  <View style={s.editGrid}>
                    {[
                      { key: 'peso',    label: 'Peso (kg)',    ph: '69.0' },
                      { key: 'grasa',   label: '% Grasa',      ph: '18.2' },
                      { key: 'musculo', label: '% Músculo',    ph: '42.1' },
                      { key: 'cintura', label: 'Cintura (cm)', ph: '81'   },
                    ].map(f => (
                      <View key={f.key} style={s.editField}>
                        <Text style={s.editLabel}>{f.label}</Text>
                        <TextInput
                          style={s.editInput}
                          value={editForm[f.key] || ''}
                          onChangeText={v => setEditForm(prev => ({ ...prev, [f.key]: v }))}
                          placeholder={f.ph}
                          placeholderTextColor="#555"
                          keyboardType="decimal-pad"
                        />
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity style={s.btnSave} onPress={() => guardarEdicion(r.id)}>
                    <Text style={s.btnSaveText}>✓ Guardar cambios</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Confirmación eliminar */}
            {confirmElim === r.id && (
              <View style={s.confirmBox}>
                <Text style={s.confirmTitle}>¿Eliminar registro del {r.fecha}?</Text>
                <Text style={s.confirmSub}>No se puede deshacer.</Text>
                <View style={s.confirmBtns}>
                  <TouchableOpacity style={s.btnCancel} onPress={() => setConfirmElim(null)}>
                    <Text style={s.btnCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.btnDelete} onPress={() => eliminar(r.id)}>
                    <Text style={s.btnDeleteText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}

        {registros.length === 0 && (
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>📏</Text>
            <Text style={s.emptyText}>Sin registros de medidas</Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#1a1a22' },
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#2a2a35' },
  backBtn:          { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' },
  backText:         { color: 'white', fontSize: 18, fontWeight: '600' },
  headerTitle:      { fontSize: 17, fontWeight: '800', color: 'white' },
  actionBtn:        { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' },
  actionText:       { color: '#7c6fcd', fontSize: 20, fontWeight: '700' },

  body:             { padding: 16, paddingBottom: 40 },

  badge:            { alignSelf: 'flex-start', backgroundColor: 'rgba(249,115,22,0.12)', borderWidth: 1, borderColor: 'rgba(249,115,22,0.3)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 16 },
  badgeText:        { fontSize: 10, fontWeight: '700', color: '#f97316' },

  card:             { backgroundColor: '#2a2a35', borderRadius: 14, padding: 14, marginBottom: 4, borderWidth: 1, borderColor: '#333' },
  cardHeader:       { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardFecha:        { flex: 1, fontSize: 13, fontWeight: '700', color: 'white' },
  cardActions:      { flexDirection: 'row', gap: 8 },

  iconBtn:          { width: 32, height: 32, borderRadius: 8, backgroundColor: '#1a1a22', borderWidth: 1, borderColor: '#444', alignItems: 'center', justifyContent: 'center' },
  iconBtnActive:    { backgroundColor: 'rgba(124,111,205,0.2)', borderColor: '#7c6fcd' },
  iconBtnText:      { fontSize: 14, color: '#aaa' },
  iconBtnTextActive:{ color: '#7c6fcd' },
  iconBtnDanger:    { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(248,113,113,0.1)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)', alignItems: 'center', justifyContent: 'center' },
  iconBtnDangerText:{ fontSize: 14 },

  metricsGrid:      { flexDirection: 'row', gap: 8 },
  metricCell:       { flex: 1, backgroundColor: '#1a1a22', borderRadius: 8, padding: 8, alignItems: 'center' },
  metricValue:      { fontSize: 13, fontWeight: '700', color: 'white' },
  metricLabel:      { fontSize: 10, color: '#666', marginTop: 2 },

  editForm:         { marginTop: 4 },
  editGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  editField:        { width: '47%' },
  editLabel:        { fontSize: 10, color: '#aaa', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  editInput:        { backgroundColor: '#1a1a22', borderRadius: 8, padding: 10, color: 'white', fontSize: 13, borderWidth: 1, borderColor: '#444', textAlign: 'center' },
  btnSave:          { backgroundColor: '#7c6fcd', borderRadius: 10, padding: 10, alignItems: 'center' },
  btnSaveText:      { color: 'white', fontWeight: '700', fontSize: 13 },

  confirmBox:       { backgroundColor: 'rgba(248,113,113,0.07)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.25)', borderRadius: 12, padding: 14, marginBottom: 10 },
  confirmTitle:     { fontSize: 13, fontWeight: '700', color: '#f87171', marginBottom: 4 },
  confirmSub:       { fontSize: 11, color: '#888', marginBottom: 10 },
  confirmBtns:      { flexDirection: 'row', gap: 8 },
  btnCancel:        { flex: 1, backgroundColor: '#2a2a35', borderRadius: 8, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  btnCancelText:    { color: '#aaa', fontSize: 12, fontWeight: '600' },
  btnDelete:        { flex: 1, backgroundColor: '#f87171', borderRadius: 8, padding: 10, alignItems: 'center' },
  btnDeleteText:    { color: 'white', fontSize: 12, fontWeight: '700' },

  emptyState:       { alignItems: 'center', paddingVertical: 48 },
  emptyIcon:        { fontSize: 40, marginBottom: 10 },
  emptyText:        { color: '#666', fontSize: 14 },
});
