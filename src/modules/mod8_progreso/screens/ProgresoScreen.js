import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

const PERIODOS = ['Semana', 'Mes', '3M', '6M', 'Año', 'Todo'];
const MEDIDAS = [
  { fecha: 'Ene', peso: 76.4, cintura: 91, brazo: 33.5 },
  { fecha: 'Feb', peso: 75.8, cintura: 90, brazo: 34.0 },
  { fecha: 'Mar', peso: 75.0, cintura: 89, brazo: 34.3 },
  { fecha: 'Abr', peso: 74.6, cintura: 88, brazo: 34.8 },
  { fecha: 'May', peso: 74.2, cintura: 87, brazo: 35.2 },
  { fecha: 'Jun', peso: 73.8, cintura: 86, brazo: 35.6 },
];

const EJERCICIOS = {
  'Press banca': [45, 50, 55, 60, 65, 72],
  Sentadilla: [70, 75, 80, 85, 90, 100],
  'Peso muerto': [80, 88, 94, 100, 108, 115],
};

const SESIONES = [
  { fecha: '02 Jun', rutina: 'Push · Pecho/Hombro', tiempo: '52 min', peso: '72 kg', series: '4x8', cambio: '+8%', nota: 'Mejor técnica en la última serie.' },
  { fecha: '30 May', rutina: 'Full Body', tiempo: '46 min', peso: '68 kg', series: '4x9', cambio: '+4%', nota: '' },
  { fecha: '26 May', rutina: 'Push Pull Legs', tiempo: '58 min', peso: '65 kg', series: '3x10', cambio: '+3%', nota: 'Descanso más largo por máquina ocupada.' },
];

function Header({ navigation }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backBtn}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Progreso</Text>
      <TouchableOpacity onPress={() => navigation.navigate('HistorialSesiones')} style={styles.iconBtn}>
        <Text style={styles.iconBtnText}>📋</Text>
      </TouchableOpacity>
    </View>
  );
}

function MiniBars({ values, accent = '#7c6fcd' }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  return (
    <View style={styles.chartBox}>
      <View style={styles.barsRow}>
        {values.map((v, i) => {
          const h = 30 + ((v - min) / Math.max(max - min, 1)) * 70;
          return <View key={`${v}-${i}`} style={[styles.bar, { height: `${h}%`, backgroundColor: i === values.length - 1 ? accent : '#3a3a49' }]} />;
        })}
      </View>
      <View style={styles.monthRow}>{MEDIDAS.map(m => <Text key={m.fecha} style={styles.monthLabel}>{m.fecha}</Text>)}</View>
    </View>
  );
}

