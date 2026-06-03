import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const SESIONES = [
  {
    id: 1,
    fecha: '02 Jun 2026',
    rutina: 'Push · Pecho/Hombro',
    duracion: '52 min',
    estado: 'Completada',
    nota: 'Buen entrenamiento, mejor control en press banca.',
    ejercicios: [
      { nombre: 'Press banca', estado: 'Completado', series: ['72kg x 8', '72kg x 8', '70kg x 9', '68kg x 10'], nota: 'Última serie más estable.' },
      { nombre: 'Press militar', estado: 'Completado', series: ['35kg x 10', '35kg x 9', '32kg x 11'], nota: '' },
      { nombre: 'Elevación lateral', estado: 'Parcial', series: ['10kg x 12', '10kg x 12'], nota: 'Se cerró por tiempo.' },
    ],
  },
  {
    id: 2,
    fecha: '30 May 2026',
    rutina: 'Full Body',
    duracion: '46 min',
    estado: 'Completada',
    nota: '',
    ejercicios: [
      { nombre: 'Sentadilla', estado: 'Completado', series: ['95kg x 8', '95kg x 8', '90kg x 10'], nota: '' },
      { nombre: 'Jalón al pecho', estado: 'Completado', series: ['55kg x 12', '55kg x 11', '50kg x 12'], nota: '' },
    ],
  },
  {
    id: 3,
    fecha: '26 May 2026',
    rutina: 'Pull · Espalda/Bíceps',
    duracion: '58 min',
    estado: 'Con sustitución',
    nota: 'Máquina ocupada, se cambió remo por jalón.',
    ejercicios: [
      { nombre: 'Peso muerto', estado: 'Completado', series: ['110kg x 5', '110kg x 5', '105kg x 6'], nota: 'Carga pesada pero controlada.' },
      { nombre: 'Remo sentado', estado: 'Sustituido', series: [], nota: 'Máquina ocupada.' },
      { nombre: 'Jalón al pecho', estado: 'Completado', series: ['60kg x 10', '60kg x 9', '55kg x 12'], nota: '' },
    ],
  },
];

function Header({ navigation }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Progreso')} style={styles.backBtn}><Text style={styles.backText}>←</Text></TouchableOpacity>
      <Text style={styles.headerTitle}>Historial Sesiones</Text>
      <View style={{ width: 34 }} />
    </View>
  );
}

