import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert } from 'react-native';
import { useRutinas, esCardio, esCore } from '../../../context/RutinasContext';

function segundosEjercicio(e) {
  if (esCardio(e)) return (Number(e.duracionMin) || 30) * 60;
  const s = Number(e.series) || 3;
  const d = Number(e.descanso) || 90;
  return (s * 60) + Math.max(0, s - 1) * d;
}

function resumenEjercicio(e, form) {
  if (esCardio(e)) return `${form.duracionMin || 30} min`;
  return `${form.series}×${form.repsMin}-${form.repsMax} · ${form.descanso}s`;
}

function EjercicioCard({ ej, onUpdate, onRemove }) {
  const cardio = esCardio(ej);
  const core = esCore(ej);
  const fuerza = !cardio && !core;
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    series: String(ej.series || 3), repsMin: String(ej.repsMin || 8), repsMax: String(ej.repsMax || 12),
    descanso: String(ej.descanso || 90), unidad: ej.unidad || 'kg', duracionMin: String(ej.duracionMin || 30),
    articulacion: ej.articulacion || 'Multiarticular', lateralidad: ej.lateralidad || 'Bilateral',
  });

  function save() {
    if (cardio) {
      onUpdate({ duracionMin: Number(form.duracionMin) || 30, series: 1, descanso: 0, unidad: 'tiempo', articulacion: null, lateralidad: null });
    } else {
      onUpdate({ ...form, series: Number(form.series) || 1, descanso: Number(form.descanso) || 0, articulacion: core ? null : form.articulacion, lateralidad: core ? null : form.lateralidad });
    }
    setEdit(false);
  }

  return <View style={s.ejCard}>
    <View style={s.ejHeader}>
      <View style={s.ejIcon}><Text style={s.ejIconText}>{ej.isCustom ? '✏️' : ej.icon}</Text></View>
      <View style={{ flex: 1 }}><Text style={s.ejName}>{ej.nombre}</Text><Text style={s.ejSub}>{ej.categoria || 'Ejercicio'} · {resumenEjercicio(ej, form)}</Text></View>
      <TouchableOpacity style={s.smallBtn} onPress={() => setEdit(v => !v)}><Text style={s.smallText}>{edit ? '✕' : '✎'}</Text></TouchableOpacity>
      <TouchableOpacity style={s.delBtn} onPress={() => Alert.alert('Eliminar ejercicio', '¿Quitar este ejercicio del día?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Eliminar', style: 'destructive', onPress: onRemove }])}><Text style={s.delText}>🗑</Text></TouchableOpacity>
    </View>

    {edit && <View style={s.editBox}>
      {cardio ? <>
        <Text style={s.labelMini}>Duración total</Text>
        <View style={s.timeRow}><TextInput style={s.inputMiniWide} keyboardType="numeric" value={form.duracionMin} onChangeText={v => setForm(p => ({ ...p, duracionMin: v }))} /><Text style={s.timeUnit}>minutos</Text></View>
      </> : <>
        <View style={s.grid}>{[['series', 'Series'], ['repsMin', 'Reps min'], ['repsMax', 'Reps max'], ['descanso', 'Descanso s']].map(([k, l]) => <View key={k} style={{ flex: 1 }}><Text style={s.labelMini}>{l}</Text><TextInput style={s.inputMini} keyboardType="numeric" value={form[k]} onChangeText={v => setForm(p => ({ ...p, [k]: v }))} /></View>)}</View>
        <Text style={s.labelMini}>Unidad de peso</Text><View style={s.optRow}>{['kg', 'lb', 'placa'].map(v => <TouchableOpacity key={v} style={[s.opt, form.unidad === v && s.optActive]} onPress={() => setForm(p => ({ ...p, unidad: v }))}><Text style={[s.optText, form.unidad === v && s.optTextActive]}>{v === 'placa' ? 'Placa #' : v}</Text></TouchableOpacity>)}</View>
        {fuerza && <>
          <Text style={s.labelMini}>Articulación</Text><View style={s.optRow}>{['Monoarticular', 'Multiarticular'].map(v => <TouchableOpacity key={v} style={[s.opt, form.articulacion === v && s.optActivePurple]} onPress={() => setForm(p => ({ ...p, articulacion: v }))}><Text style={[s.optText, form.articulacion === v && s.optTextPurple]}>{v === 'Monoarticular' ? 'Mono' : 'Multi'}</Text></TouchableOpacity>)}</View>
          <Text style={s.labelMini}>Lateralidad</Text><View style={s.optRow}>{['Unilateral', 'Bilateral'].map(v => <TouchableOpacity key={v} style={[s.opt, form.lateralidad === v && s.optActiveTeal]} onPress={() => setForm(p => ({ ...p, lateralidad: v }))}><Text style={[s.optText, form.lateralidad === v && s.optTextTeal]}>{v}</Text></TouchableOpacity>)}</View>
        </>}
      </>}
      <TouchableOpacity style={s.saveBtn} onPress={save}><Text style={s.saveText}>Guardar cambios ✓</Text></TouchableOpacity>
    </View>}
  </View>;
}