function StatCard({ value, label, color = '#fff' }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProgresoScreen({ navigation }) {
  const [periodo, setPeriodo] = useState('3M');
  const [metrica, setMetrica] = useState('peso');
  const [ejercicio, setEjercicio] = useState('Press banca');

  const medidaActual = MEDIDAS[MEDIDAS.length - 1];
  const medidaInicial = MEDIDAS[0];
  const serieMedida = useMemo(() => MEDIDAS.map(m => m[metrica]), [metrica]);
  const mejoraPeso = (medidaActual.peso - medidaInicial.peso).toFixed(1);
  const mejoraCintura = medidaInicial.cintura - medidaActual.cintura;

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.badge}>Módulo 8 · RF50–RF57</Text>
            <Text style={styles.heroTitle}>Resumen de progreso</Text>
            <Text style={styles.heroSub}>Tendencias de medidas, entrenamientos y progreso por ejercicio con datos demo.</Text>
          </View>
          <View style={styles.heroIcon}><Text style={{ fontSize: 30 }}>📊</Text></View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard value="24" label="Entrenos" />
          <StatCard value="4.1/sem" label="Frecuencia" color="#5eead4" />
          <StatCard value={`${mejoraPeso}kg`} label="Peso" color="#7c6fcd" />
          <StatCard value={`-${mejoraCintura}cm`} label="Cintura" color="#34d399" />
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.sectionTitle}>Evolución corporal</Text>
              <Text style={styles.sectionSub}>RF51 · periodo seleccionado: {periodo}</Text>
            </View>
            <Text style={styles.deltaBadge}>{metrica === 'peso' ? '↓ 2.6 kg' : metrica === 'cintura' ? '↓ 5 cm' : '↑ 2.1 cm'}</Text>
          </View>

          <View style={styles.tabsWrap}>
            {['peso', 'cintura', 'brazo'].map(m => (
              <TouchableOpacity key={m} onPress={() => setMetrica(m)} style={[styles.tab, metrica === m && styles.tabActive]}>
                <Text style={[styles.tabText, metrica === m && styles.tabTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <MiniBars values={serieMedida} accent={metrica === 'cintura' ? '#34d399' : '#7c6fcd'} />

          <View style={styles.tabsWrap}>
            {PERIODOS.map(p => (
              <TouchableOpacity key={p} onPress={() => setPeriodo(p)} style={[styles.periodChip, periodo === p && styles.periodActive]}>
                <Text style={[styles.periodText, periodo === p && styles.periodTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.sectionTitle}>Progreso por ejercicio</Text>
              <Text style={styles.sectionSub}>RF52 · peso levantado en el tiempo</Text>
            </View>
            <Text style={styles.fireText}>🔥 +60%</Text>
          </View>
          <View style={styles.exercisePicker}>
            {Object.keys(EJERCICIOS).map(e => (
              <TouchableOpacity key={e} onPress={() => setEjercicio(e)} style={[styles.exerciseChip, ejercicio === e && styles.exerciseActive]}>
                <Text style={[styles.exerciseText, ejercicio === e && styles.exerciseTextActive]}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <MiniBars values={EJERCICIOS[ejercicio]} accent="#5eead4" />
          <View style={styles.progressFooter}>
            <Text style={styles.progressFooterTitle}>{ejercicio}</Text>
            <Text style={styles.progressFooterSub}>Actual: {EJERCICIOS[ejercicio].at(-1)} kg · Inicio: {EJERCICIOS[ejercicio][0]} kg</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.sectionTitle}>Comparativo de sesiones</Text>
              <Text style={styles.sectionSub}>RF53 · peso, series, reps y notas</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('HistorialSesiones')}><Text style={styles.link}>Ver todo</Text></TouchableOpacity>
          </View>
          {SESIONES.map((s, i) => (
            <TouchableOpacity key={i} style={styles.sessionRow} onPress={() => navigation.navigate('HistorialSesiones')}>
              <View style={styles.sessionIcon}><Text>🏋️</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionTitle}>{s.rutina}</Text>
                <Text style={styles.sessionSub}>{s.fecha} · {s.tiempo} · {s.peso} · {s.series}</Text>
                {s.nota ? <Text style={styles.note}>📝 {s.nota}</Text> : null}
              </View>
              <Text style={styles.positive}>{s.cambio}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.cardAccent}>
          <Text style={styles.sectionTitle}>Consistencia de entrenamiento</Text>
          <Text style={styles.sectionSub}>RF54 · racha y adherencia semanal</Text>
          <View style={styles.consistencyRow}>
            <View style={styles.ring}><Text style={styles.ringText}>92%</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.consistencyTitle}>🔥 Racha actual: 14 días</Text>
              <Text style={styles.consistencySub}>Objetivo: 4 días/semana · Cumplimiento: 11 de 12 semanas.</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('Exportación demo', 'Se generaría un archivo CSV/PDF con medidas, entrenamientos y notas.')}>
          <Text style={styles.primaryText}>📤 Exportar datos de progreso</Text>
        </TouchableOpacity>
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
  iconBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#2a2a35', alignItems: 'center', justifyContent: 'center' },
  iconBtnText: { fontSize: 16 },
  content: { padding: 20, paddingBottom: 42 },
  heroCard: { backgroundColor: '#2a2a35', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#393948', flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  badge: { color: '#5eead4', fontSize: 11, fontWeight: '800', marginBottom: 8 },
  heroTitle: { color: 'white', fontSize: 22, fontWeight: '900' },
  heroSub: { color: '#9a9aa8', fontSize: 12, lineHeight: 18, marginTop: 5 },
  heroIcon: { width: 58, height: 58, borderRadius: 18, backgroundColor: 'rgba(124,111,205,0.18)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(124,111,205,0.35)' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  statCard: { flexBasis: '47%', backgroundColor: '#2a2a35', borderRadius: 15, padding: 14, borderWidth: 1, borderColor: '#333' },
  statValue: { fontSize: 23, fontWeight: '900' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 3 },
  card: { backgroundColor: '#2a2a35', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#333', marginBottom: 14 },
  cardAccent: { backgroundColor: 'rgba(124,111,205,0.16)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(124,111,205,0.35)', marginBottom: 14 },
  rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 },
  sectionTitle: { color: 'white', fontSize: 15, fontWeight: '800' },
  sectionSub: { color: '#888', fontSize: 11, marginTop: 3, lineHeight: 16 },
  deltaBadge: { color: '#34d399', fontSize: 12, fontWeight: '900', backgroundColor: 'rgba(52,211,153,0.12)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  fireText: { color: '#ffa032', fontSize: 12, fontWeight: '900' },
  tabsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 12 },
  tab: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 10, backgroundColor: '#24242f', borderWidth: 1, borderColor: '#333' },
  tabActive: { backgroundColor: 'rgba(124,111,205,0.22)', borderColor: '#7c6fcd' },
  tabText: { color: '#999', fontSize: 11, fontWeight: '800', textTransform: 'capitalize' },
  tabTextActive: { color: '#fff' },
  periodChip: { flex: 1, minWidth: 42, alignItems: 'center', paddingVertical: 6, borderRadius: 9, backgroundColor: '#24242f' },
  periodActive: { backgroundColor: '#7c6fcd' },
  periodText: { color: '#888', fontSize: 10, fontWeight: '800' },
  periodTextActive: { color: 'white' },
  chartBox: { height: 170, backgroundColor: '#20202a', borderRadius: 14, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#30303d' },
  barsRow: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 9 },
  bar: { flex: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, minHeight: 20 },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  monthLabel: { color: '#777', fontSize: 10, flex: 1, textAlign: 'center' },
  exercisePicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 12 },
  exerciseChip: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 9, backgroundColor: '#24242f', borderWidth: 1, borderColor: '#333' },
  exerciseActive: { backgroundColor: 'rgba(94,234,212,0.16)', borderColor: '#5eead4' },
  exerciseText: { color: '#999', fontSize: 11, fontWeight: '800' },
  exerciseTextActive: { color: '#5eead4' },
  progressFooter: { backgroundColor: 'rgba(94,234,212,0.08)', borderRadius: 12, padding: 10 },
  progressFooterTitle: { color: 'white', fontSize: 13, fontWeight: '800' },
  progressFooterSub: { color: '#8a8a98', fontSize: 11, marginTop: 2 },
  link: { color: '#7c6fcd', fontSize: 12, fontWeight: '900' },
  sessionRow: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#333' },
  sessionIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#24242f', alignItems: 'center', justifyContent: 'center' },
  sessionTitle: { color: 'white', fontSize: 13, fontWeight: '800' },
  sessionSub: { color: '#888', fontSize: 11, marginTop: 2 },
  note: { color: '#c7c7d6', fontSize: 11, marginTop: 5, fontStyle: 'italic' },
  positive: { color: '#34d399', fontSize: 12, fontWeight: '900', alignSelf: 'center' },
  consistencyRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14 },
  ring: { width: 68, height: 68, borderRadius: 34, borderWidth: 8, borderColor: '#7c6fcd', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)' },
  ringText: { color: 'white', fontSize: 15, fontWeight: '900' },
  consistencyTitle: { color: 'white', fontSize: 14, fontWeight: '800' },
  consistencySub: { color: '#a6a6b5', fontSize: 12, lineHeight: 18, marginTop: 3 },
  primaryBtn: { backgroundColor: '#7c6fcd', borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 2 },
  primaryText: { color: 'white', fontSize: 14, fontWeight: '900' },
});