export default function HistorialSesionesScreen({ navigation }) {
  const [expandida, setExpandida] = useState(1);
  const [filtro, setFiltro] = useState('Todas');
  const sesionesFiltradas = filtro === 'Todas' ? SESIONES : SESIONES.filter(s => s.estado.includes(filtro));

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>RF26 · RF53 · RF56</Text>
          <Text style={styles.heroTitle}>Historial de entrenamientos</Text>
          <Text style={styles.heroSub}>Consulta sesiones pasadas, ejercicios, series registradas y notas cualitativas.</Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}><Text style={styles.summaryValue}>3</Text><Text style={styles.summaryLabel}>Sesiones</Text></View>
          <View style={styles.summaryCard}><Text style={[styles.summaryValue, { color: '#5eead4' }]}>156m</Text><Text style={styles.summaryLabel}>Tiempo total</Text></View>
          <View style={styles.summaryCard}><Text style={[styles.summaryValue, { color: '#34d399' }]}>2</Text><Text style={styles.summaryLabel}>Con notas</Text></View>
        </View>

        <View style={styles.chipsRow}>
          {['Todas', 'Completada', 'Sustitución'].map(f => (
            <TouchableOpacity key={f} onPress={() => setFiltro(f)} style={[styles.chip, filtro === f && styles.chipActive]}>
              <Text style={[styles.chipText, filtro === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {sesionesFiltradas.map(s => {
          const open = expandida === s.id;
          const tieneNotas = !!s.nota || s.ejercicios.some(e => e.nota);
          return (
            <View key={s.id} style={styles.sessionCard}>
              <TouchableOpacity style={styles.sessionHeader} onPress={() => setExpandida(open ? null : s.id)} activeOpacity={0.75}>
                <View style={styles.sessionIcon}><Text style={{ fontSize: 20 }}>🏋️</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionTitle}>{s.rutina}</Text>
                  <Text style={styles.sessionSub}>{s.fecha} · {s.duracion} · {s.estado}</Text>
                  {tieneNotas ? <Text style={styles.noteBadge}>📝 Contiene notas</Text> : null}
                </View>
                <Text style={styles.arrow}>{open ? '⌃' : '⌄'}</Text>
              </TouchableOpacity>

              {open && (
                <View style={styles.detailBox}>
                  {s.nota ? (
                    <View style={styles.noteBox}>
                      <Text style={styles.noteLabel}>Nota de sesión</Text>
                      <Text style={styles.noteText}>{s.nota}</Text>
                    </View>
                  ) : null}

                  {s.ejercicios.map((e, i) => (
                    <View key={`${e.nombre}-${i}`} style={styles.exerciseBox}>
                      <View style={styles.exerciseHeader}>
                        <Text style={styles.exerciseTitle}>{e.nombre}</Text>
                        <Text style={[styles.status, e.estado !== 'Completado' && styles.statusWarn]}>{e.estado}</Text>
                      </View>
                      {e.series.length > 0 ? (
                        <View style={styles.seriesWrap}>
                          {e.series.map((serie, si) => (
                            <View key={si} style={styles.serieChip}><Text style={styles.serieText}>S{si + 1}: {serie}</Text></View>
                          ))}
                        </View>
                      ) : <Text style={styles.emptySeries}>Sin series registradas.</Text>}
                      {e.nota ? <Text style={styles.exerciseNote}>📝 {e.nota}</Text> : null}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13132a' },
  header: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a35', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' },
  backText: { color: 'white', fontSize: 22, fontWeight: '700' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '800' },
  content: { padding: 20, paddingBottom: 42 },
  heroCard: { backgroundColor: '#2a2a35', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#393948', marginBottom: 14 },
  badge: { color: '#5eead4', fontSize: 11, fontWeight: '800', marginBottom: 8 },
  heroTitle: { color: 'white', fontSize: 21, fontWeight: '900' },
  heroSub: { color: '#9a9aa8', fontSize: 12, lineHeight: 18, marginTop: 5 },
  summaryGrid: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  summaryCard: { flex: 1, backgroundColor: '#2a2a35', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#333' },
  summaryValue: { color: 'white', fontSize: 21, fontWeight: '900' },
  summaryLabel: { color: '#888', fontSize: 10, marginTop: 2 },
  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 10, backgroundColor: '#24242f', borderWidth: 1, borderColor: '#333' },
  chipActive: { backgroundColor: 'rgba(124,111,205,0.22)', borderColor: '#7c6fcd' },
  chipText: { color: '#888', fontSize: 11, fontWeight: '800' },
  chipTextActive: { color: 'white' },
  sessionCard: { backgroundColor: '#2a2a35', borderRadius: 16, borderWidth: 1, borderColor: '#333', marginBottom: 12, overflow: 'hidden' },
  sessionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  sessionIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#24242f', alignItems: 'center', justifyContent: 'center' },
  sessionTitle: { color: 'white', fontSize: 14, fontWeight: '900' },
  sessionSub: { color: '#888', fontSize: 11, marginTop: 2 },
  noteBadge: { color: '#5eead4', fontSize: 11, fontWeight: '800', marginTop: 5 },
  arrow: { color: '#777', fontSize: 18, fontWeight: '900' },
  detailBox: { padding: 14, paddingTop: 0, gap: 10 },
  noteBox: { backgroundColor: 'rgba(94,234,212,0.08)', borderRadius: 12, padding: 11, borderWidth: 1, borderColor: 'rgba(94,234,212,0.22)' },
  noteLabel: { color: '#5eead4', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  noteText: { color: '#d8d8e6', fontSize: 12, lineHeight: 18, marginTop: 4, fontStyle: 'italic' },
  exerciseBox: { backgroundColor: '#20202a', borderRadius: 12, padding: 11, borderWidth: 1, borderColor: '#30303d' },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 8 },
  exerciseTitle: { color: 'white', fontSize: 13, fontWeight: '800', flex: 1 },
  status: { color: '#34d399', fontSize: 10, fontWeight: '900' },
  statusWarn: { color: '#ffa032' },
  seriesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  serieChip: { backgroundColor: '#2a2a35', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, borderWidth: 1, borderColor: '#383846' },
  serieText: { color: '#cfcfe0', fontSize: 11, fontWeight: '700' },
  emptySeries: { color: '#888', fontSize: 11 },
  exerciseNote: { color: '#c7c7d6', fontSize: 11, marginTop: 8, fontStyle: 'italic' },
});