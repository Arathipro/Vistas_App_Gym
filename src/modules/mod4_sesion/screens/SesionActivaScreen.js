import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert } from 'react-native';
import { useRutinas, esCardio } from '../../../context/RutinasContext';

const PREP_DEFAULT = 3;

function fmt(segundos) {
  const total = Math.max(0, Math.round(segundos || 0));
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function totalSeries(ejercicio) {
  return esCardio(ejercicio) ? 1 : Number(ejercicio?.series) || 3;
}

function descansoDe(ejercicio) {
  return esCardio(ejercicio) ? 0 : Number(ejercicio?.descanso) || 90;
}

function repsSugeridas(ejercicio) {
  const min = Number(ejercicio?.repsMin) || Number(ejercicio?.reps) || 8;
  const max = Number(ejercicio?.repsMax) || min;
  return String(Math.round((min + max) / 2));
}

function estadoLabel(estado) {
  if (estado === 'preparacion') return 'Prepárate';
  if (estado === 'serie') return 'Serie en curso';
  if (estado === 'descanso') return 'Descanso activo';
  if (estado === 'resumen') return 'Resumen final';
  return 'Sesión activa';
}

export default function SesionActivaScreen({ navigation }) {
  const { sesionActual, setSesionActual } = useRutinas();
  const ejercicios = sesionActual?.ejercicios || [];

  const [estado, setEstado] = useState('preparacion');
  const [ejIndex, setEjIndex] = useState(0);
  const [serieActual, setSerieActual] = useState(1);
  const [prep, setPrep] = useState(PREP_DEFAULT);
  const [serieSeg, setSerieSeg] = useState(0);
  const [descansoSeg, setDescansoSeg] = useState(0);
  const [registros, setRegistros] = useState(sesionActual?.registros || []);
  const [peso, setPeso] = useState('');
  const [reps, setReps] = useState('');
  const [notaSerie, setNotaSerie] = useState('');
  const [notaSesion, setNotaSesion] = useState(sesionActual?.notaSesion || '');
  const [finalizada, setFinalizada] = useState(false);

  const ejercicio = ejercicios[ejIndex];
  const total = totalSeries(ejercicio);
  const completadasEjercicio = registros.filter(r => r.ejercicioKey === (ejercicio?.uid || ejercicio?.id)).length;
  const totalRegistrosEsperados = ejercicios.reduce((acc, e) => acc + totalSeries(e), 0);
  const progreso = totalRegistrosEsperados ? registros.length / totalRegistrosEsperados : 0;
  const inicioMs = useMemo(() => sesionActual?.inicioISO ? new Date(sesionActual.inicioISO).getTime() : Date.now(), [sesionActual?.inicioISO]);
  const [duracionReal, setDuracionReal] = useState(Math.floor((Date.now() - inicioMs) / 1000));

  useEffect(() => {
    const id = setInterval(() => setDuracionReal(Math.floor((Date.now() - inicioMs) / 1000)), 1000);
    return () => clearInterval(id);
  }, [inicioMs]);

  useEffect(() => {
    if (!ejercicio || finalizada) return;
    if (estado !== 'preparacion') return;
    if (prep <= 0) {
      setEstado('serie');
      setSerieSeg(0);
      return;
    }
    const id = setTimeout(() => setPrep(v => v - 1), 1000);
    return () => clearTimeout(id);
  }, [estado, prep, ejercicio, finalizada]);

  useEffect(() => {
    if (estado !== 'serie' || finalizada) return;
    const id = setInterval(() => setSerieSeg(v => v + 1), 1000);
    return () => clearInterval(id);
  }, [estado, finalizada]);

  useEffect(() => {
    if (estado !== 'descanso' || finalizada) return;
    if (descansoSeg <= 0) return;
    const id = setTimeout(() => setDescansoSeg(v => Math.max(0, v - 1)), 1000);
    return () => clearTimeout(id);
  }, [estado, descansoSeg, finalizada]);

  useEffect(() => {
    if (!ejercicio) return;
    setReps(repsSugeridas(ejercicio));
    setPeso('');
    setNotaSerie('');
  }, [ejercicio, serieActual]);

  function detenerSerie() {
    setEstado('descanso');
    setDescansoSeg(descansoDe(ejercicio));
  }

  function guardarSerie() {
    if (!ejercicio) return;
    if (!esCardio(ejercicio) && (!peso.trim() || !reps.trim())) {
      Alert.alert('Registro pendiente', 'Completa peso y repeticiones para guardar la serie.');
      return;
    }

    const nuevo = {
      id: `reg-${Date.now()}`,
      ejercicioKey: ejercicio.uid || ejercicio.id,
      ejercicioNombre: ejercicio.nombre,
      serie: serieActual,
      peso: esCardio(ejercicio) ? '—' : peso.trim(),
      unidad: ejercicio.unidad || 'kg',
      reps: esCardio(ejercicio) ? `${ejercicio.duracionMin || 20} min` : reps.trim(),
      tiempoEjecucionSeg: serieSeg,
      descansoConfiguradoSeg: descansoDe(ejercicio),
      nota: notaSerie.trim(),
    };

    const nuevosRegistros = [...registros, nuevo];
    setRegistros(nuevosRegistros);
    setSesionActual(prev => prev ? { ...prev, registros: nuevosRegistros } : prev);

    const esUltimaSerie = serieActual >= total;
    const esUltimoEjercicio = ejIndex >= ejercicios.length - 1;

    setPeso('');
    setNotaSerie('');

    if (esUltimaSerie && esUltimoEjercicio) {
      finalizarCon(nuevosRegistros);
      return;
    }

    if (esUltimaSerie) {
      setEjIndex(i => i + 1);
      setSerieActual(1);
    } else {
      setSerieActual(s => s + 1);
    }
    setPrep(PREP_DEFAULT);
    setSerieSeg(0);
    setDescansoSeg(0);
    setEstado('preparacion');
  }

  function finalizarCon(registrosFinales = registros) {
    const finISO = new Date().toISOString();
    const resumen = {
      ...sesionActual,
      estado: 'finalizada',
      finISO,
      duracionRealSeg: Math.max(1, Math.floor((Date.now() - inicioMs) / 1000)),
      registros: registrosFinales,
      notaSesion,
      resumenVisual: {
        ejercicios: ejercicios.length,
        series: registrosFinales.length,
        estimadoSeg: sesionActual?.tiempoEstimadoSeg || 0,
      },
    };
    setSesionActual(resumen);
    setFinalizada(true);
    setEstado('resumen');
  }

  function cancelarSesion() {
    Alert.alert('Salir de la sesión', 'La sesión simulada se quedará en memoria solo mientras la app esté abierta.', [
      { text: 'Seguir entrenando', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => navigation.navigate('RutinaDetalle') },
    ]);
  }

  if (!ejercicios.length) {
    return (
      <View style={s.container}>
        <StatusBar barStyle="light-content" />
        <View style={s.center}>
          <Text style={s.emptyIcon}>⏱️</Text>
          <Text style={s.emptyTitle}>No hay sesión activa</Text>
          <TouchableOpacity style={s.btnPrimary} onPress={() => navigation.navigate('Rutinas')}><Text style={s.btnPrimaryText}>Ir a rutinas</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  if (estado === 'resumen') {
    const diferencia = duracionReal - (sesionActual?.tiempoEstimadoSeg || 0);
    return (
      <View style={s.container}>
        <StatusBar barStyle="light-content" />
        <View style={s.header}><Text style={s.headerTitle}>Sesión finalizada</Text></View>
        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
          <View style={s.doneHero}>
            <Text style={s.doneIcon}>✅</Text>
            <Text style={s.doneTitle}>Entrenamiento guardado en memoria</Text>
            <Text style={s.doneSub}>Listo para conectarse después a SQLite/historial real.</Text>
          </View>

          <View style={s.statsRow}>
            <View style={s.statCard}><Text style={s.statValue}>{fmt(duracionReal)}</Text><Text style={s.statLabel}>tiempo real</Text></View>
            <View style={s.statCard}><Text style={s.statValue}>{registros.length}</Text><Text style={s.statLabel}>series</Text></View>
            <View style={s.statCard}><Text style={s.statValue}>{ejercicios.length}</Text><Text style={s.statLabel}>ejercicios</Text></View>
          </View>

          <View style={s.compareCard}>
            <Text style={s.compareTitle}>Tiempo real vs estimado</Text>
            <Text style={s.compareMain}>{diferencia >= 0 ? '+' : '-'}{fmt(Math.abs(diferencia))}</Text>
            <Text style={s.compareSub}>{diferencia >= 0 ? 'Tardaste un poco más de lo estimado, normal si hubo descansos extra.' : 'Terminaste más rápido de lo estimado, buen ritmo.'}</Text>
          </View>

          <Text style={s.sectionLabel}>Resumen por ejercicio</Text>
          {ejercicios.map((e, i) => {
            const regs = registros.filter(r => r.ejercicioKey === (e.uid || e.id));
            return <View key={e.uid || `${e.id}-${i}`} style={s.summaryExercise}><Text style={s.summaryName}>{e.icon || '🏋️'} {e.nombre}</Text><Text style={s.summarySub}>{regs.length}/{totalSeries(e)} series registradas</Text></View>;
          })}

          <TextInput style={[s.input, s.noteInput]} multiline maxLength={500} placeholder="Nota general de la sesión..." placeholderTextColor="#666" value={notaSesion} onChangeText={setNotaSesion} />
          <TouchableOpacity style={s.btnPrimary} onPress={() => { setSesionActual(prev => prev ? { ...prev, notaSesion } : prev); navigation.navigate('Progreso'); }}><Text style={s.btnPrimaryText}>Ver progreso simulado →</Text></TouchableOpacity>
          <TouchableOpacity style={s.btnSecondary} onPress={() => navigation.navigate('RutinaDetalle')}><Text style={s.btnSecondaryText}>Volver a rutina</Text></TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={cancelarSesion} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <View style={s.headerCenter}><Text style={s.headerTitle}>{estadoLabel(estado)}</Text><Text style={s.headerSub}>{sesionActual?.rutinaNombre} · {sesionActual?.dia}</Text></View>
        <Text style={s.timerMini}>{fmt(duracionReal)}</Text>
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.progressTrack}><View style={[s.progressFill, { width: `${Math.min(100, progreso * 100)}%` }]} /></View>
        <Text style={s.progressText}>{registros.length}/{totalRegistrosEsperados} series registradas</Text>

        <View style={s.currentCard}>
          <View style={s.exerciseTopRow}>
            <Text style={s.currentIcon}>{ejercicio.icon || '🏋️'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.currentName}>{ejercicio.nombre}</Text>
              <Text style={s.currentSub}>Ejercicio {ejIndex + 1}/{ejercicios.length} · Serie {serieActual}/{total}</Text>
            </View>
          </View>

          <View style={s.bigTimerBox}>
            <Text style={s.bigTimerLabel}>{estado === 'preparacion' ? 'Comienza en' : estado === 'serie' ? 'Tiempo de ejecución' : 'Descanso restante'}</Text>
            <Text style={s.bigTimer}>{estado === 'preparacion' ? prep : estado === 'serie' ? fmt(serieSeg) : fmt(descansoSeg)}</Text>
            {estado === 'preparacion' && <Text style={s.bigTimerHint}>Respira, acomódate y prepara la técnica</Text>}
            {estado === 'descanso' && descansoSeg <= 0 && <Text style={s.warningText}>Descanso terminado · guarda para continuar</Text>}
          </View>

          {estado === 'serie' && <TouchableOpacity style={s.btnPrimary} onPress={detenerSerie}><Text style={s.btnPrimaryText}>■ Terminar serie</Text></TouchableOpacity>}

          {estado === 'descanso' && (
            <View style={s.formCard}>
              <Text style={s.formTitle}>Registrar serie {serieActual}</Text>
              {!esCardio(ejercicio) && <View style={s.formRow}><TextInput style={s.input} keyboardType="numeric" placeholder={`Peso (${ejercicio.unidad || 'kg'})`} placeholderTextColor="#666" value={peso} onChangeText={setPeso} /><TextInput style={s.input} keyboardType="numeric" placeholder="Reps" placeholderTextColor="#666" value={reps} onChangeText={setReps} /></View>}
              {esCardio(ejercicio) && <Text style={s.cardioText}>Cardio registrado por duración: {ejercicio.duracionMin || 20} min</Text>}
              <TextInput style={[s.input, s.noteInput]} multiline maxLength={500} placeholder="Nota de serie opcional..." placeholderTextColor="#666" value={notaSerie} onChangeText={setNotaSerie} />
              <View style={s.formActions}>
                {descansoSeg > 0 && <TouchableOpacity style={s.btnSmallSecondary} onPress={() => setDescansoSeg(0)}><Text style={s.btnSmallSecondaryText}>Saltar descanso</Text></TouchableOpacity>}
                <TouchableOpacity style={s.btnSmallPrimary} onPress={guardarSerie}><Text style={s.btnSmallPrimaryText}>Guardar y continuar</Text></TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <Text style={s.sectionLabel}>Series registradas</Text>
        {registros.length === 0 ? <Text style={s.noRegs}>Aún no hay series guardadas.</Text> : registros.slice().reverse().map(r => (
          <View key={r.id} style={s.regCard}><Text style={s.regName}>{r.ejercicioNombre}</Text><Text style={s.regSub}>Serie {r.serie} · {r.peso} {r.unidad} · {r.reps} reps · {fmt(r.tiempoEjecucionSeg)}</Text>{!!r.nota && <Text style={s.regNote}>“{r.nota}”</Text>}</View>
        ))}

        <TouchableOpacity style={s.btnDanger} onPress={() => finalizarCon()}><Text style={s.btnDangerText}>Finalizar sesión ahora</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a22' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#2a2a35' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' },
  backText: { color: 'white', fontSize: 18, fontWeight: '800' },
  headerCenter: { flex: 1, alignItems: 'center', marginHorizontal: 10 },
  headerTitle: { color: 'white', fontSize: 17, fontWeight: '900', textAlign: 'center' },
  headerSub: { color: '#777', fontSize: 11, marginTop: 2, textAlign: 'center' },
  timerMini: { color: '#5eead4', fontSize: 13, fontWeight: '900', width: 48, textAlign: 'right' },
  body: { padding: 16, paddingBottom: 44 },
  progressTrack: { height: 6, backgroundColor: '#2a2a35', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7c6fcd', borderRadius: 10 },
  progressText: { color: '#777', fontSize: 11, textAlign: 'right', marginTop: 6, marginBottom: 12 },
  currentCard: { backgroundColor: '#2a2a35', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#333', marginBottom: 16 },
  exerciseTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  currentIcon: { fontSize: 34, marginRight: 12 },
  currentName: { color: 'white', fontSize: 18, fontWeight: '900' },
  currentSub: { color: '#888', fontSize: 12, marginTop: 3 },
  bigTimerBox: { backgroundColor: '#1a1a22', borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  bigTimerLabel: { color: '#888', fontSize: 11, textTransform: 'uppercase', fontWeight: '800', letterSpacing: .6 },
  bigTimer: { color: '#5eead4', fontSize: 54, fontWeight: '900', marginTop: 4 },
  bigTimerHint: { color: '#777', fontSize: 12, textAlign: 'center' },
  warningText: { color: '#f97316', fontSize: 12, fontWeight: '800', marginTop: 4 },
  formCard: { marginTop: 14, backgroundColor: '#1a1a22', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#333' },
  formTitle: { color: 'white', fontSize: 14, fontWeight: '900', marginBottom: 10 },
  formRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#2a2a35', borderWidth: 1, borderColor: '#3a3a45', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: 'white', fontSize: 13 },
  noteInput: { minHeight: 74, textAlignVertical: 'top', marginTop: 8 },
  cardioText: { color: '#5eead4', fontSize: 13, fontWeight: '800', marginBottom: 8 },
  formActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btnPrimary: { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 14 },
  btnPrimaryText: { color: 'white', fontSize: 15, fontWeight: '900' },
  btnSecondary: { backgroundColor: '#2a2a35', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#333' },
  btnSecondaryText: { color: '#aaa', fontSize: 14, fontWeight: '800' },
  btnSmallPrimary: { flex: 1, backgroundColor: '#7c6fcd', borderRadius: 10, padding: 11, alignItems: 'center' },
  btnSmallPrimaryText: { color: 'white', fontWeight: '900', fontSize: 12 },
  btnSmallSecondary: { flex: 1, backgroundColor: '#2a2a35', borderRadius: 10, padding: 11, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  btnSmallSecondaryText: { color: '#aaa', fontWeight: '800', fontSize: 12 },
  sectionLabel: { color: '#777', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10 },
  noRegs: { color: '#666', fontSize: 13, textAlign: 'center', paddingVertical: 12 },
  regCard: { backgroundColor: '#2a2a35', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#333', marginBottom: 8 },
  regName: { color: 'white', fontSize: 13, fontWeight: '900' },
  regSub: { color: '#888', fontSize: 12, marginTop: 3 },
  regNote: { color: '#aaa', fontSize: 12, marginTop: 7, fontStyle: 'italic' },
  btnDanger: { backgroundColor: 'rgba(255,90,90,0.1)', borderWidth: 1, borderColor: 'rgba(255,90,90,0.35)', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 12 },
  btnDangerText: { color: '#ff6b6b', fontSize: 13, fontWeight: '900' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyIcon: { fontSize: 46 },
  emptyTitle: { color: 'white', fontSize: 18, fontWeight: '900', marginVertical: 12 },
  doneHero: { alignItems: 'center', backgroundColor: '#2a2a35', borderRadius: 18, padding: 22, borderWidth: 1, borderColor: '#333', marginBottom: 12 },
  doneIcon: { fontSize: 48 },
  doneTitle: { color: 'white', fontSize: 18, fontWeight: '900', marginTop: 8, textAlign: 'center' },
  doneSub: { color: '#888', fontSize: 13, textAlign: 'center', marginTop: 5 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: '#2a2a35', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  statValue: { color: '#5eead4', fontSize: 18, fontWeight: '900' },
  statLabel: { color: '#777', fontSize: 10, marginTop: 3, textTransform: 'uppercase', fontWeight: '800' },
  compareCard: { backgroundColor: 'rgba(124,111,205,0.13)', borderWidth: 1, borderColor: 'rgba(124,111,205,0.35)', borderRadius: 14, padding: 14, marginBottom: 16 },
  compareTitle: { color: 'white', fontSize: 14, fontWeight: '900' },
  compareMain: { color: '#7c6fcd', fontSize: 30, fontWeight: '900', marginTop: 4 },
  compareSub: { color: '#aaa', fontSize: 12, lineHeight: 18 },
  summaryExercise: { backgroundColor: '#2a2a35', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#333', marginBottom: 8 },
  summaryName: { color: 'white', fontSize: 13, fontWeight: '900' },
  summarySub: { color: '#888', fontSize: 12, marginTop: 3 },
});
