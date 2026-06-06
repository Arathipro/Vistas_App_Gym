import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const COLORS = {
  bg: '#1a1a22',
  surface: '#24242e',
  surface2: '#2a2a35',
  surface3: '#343440',
  border: '#3a3a46',
  text: '#f5f5f7',
  text2: '#c7c7d1',
  muted: '#8b8b98',
  accent: '#7c6fcd',
  accent2: '#5eead4',
  accent3: '#ffa032',
  success: '#34d399',
  danger: '#f87171',
};

const SESIONES_DEMO = [
  {
    id: 1,
    fecha: 'Mar 24, 2026',
    hora: '18:20',
    duracion: '52m',
    volumen: '3,480 kg',
    tieneNota: true,
    nota: 'Me sentí fuerte, pero al final bajó la velocidad de la barra.',
    ejercicios: [
      {
        icon: '🏋️',
        nombre: 'Press de banca',
        tieneNota: true,
        nota: 'Subida controlada, cuidar codos.',
        series: [
          { s: 1, kg: 70, r: 8, t: '42s', nota: '' },
          { s: 2, kg: 75, r: 7, t: '45s', nota: 'Pesado.' },
          { s: 3, kg: 72, r: 8, t: '44s', nota: '' },
        ],
      },
      {
        icon: '🎯',
        nombre: 'Press militar',
        tieneNota: false,
        nota: '',
        series: [
          { s: 1, kg: 35, r: 10, t: '35s', nota: '' },
          { s: 2, kg: 35, r: 9, t: '36s', nota: '' },
        ],
      },
    ],
  },
  {
    id: 2,
    fecha: 'Mar 18, 2026',
    hora: '17:40',
    duracion: '58m',
    volumen: '4,120 kg',
    tieneNota: true,
    nota: 'Sesión de pierna sólida, más descanso en sentadilla.',
    ejercicios: [
      {
        icon: '🦵',
        nombre: 'Sentadilla',
        tieneNota: true,
        nota: 'Buena profundidad.',
        series: [
          { s: 1, kg: 90, r: 8, t: '48s', nota: '' },
          { s: 2, kg: 95, r: 7, t: '52s', nota: 'Costó la última.' },
          { s: 3, kg: 100, r: 6, t: '54s', nota: '' },
        ],
      },
      {
        icon: '💪',
        nombre: 'Peso muerto',
        tieneNota: false,
        nota: '',
        series: [
          { s: 1, kg: 108, r: 5, t: '42s', nota: '' },
          { s: 2, kg: 112, r: 4, t: '44s', nota: '' },
        ],
      },
    ],
  },
  {
    id: 3,
    fecha: 'Mar 10, 2026',
    hora: '19:05',
    duracion: '49m',
    volumen: '3,020 kg',
    tieneNota: false,
    nota: '',
    ejercicios: [
      {
        icon: '🏋️',
        nombre: 'Press de banca',
        tieneNota: false,
        nota: '',
        series: [
          { s: 1, kg: 65, r: 9, t: '40s', nota: '' },
          { s: 2, kg: 70, r: 8, t: '43s', nota: '' },
        ],
      },
      {
        icon: '🔝',
        nombre: 'Jalón al pecho',
        tieneNota: false,
        nota: '',
        series: [
          { s: 1, kg: 55, r: 12, t: '36s', nota: '' },
          { s: 2, kg: 60, r: 10, t: '38s', nota: '' },
        ],
      },
    ],
  },
  {
    id: 4,
    fecha: 'Feb 28, 2026',
    hora: '18:10',
    duracion: '45m',
    volumen: '2,880 kg',
    tieneNota: true,
    nota: 'Entreno corto por falta de tiempo.',
    ejercicios: [
      {
        icon: '🎯',
        nombre: 'Press militar',
        tieneNota: true,
        nota: 'Hombro algo cansado.',
        series: [
          { s: 1, kg: 30, r: 11, t: '34s', nota: '' },
          { s: 2, kg: 32, r: 10, t: '36s', nota: 'Subió lento.' },
        ],
      },
    ],
  },
];

function AppStatusBar() {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusTime}>9:41</Text>
      <View style={styles.statusIcons}>
        <Text style={styles.statusText}>▲</Text>
        <Text style={styles.statusText}>WiFi</Text>
        <Text style={styles.statusText}>🔋</Text>
      </View>
    </View>
  );
}

function Badge({ children }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  );
}

function Header({ navigation }) {
  return (
    <>
      <AppStatusBar />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Progreso')}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Historial de sesiones</Text>
        <View style={{ width: 34 }} />
      </View>
    </>
  );
}