export default function DiaRutinaScreen({ navigation }) {
  const { rutinas, rutinaActual, desdeDia, seleccionarDia, actualizarEjercicioDia, eliminarEjercicioDia, setSesionActual } = useRutinas();
  const rutina = rutinas.find(r => r.id === rutinaActual?.id) || rutinaActual;
  const dia = desdeDia || rutina?.diasHabilitados?.[0];
  const ejercicios = rutina?.ejerciciosDetallePorDia?.[dia] || [];
  const tiempo = ejercicios.reduce((t, e) => t + segundosEjercicio(e), 0);
  if (!rutina || !dia) return <View style={s.container}><View style={s.center}><Text style={s.emptyText}>Selecciona un día desde una rutina</Text></View></View>;
  return <View style={s.container}><StatusBar barStyle="light-content" /><View style={s.header}><TouchableOpacity style={s.backBtn} onPress={() => navigation.navigate('RutinaDetalle')}><Text style={s.backText}>←</Text></TouchableOpacity><Text style={s.headerTitle}>{dia} — {rutina.nombre}</Text><View style={{ width: 36 }} /></View><ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
    <View style={s.badge}><Text style={s.badgeText}>RF16 — Parámetros por ejercicio</Text></View><View style={s.accent}><Text style={s.accentIcon}>📅</Text><View style={{ flex: 1 }}><Text style={s.accentTitle}>{dia}</Text><Text style={s.accentSub}>{ejercicios.length} ejercicios asignados</Text></View>{ejercicios.length > 0 && <View style={s.timeBox}><Text style={s.timeVal}>{Math.round(tiempo / 60)}m</Text><Text style={s.timeSub}>estimado</Text></View>}</View>
    {ejercicios.length === 0 ? <View style={s.emptyCard}><Text style={s.emptyIcon}>🏋️</Text><Text style={s.emptyTitle}>Sin ejercicios aún</Text><Text style={s.emptySub}>Agrega ejercicios del catálogo o crea uno personalizado.</Text></View> : ejercicios.map(e => <EjercicioCard key={e.uid} ej={e} onUpdate={c => actualizarEjercicioDia(rutina.id, dia, e.uid, c)} onRemove={() => eliminarEjercicioDia(rutina.id, dia, e.uid)} />)}
    <TouchableOpacity style={s.addBtn} onPress={() => { seleccionarDia(rutina, dia); navigation.navigate('Ejercicios'); }}><Text style={s.addText}>+ Agregar ejercicio</Text></TouchableOpacity>
    {ejercicios.length > 0 && <TouchableOpacity style={s.btnPrimary} onPress={() => { setSesionActual({ rutinaId: rutina.id, dia, rutinaNombre: rutina.nombre, ejercicios }); navigation.navigate('PreSesion') }}><Text style={s.btnPrimaryText}>▶ Iniciar sesión de {dia}</Text></TouchableOpacity>}
  </ScrollView></View>;
}

