import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRutinas, esCardio } from '../../../context/RutinasContext';

function estimarEjercicio(ejercicio) {
  if (esCardio(ejercicio)) return (Number(ejercicio.duracionMin) || 20) * 60;
  const series = Number(ejercicio.series) || 3;
  const descanso = Number(ejercicio.descanso) || 90;
  const tiempoSerie = Number(ejercicio.tiempoSerieSeg) || 60;
  return (series * tiempoSerie) + Math.max(0, series - 1) * descanso;
}

function fmtTiempo(segundos) {
  const total = Math.max(0, Math.round(segundos || 0));
  const min = Math.floor(total / 60);
  const seg = total % 60;
  if (min <= 0) return `${seg}s`;
  return seg ? `${min}m ${seg}s` : `${min}m`;
}

function descripcionEjercicio(ejercicio) {
  if (esCardio(ejercicio)) return `${ejercicio.duracionMin || 20} min · cardio`;
  return `${ejercicio.series || 3} series · ${ejercicio.repsMin || '?'}–${ejercicio.repsMax || '?'} reps · ${ejercicio.descanso || 90}s descanso`;
}

export default function PreSesionScreen({ navigation }) {
  const { sesionActual, setSesionActual, rutinas, rutinaActual } = useRutinas();

  const sesion = useMemo(() => {
    if (sesionActual?.ejercicios?.length) return sesionActual;
    const rutina = rutinas.find(r => r.id === rutinaActual?.id) || rutinaActual;
    const dia = rutina?.diasHabilitados?.find(d => (rutina.ejerciciosDetallePorDia?.[d] || []).length > 0);
    return {
      rutinaId: rutina?.id,
      rutinaNombre: rutina?.nombre || 'Entrenamiento',
      dia: dia || 'Hoy',
      ejercicios: dia ? (rutina.ejerciciosDetallePorDia?.[dia] || []) : [],
    };
  }, [sesionActual, rutinas, rutinaActual]);

  const ejercicios = sesion?.ejercicios || [];
  const tiempoEstimado = ejercicios.reduce((acc, e) => acc + estimarEjercicio(e), 0);
  const totalSeries = ejercicios.reduce((acc, e) => acc + (esCardio(e) ? 1 : Number(e.series) || 3), 0);

  function comenzar() {
    const nuevaSesion = {
      ...sesion,
      id: `sesion-${Date.now()}`,
      estado: 'activa',
      inicioISO: new Date().toISOString(),
      tiempoEstimadoSeg: tiempoEstimado,
      ejercicios: ejercicios.map((e, index) => ({ ...e, ordenSesion: index + 1 })),
      registros: [],
      ejerciciosCompletados: [],
      notaSesion: '',
    };
    setSesionActual(nuevaSesion);
    navigation.navigate('SesionActiva');
  }

  if (!ejercicios.length) {
    return (
      <View style={s.container}>
        <StatusBar barStyle="light-content" />
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.navigate('RutinaDetalle')} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
          <Text style={s.headerTitle}>Pre-sesión</Text>
          <View style={s.headerSpacer} />
        </View>
        <View style={s.center}>
          <Text style={s.emptyIcon}>🏋️</Text>
          <Text style={s.emptyTitle}>No hay ejercicios para iniciar</Text>
          <Text style={s.emptySub}>Agrega ejercicios a un día de rutina antes de comenzar una sesión activa.</Text>
          <TouchableOpacity style={s.btnPrimary} onPress={() => navigation.navigate('RutinaDetalle')}><Text style={s.btnPrimaryText}>Volver a la rutina</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('RutinaDetalle')} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Iniciar sesión</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.badge}><Text style={s.badgeText}>Módulo 4 · RF19–RF20</Text></View>

        <View style={s.heroCard}>
          <View style={s.heroIcon}><Text style={s.heroIconText}>▶️</Text></View>
          <View style={s.heroInfo}>
            <Text style={s.rutinaNombre}>{sesion.rutinaNombre || 'Entrenamiento'}</Text>
            <Text style={s.rutinaSub}>{sesion.dia || 'Hoy'} · {ejercicios.length} ejercicios · {totalSeries} series</Text>
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.statCard}><Text style={s.statValue}>{fmtTiempo(tiempoEstimado)}</Text><Text style={s.statLabel}>estimado</Text></View>
          <View style={s.statCard}><Text style={s.statValue}>{ejercicios.length}</Text><Text style={s.statLabel}>ejercicios</Text></View>
          <View style={s.statCard}><Text style={s.statValue}>3s</Text><Text style={s.statLabel}>preparación</Text></View>
        </View>

        <Text style={s.sectionLabel}>Ejercicios de la sesión</Text>
        {ejercicios.map((e, i) => (
          <View key={e.uid || `${e.id}-${i}`} style={s.exerciseCard}>
            <View style={s.exerciseNumber}><Text style={s.exerciseNumberText}>{i + 1}</Text></View>
            <View style={s.exerciseInfo}>
              <Text style={s.exerciseName}>{e.nombre}</Text>
              <Text style={s.exerciseSub}>{descripcionEjercicio(e)}</Text>
            </View>
            <Text style={s.exerciseEstimate}>{fmtTiempo(estimarEjercicio(e))}</Text>
          </View>
        ))}

        <View style={s.tipBox}>
          <Text style={s.tipText}>💡 Al comenzar se abrirá la sesión activa con cronómetro real, registro visual de series, descanso y cierre simulado hacia progreso/historial.</Text>
        </View>

        <TouchableOpacity style={s.btnPrimary} onPress={comenzar}><Text style={s.btnPrimaryText}>▶ Comenzar entrenamiento</Text></TouchableOpacity>
        <TouchableOpacity style={s.btnSecondary} onPress={() => navigation.navigate('RutinaDetalle')}><Text style={s.btnSecondaryText}>Cancelar</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a22' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#2a2a35' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' },
  backText: { color: 'white', fontSize: 18, fontWeight: '700' },
  headerTitle: { color: 'white', fontSize: 17, fontWeight: '800' },
  headerSpacer: { width: 36 },
  body: { padding: 16, paddingBottom: 40 },
  badge: { alignSelf: 'flex-start', backgroundColor: 'rgba(249,115,22,0.12)', borderWidth: 1, borderColor: 'rgba(249,115,22,0.3)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 16 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#f97316' },
  heroCard: { backgroundColor: '#7c6fcd', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  heroIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  heroIconText: { fontSize: 25 },
  heroInfo: { flex: 1 },
  rutinaNombre: { color: 'white', fontSize: 18, fontWeight: '900' },
  rutinaSub: { color: 'rgba(255,255,255,0.72)', fontSize: 12, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  statCard: { flex: 1, backgroundColor: '#2a2a35', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  statValue: { color: '#5eead4', fontWeight: '900', fontSize: 17 },
  statLabel: { color: '#777', fontSize: 10, marginTop: 2, textTransform: 'uppercase' },
  sectionLabel: { color: '#777', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 10 },
  exerciseCard: { backgroundColor: '#2a2a35', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#333' },
  exerciseNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(124,111,205,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  exerciseNumberText: { color: '#7c6fcd', fontSize: 12, fontWeight: '900' },
  exerciseInfo: { flex: 1 },
  exerciseName: { color: 'white', fontSize: 14, fontWeight: '800' },
  exerciseSub: { color: '#888', fontSize: 11, marginTop: 2 },
  exerciseEstimate: { color: '#5eead4', fontSize: 11, fontWeight: '800' },
  tipBox: { backgroundColor: 'rgba(94,234,212,0.08)', borderWidth: 1, borderColor: 'rgba(94,234,212,0.22)', borderRadius: 12, padding: 12, marginTop: 8 },
  tipText: { color: '#aaa', fontSize: 12, lineHeight: 18 },
  btnPrimary: { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 14 },
  btnPrimaryText: { color: 'white', fontSize: 15, fontWeight: '800' },
  btnSecondary: { backgroundColor: '#2a2a35', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#333' },
  btnSecondaryText: { color: '#aaa', fontSize: 14, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyIcon: { fontSize: 46 },
  emptyTitle: { color: 'white', fontSize: 18, fontWeight: '900', marginTop: 12 },
  emptySub: { color: '#888', fontSize: 13, textAlign: 'center', lineHeight: 19, marginTop: 8 },
});