function StatBox({ label, value, color }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SeriesTable({ series }) {
  return (
    <View style={styles.seriesBox}>
      <View style={styles.seriesHeader}>
        <Text style={[styles.seriesHeadText, { width: 24 }]}>#</Text>
        <Text style={[styles.seriesHeadText, { width: 48 }]}>PESO</Text>
        <Text style={[styles.seriesHeadText, { width: 48 }]}>REPS</Text>
        <Text style={[styles.seriesHeadText, { width: 45 }]}>TIEMPO</Text>
        <Text style={[styles.seriesHeadText, { flex: 1 }]}>NOTA</Text>
      </View>
      {series.map((sr, si) => (
        <View key={`${sr.s}-${si}`} style={[styles.seriesRow, si < series.length - 1 && styles.seriesRowBorder]}>
          <Text style={[styles.seriesCellMuted, { width: 24 }]}>{sr.s}</Text>
          <Text style={[styles.seriesCellStrong, { width: 48 }]}>{sr.kg}kg</Text>
          <Text style={[styles.seriesCell, { width: 48 }]}>×{sr.r}</Text>
          <Text style={[styles.seriesCellMuted, { width: 45 }]}>{sr.t}</Text>
          <Text style={[styles.seriesNote, { flex: 1 }]}>{sr.nota ? `“${sr.nota}”` : '—'}</Text>
        </View>
      ))}
    </View>
  );
}

function FilaSesion({ s }) {
  const [expandida, setExpandida] = useState(false);
  const [ejExpandido, setEjExpandido] = useState(null);
  const mes = s.fecha.split(' ')[0];
  const dia = s.fecha.split(' ')[1].replace(',', '');

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setExpandida(v => !v)} style={styles.sessionMain} activeOpacity={0.78}>
        <View style={styles.dateBox}>
          <Text style={styles.dateMonth}>{mes}</Text>
          <Text style={styles.dateDay}>{dia}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.sessionTitleRow}>
            <Text style={styles.sessionTitle}>{s.hora} · {s.duracion}</Text>
            <View style={styles.noteArrowGroup}>
              {s.tieneNota ? <Text style={styles.noteBadge}>📝</Text> : null}
              <Text style={styles.arrow}>{expandida ? '▲' : '▼'}</Text>
            </View>
          </View>
          <Text style={styles.sessionSub}>{s.ejercicios.length} ejercicios · {s.volumen}</Text>
        </View>
      </TouchableOpacity>

      {expandida ? (
        <View style={styles.accordion}>
          {s.tieneNota ? (
            <View style={styles.sessionNoteBox}>
              <Text style={styles.sessionNote}>📝 “{s.nota}”</Text>
            </View>
          ) : null}

          {s.ejercicios.map((ej, ei) => {
            const open = ejExpandido === ei;
            return (
              <View key={`${ej.nombre}-${ei}`} style={styles.exerciseAccordion}>
                <TouchableOpacity onPress={() => setEjExpandido(open ? null : ei)} style={styles.exerciseRow} activeOpacity={0.78}>
                  <Text style={styles.exerciseIcon}>{ej.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>{ej.nombre}</Text>
                    <Text style={styles.exerciseSub}>{ej.series.length} series</Text>
                  </View>
                  {ej.tieneNota ? <Text style={styles.exerciseNoteBadge}>📝</Text> : null}
                  <Text style={styles.arrowSmall}>{open ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {open ? (
                  <View style={styles.exerciseDetail}>
                    {ej.tieneNota ? (
                      <View style={styles.exerciseNoteBox}>
                        <Text style={styles.exerciseNoteText}>📝 “{ej.nota}”</Text>
                      </View>
                    ) : null}
                    <SeriesTable series={ej.series} />
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

export default function HistorialSesionesScreen({ navigation }) {
  const [busqueda, setBusqueda] = useState('');

  const sesiones = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return SESIONES_DEMO;
    return SESIONES_DEMO.filter(s =>
      s.fecha.toLowerCase().includes(q) ||
      s.hora.toLowerCase().includes(q) ||
      s.nota.toLowerCase().includes(q) ||
      s.ejercicios.some(e => e.nombre.toLowerCase().includes(q) || e.nota.toLowerCase().includes(q))
    );
  }, [busqueda]);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Badge>RF54 · RF56</Badge>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Buscar por fecha o nota..."
            placeholderTextColor={COLORS.muted}
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatBox label="Total" value="24" color={COLORS.accent} />
          <StatBox label="Este mes" value="9" color={COLORS.success} />
          <StatBox label="Prom./sem" value="3.1" color={COLORS.accent2} />
        </View>

        {sesiones.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Sin resultados para “{busqueda}”</Text>
          </View>
        ) : sesiones.map(s => <FilaSesion key={s.id} s={s} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  statusBar: { paddingTop: 12, paddingHorizontal: 18, height: 42, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusTime: { color: COLORS.text, fontWeight: '800', fontSize: 12 },
  statusIcons: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  statusText: { color: COLORS.text2, fontSize: 10 },
  header: { height: 56, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  backText: { color: COLORS.text2, fontSize: 24, fontWeight: '500' },
  screenTitle: { color: COLORS.text, fontWeight: '900', fontSize: 17 },
  body: { paddingHorizontal: 18, paddingBottom: 36, gap: 12 },
  badge: { alignSelf: 'flex-start', borderWidth: 1, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20, borderColor: 'rgba(255,160,50,0.35)', backgroundColor: 'rgba(255,160,50,0.10)' },
  badgeText: { fontSize: 10, fontWeight: '900', color: COLORS.accent3 },
  inputGroup: { marginBottom: 0 },
  input: { backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border, color: COLORS.text, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 13, fontSize: 13 },
  statsGrid: { flexDirection: 'row', gap: 8 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6, backgroundColor: COLORS.surface2, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 10, color: COLORS.muted, marginTop: 2 },
  card: { backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 12, paddingHorizontal: 14 },
  sessionMain: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  dateBox: { width: 40, borderRadius: 8, backgroundColor: COLORS.surface2, alignItems: 'center', paddingVertical: 6, flexShrink: 0 },
  dateMonth: { color: COLORS.muted, fontSize: 9, textTransform: 'uppercase' },
  dateDay: { color: COLORS.accent, fontSize: 16, fontWeight: '900', lineHeight: 18 },
  sessionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  sessionTitle: { color: COLORS.text, fontSize: 13, fontWeight: '900' },
  sessionSub: { color: COLORS.muted, fontSize: 11, marginTop: 2 },
  noteArrowGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  noteBadge: { fontSize: 11, color: COLORS.accent, backgroundColor: 'rgba(124,111,205,0.15)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, overflow: 'hidden', fontWeight: '800' },
  arrow: { color: COLORS.muted, fontSize: 12, fontWeight: '800' },
  accordion: { marginTop: 12 },
  sessionNoteBox: { borderLeftWidth: 2, borderLeftColor: COLORS.accent, paddingLeft: 8, marginBottom: 12 },
  sessionNote: { color: COLORS.muted, fontSize: 11, fontStyle: 'italic', lineHeight: 16 },
  exerciseAccordion: { marginBottom: 8, borderRadius: 8, backgroundColor: COLORS.surface2, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, paddingHorizontal: 12 },
  exerciseIcon: { fontSize: 16, width: 22, textAlign: 'center' },
  exerciseName: { color: COLORS.text, fontSize: 12, fontWeight: '900' },
  exerciseSub: { color: COLORS.muted, fontSize: 10, marginTop: 1 },
  exerciseNoteBadge: { fontSize: 10, color: COLORS.accent, backgroundColor: 'rgba(124,111,205,0.15)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, overflow: 'hidden' },
  arrowSmall: { color: COLORS.muted, fontSize: 11, fontWeight: '800' },
  exerciseDetail: { paddingHorizontal: 12, paddingBottom: 10 },
  exerciseNoteBox: { borderLeftWidth: 2, borderLeftColor: COLORS.accent, paddingLeft: 8, marginBottom: 8 },
  exerciseNoteText: { color: COLORS.muted, fontSize: 11, fontStyle: 'italic', lineHeight: 16 },
  seriesBox: { gap: 0 },
  seriesHeader: { flexDirection: 'row', gap: 6, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  seriesHeadText: { color: COLORS.muted, fontSize: 10, fontWeight: '900' },
  seriesRow: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingVertical: 5 },
  seriesRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  seriesCellMuted: { color: COLORS.muted, fontSize: 11 },
  seriesCellStrong: { color: COLORS.text, fontSize: 11, fontWeight: '900' },
  seriesCell: { color: COLORS.text2, fontSize: 11 },
  seriesNote: { color: COLORS.muted, fontSize: 10, fontStyle: 'italic' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 42 },
  emptyText: { color: COLORS.muted, fontSize: 13, textAlign: 'center' },
});