const s = StyleSheet.create({ container: { flex: 1, backgroundColor: '#1a1a22' }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, emptyText: { color: '#aaa' }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#2a2a35' }, backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' }, backText: { color: 'white', fontSize: 18 }, headerTitle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 16, fontWeight: '800' }, body: { padding: 16, paddingBottom: 40 }, badge: { alignSelf: 'flex-start', backgroundColor: 'rgba(249,115,22,.12)', borderWidth: 1, borderColor: 'rgba(249,115,22,.3)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 16 }, badgeText: { fontSize: 10, fontWeight: '700', color: '#f97316' }, accent: { backgroundColor: '#7c6fcd', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }, accentIcon: { fontSize: 28 }, accentTitle: { color: 'white', fontWeight: '800', fontSize: 18 }, accentSub: { color: 'rgba(255,255,255,.75)', fontSize: 12 }, timeBox: { alignItems: 'center' }, timeVal: { color: '#5eead4', fontWeight: '800', fontSize: 20 }, timeSub: { color: 'rgba(255,255,255,.7)', fontSize: 10 }, emptyCard: { backgroundColor: '#2a2a35', borderRadius: 14, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#333', marginBottom: 12 }, emptyIcon: { fontSize: 36 }, emptyTitle: { color: 'white', fontWeight: '800', marginTop: 8 }, emptySub: { color: '#888', fontSize: 12, textAlign: 'center', marginTop: 4 }, ejCard: { backgroundColor: '#2a2a35', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#333', marginBottom: 10 }, ejHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 }, ejIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#1a1a22', alignItems: 'center', justifyContent: 'center' }, ejIconText: { fontSize: 18 }, ejName: { color: 'white', fontSize: 14, fontWeight: '800' }, ejSub: { color: '#888', fontSize: 11, marginTop: 2 }, smallBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: 'rgba(124,111,205,.15)', alignItems: 'center', justifyContent: 'center' }, smallText: { color: '#7c6fcd' }, delBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: 'rgba(248,113,113,.08)', alignItems: 'center', justifyContent: 'center' }, delText: { fontSize: 13 }, editBox: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#333', paddingTop: 12, gap: 8 }, grid: { flexDirection: 'row', gap: 8 }, labelMini: { fontSize: 10, color: '#888', fontWeight: '700', textTransform: 'uppercase' }, inputMini: { backgroundColor: '#1a1a22', color: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#333', padding: 8, textAlign: 'center' }, inputMiniWide: { flex: 1, backgroundColor: '#1a1a22', color: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#333', padding: 10, textAlign: 'center' }, timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 }, timeUnit: { color: '#aaa', fontSize: 13 }, optRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' }, opt: { backgroundColor: '#1a1a22', borderRadius: 8, borderWidth: 1, borderColor: '#333', paddingHorizontal: 10, paddingVertical: 7 }, optActive: { borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,.12)' }, optActivePurple: { borderColor: '#7c6fcd', backgroundColor: 'rgba(124,111,205,.12)' }, optActiveTeal: { borderColor: '#5eead4', backgroundColor: 'rgba(94,234,212,.1)' }, optText: { color: '#888', fontSize: 12, fontWeight: '600' }, optTextActive: { color: '#f97316' }, optTextPurple: { color: '#7c6fcd' }, optTextTeal: { color: '#5eead4' }, saveBtn: { backgroundColor: '#7c6fcd', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 4 }, saveText: { color: 'white', fontWeight: '800' }, addBtn: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(94,234,212,.4)', backgroundColor: 'rgba(94,234,212,.07)', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 }, addText: { color: '#5eead4', fontWeight: '800' }, btnPrimary: { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 }, btnPrimaryText: { color: 'white', fontWeight: '800' } });
