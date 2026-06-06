import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
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

const PERIODOS = [
  { id: '1s', label: '1s' },
  { id: '1m', label: '1m' },
  { id: '3m', label: '3m' },
  { id: '6m', label: '6m' },
  { id: '1a', label: '1a' },
  { id: 'todo', label: 'Todo' },
];

const PROGRESO_EJS_DEMO = {
  'Press de banca': [
    { fecha: '12 Ene', kg: 50, series: 3, reps: 8, tiempo: '35s', nota: 'Técnica estable.' },
    { fecha: '25 Ene', kg: 55, series: 4, reps: 8, tiempo: '38s', nota: '' },
    { fecha: '10 Feb', kg: 60, series: 4, reps: 9, tiempo: '40s', nota: 'Mejor control.' },
    { fecha: '24 Feb', kg: 65, series: 4, reps: 8, tiempo: '42s', nota: '' },
    { fecha: '10 Mar', kg: 70, series: 4, reps: 8, tiempo: '43s', nota: 'Subida limpia.' },
    { fecha: '24 Mar', kg: 75, series: 4, reps: 7, tiempo: '45s', nota: 'Pesado pero controlado.' },
  ],
  Sentadilla: [
    { fecha: '12 Ene', kg: 70, series: 4, reps: 10, tiempo: '44s', nota: '' },
    { fecha: '25 Ene', kg: 75, series: 4, reps: 10, tiempo: '46s', nota: '' },
    { fecha: '10 Feb', kg: 82, series: 4, reps: 8, tiempo: '47s', nota: 'Profundidad mejor.' },
    { fecha: '24 Feb', kg: 90, series: 4, reps: 8, tiempo: '50s', nota: '' },
    { fecha: '10 Mar', kg: 95, series: 4, reps: 7, tiempo: '52s', nota: '' },
    { fecha: '24 Mar', kg: 100, series: 4, reps: 6, tiempo: '54s', nota: 'Buena estabilidad.' },
  ],
  'Peso muerto': [
    { fecha: '12 Ene', kg: 85, series: 3, reps: 5, tiempo: '37s', nota: '' },
    { fecha: '25 Ene', kg: 92, series: 3, reps: 5, tiempo: '39s', nota: '' },
    { fecha: '10 Feb', kg: 100, series: 3, reps: 5, tiempo: '41s', nota: 'Agarre mejor.' },
    { fecha: '24 Feb', kg: 108, series: 3, reps: 4, tiempo: '42s', nota: '' },
    { fecha: '10 Mar', kg: 112, series: 3, reps: 4, tiempo: '44s', nota: '' },
    { fecha: '24 Mar', kg: 115, series: 3, reps: 3, tiempo: '46s', nota: 'RPE alto.' },
  ],
};

const UNIDAD_EJS_DEMO = {
  'Press de banca': 'kg',
  Sentadilla: 'kg',
  'Peso muerto': 'kg',
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
        icon: '🏋️', nombre: 'Press de banca', tieneNota: true, nota: 'Subida controlada, cuidar codos.',
        series: [
          { s: 1, kg: 70, r: 8, t: '42s', nota: '' },
          { s: 2, kg: 75, r: 7, t: '45s', nota: 'Pesado.' },
          { s: 3, kg: 72, r: 8, t: '44s', nota: '' },
        ],
      },
      {
        icon: '🎯', nombre: 'Press militar', tieneNota: false, nota: '',
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
        icon: '🦵', nombre: 'Sentadilla', tieneNota: true, nota: 'Buena profundidad.',
        series: [
          { s: 1, kg: 90, r: 8, t: '48s', nota: '' },
          { s: 2, kg: 95, r: 7, t: '52s', nota: 'Costó la última.' },
          { s: 3, kg: 100, r: 6, t: '54s', nota: '' },
        ],
      },
      {
        icon: '💪', nombre: 'Peso muerto', tieneNota: false, nota: '',
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
        icon: '🏋️', nombre: 'Press de banca', tieneNota: false, nota: '',
        series: [
          { s: 1, kg: 65, r: 9, t: '40s', nota: '' },
          { s: 2, kg: 70, r: 8, t: '43s', nota: '' },
        ],
      },
      {
        icon: '🔝', nombre: 'Jalón al pecho', tieneNota: false, nota: '',
        series: [
          { s: 1, kg: 55, r: 12, t: '36s', nota: '' },
          { s: 2, kg: 60, r: 10, t: '38s', nota: '' },
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

function Badge({ children, variant = 'orange' }) {
  const color = variant === 'teal' ? COLORS.accent2 : variant === 'purple' ? COLORS.accent : COLORS.accent3;
  return (
    <View style={[styles.badge, { borderColor: `${color}55`, backgroundColor: `${color}18` }]}>
      <Text style={[styles.badgeText, { color }]}>{children}</Text>
    </View>
  );
}

function Header({ navigation }) {
  return (
    <>
      <AppStatusBar />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Progreso</Text>
        <View style={{ width: 34 }} />
      </View>
    </>
  );
}

function TabSelector({ active, onChange }) {
  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'ejercicio', label: 'Por ejercicio' },
    { id: 'consistencia', label: 'Consistencia' },
  ];
  return (
    <View style={styles.tabsShell}>
      {tabs.map(t => (
        <TouchableOpacity key={t.id} onPress={() => onChange(t.id)} style={[styles.tabBtn, active === t.id && styles.tabActive]}>
          <Text style={[styles.tabText, active === t.id && styles.tabTextActive]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function PeriodSelector({ value, onChange }) {
  return (
    <View style={styles.tagsRow}>
      {PERIODOS.map(p => (
        <TouchableOpacity key={p.id} onPress={() => onChange(p.id)} style={[styles.tag, value === p.id && styles.tagActive]}>
          <Text style={[styles.tagText, value === p.id && styles.tagTextActive]}>{p.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function BarChart({ values, highlightLast = true, height = 110, color = COLORS.accent }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, max);
  return (
    <View style={[styles.chartPlaceholder, { height }]}> 
      <View style={styles.chartBars}>
        {values.map((v, i) => {
          const pct = max === min ? 60 : 25 + ((v - min) / (max - min)) * 70;
          const active = highlightLast && i === values.length - 1;
          return (
            <View
              key={`${v}-${i}`}
              style={[
                styles.chartBar,
                { height: `${pct}%`, backgroundColor: active ? color : COLORS.surface3 },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

function KpiCard({ icon, value, label, color }) {
  return (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiIcon}>{icon}</Text>
      <View>
        <Text style={[styles.kpiValue, { color }]}>{value}</Text>
        <Text style={styles.kpiLabel}>{label}</Text>
      </View>
    </View>
  );
}

function BodyRadarCard({ periodo, setPeriodo }) {
  const medidas = [
    { label: 'Cintura', base: 85, actual: periodo === '1m' ? 83 : periodo === '6m' ? 78 : 81, betterDown: true },
    { label: 'Brazos', base: 35, actual: periodo === '1m' ? 36 : periodo === '6m' ? 38 : 37 },
    { label: 'Pecho', base: 95, actual: periodo === '1m' ? 94.5 : periodo === '6m' ? 93 : 94, betterDown: true },
    { label: 'Cadera', base: 98, actual: periodo === '1m' ? 96 : periodo === '6m' ? 93 : 95, betterDown: true },
    { label: 'Muslos', base: 58, actual: periodo === '1m' ? 57 : periodo === '6m' ? 55 : 56, betterDown: true },
    { label: 'Piernas', base: 42, actual: periodo === '1m' ? 43 : periodo === '6m' ? 45 : 44 },
  ];
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Medidas corporales</Text>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: `${COLORS.accent}66` }]} /><Text style={styles.legendText}>Base</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: COLORS.accent }]} /><Text style={styles.legendText}>Actual</Text></View>
      </View>
      <View style={styles.radarBox}>
        {medidas.map((m, i) => {
          const min = m.betterDown ? 60 : 25;
          const max = m.betterDown ? 100 : 50;
          const basePct = Math.max(18, Math.min(100, ((m.base - min) / (max - min)) * 100));
          const actPct = Math.max(18, Math.min(100, ((m.actual - min) / (max - min)) * 100));
          const diff = m.actual - m.base;
          const good = m.betterDown ? diff < 0 : diff > 0;
          return (
            <View key={m.label} style={styles.measureRow}>
              <View style={{ width: 64 }}>
                <Text style={styles.measureLabel}>{m.label}</Text>
                <Text style={[styles.measureDiff, { color: diff === 0 ? COLORS.muted : good ? COLORS.success : COLORS.danger }]}>
                  {diff > 0 ? '+' : ''}{diff.toFixed(diff % 1 ? 1 : 0)} cm
                </Text>
              </View>
              <View style={styles.measureTrack}>
                <View style={[styles.measureBase, { width: `${basePct}%` }]} />
                <View style={[styles.measureCurrent, { width: `${actPct}%` }]} />
              </View>
              <Text style={styles.measureValue}>{m.actual}</Text>
            </View>
          );
        })}
      </View>
      <PeriodSelector value={periodo} onChange={setPeriodo} />
    </View>
  );
}

function FilaComparativa({ d, numero, diff, unidad }) {
  return (
    <View style={styles.compareRow}>
      <View style={styles.setNum}><Text style={styles.setNumText}>{numero}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.compareDate}>{d.fecha}</Text>
        <Text style={styles.compareSub}>{d.series} series · {d.reps} reps · prom. {d.tiempo}</Text>
        {d.nota ? <Text style={styles.noteText}>📝 “{d.nota}”</Text> : null}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.compareKg}>{d.kg}{unidad}</Text>
        {diff !== 0 ? <Text style={[styles.compareDiff, { color: diff > 0 ? COLORS.success : COLORS.danger }]}>{diff > 0 ? '+' : ''}{diff}{unidad}</Text> : null}
      </View>
    </View>
  );
}

function ComparadorFechas({ sesiones }) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const sesA = sesiones[a];
  const sesB = sesiones[b];
  const comunes = sesA.ejercicios.filter(ea => sesB.ejercicios.find(eb => eb.nombre === ea.nombre));
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Comparar fechas</Text>
      <Text style={styles.cardSub}>RF55 · selecciona dos sesiones</Text>
      <View style={styles.selectGrid}>
        {[0, 1].map(side => (
          <View key={side} style={{ flex: 1 }}>
            <Text style={styles.tinyLabel}>{side === 0 ? 'Fecha A' : 'Fecha B'}</Text>
            {sesiones.map((s, i) => (
              <TouchableOpacity key={s.id} onPress={() => side === 0 ? setA(i) : setB(i)} style={[styles.dateChip, (side === 0 ? a : b) === i && styles.dateChipActive]}>
                <Text style={[styles.dateChipText, (side === 0 ? a : b) === i && styles.dateChipTextActive]}>{s.fecha.split(',')[0]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.divider} />
      {comunes.length === 0 ? (
        <Text style={styles.emptyText}>Sin ejercicios en común entre estas sesiones</Text>
      ) : comunes.map((ea, i) => {
        const eb = sesB.ejercicios.find(e => e.nombre === ea.nombre);
        const kgA = ea.series[0].kg;
        const kgB = eb.series[0].kg;
        const diff = kgB - kgA;
        return (
          <View key={ea.nombre} style={styles.commonRow}>
            <Text style={styles.commonName}>{ea.icon} {ea.nombre}</Text>
            <Text style={styles.commonValue}>{ea.series.length}s × {kgA}kg</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.commonValue, { color: COLORS.accent2 }]}>{eb.series.length}s × {kgB}kg</Text>
              {diff !== 0 ? <Text style={[styles.compareDiff, { color: diff > 0 ? COLORS.success : COLORS.danger }]}>{diff > 0 ? '+' : ''}{diff} kg</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function ResumenTab({ periodoRes, setPeriodoRes, navigation, onExport }) {
  const semanas = [3, 2, 3, 3, 1, 3, 3, 2, 3];
  const objetivo = 3;
  const rachaActual = 14;
  const adherencia = Math.round((semanas.reduce((s, w) => s + w, 0) / (semanas.length * objetivo)) * 100);

  return (
    <>
      <View style={styles.kpiGrid}>
        <KpiCard icon="🔥" value={`${rachaActual} días`} label="Racha actual" color={COLORS.accent3} />
        <KpiCard icon="📊" value={`${adherencia}%`} label="Adherencia" color={COLORS.accent} />
        <KpiCard icon="🏋️" value="24" label="Sesiones totales" color={COLORS.success} />
        <KpiCard icon="⬆️" value="18,420 kg" label="Volumen total" color={COLORS.accent2} />
      </View>

      <BodyRadarCard periodo={periodoRes} setPeriodo={setPeriodoRes} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Entrenamientos recientes</Text>
        {SESIONES_DEMO.slice(0, 4).map(s => (
          <TouchableOpacity key={s.id} style={styles.recentRow} onPress={() => navigation.navigate('HistorialSesiones')}>
            <View style={styles.dateBox}>
              <Text style={styles.dateMonth}>{s.fecha.split(' ')[0]}</Text>
              <Text style={styles.dateDay}>{s.fecha.split(' ')[1].replace(',', '')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recentTitle}>{s.hora} · {s.duracion}</Text>
              <Text style={styles.recentSub}>{s.ejercicios.length} ejercicios · {s.volumen}</Text>
            </View>
            {s.tieneNota ? <Text style={styles.noteBadge}>📝</Text> : null}
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('HistorialSesiones')}>
          <Text style={styles.outlineText}>Ver historial completo →</Text>
        </TouchableOpacity>
      </View>

      <ComparadorFechas sesiones={SESIONES_DEMO} />

      <TouchableOpacity style={styles.primaryBtn} onPress={onExport}>
        <Text style={styles.primaryText}>📤 Exportar datos de progreso</Text>
      </TouchableOpacity>
    </>
  );
}

function EjercicioTab({ ejSelec, setEjSelec, grupoFiltro, setGrupoFiltro, periodoEj, setPeriodoEj }) {
  const nombres = Object.keys(PROGRESO_EJS_DEMO).filter(nombre => grupoFiltro === 'Todos' || nombre.toLowerCase().includes(grupoFiltro.toLowerCase()));
  const todos = PROGRESO_EJS_DEMO[ejSelec] || [];
  const sesionesMostrar = { '1s': 2, '1m': 3, '3m': 5, '6m': 6, '1a': 6 };
  const n = sesionesMostrar[periodoEj] || todos.length;
  const datos = todos.length <= n ? todos : todos.slice(-n);
  const unidad = UNIDAD_EJS_DEMO[ejSelec] || 'kg';
  const valores = datos.map(d => d.kg);
  const maxKg = Math.max(...valores, 0);
  const minKg = Math.min(...valores, 0);
  const ganancia = datos.length > 1 ? datos[datos.length - 1].kg - datos[0].kg : 0;

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ejercicio seleccionado</Text>
        <View style={styles.tagsRow}>
          {['Todos', 'Press', 'Sentadilla', 'Peso'].map(g => (
            <TouchableOpacity key={g} onPress={() => setGrupoFiltro(g)} style={[styles.tag, grupoFiltro === g && styles.tagActive]}>
              <Text style={[styles.tagText, grupoFiltro === g && styles.tagTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {nombres.map(nom => (
          <TouchableOpacity key={nom} onPress={() => setEjSelec(nom)} style={[styles.exercisePick, ejSelec === nom && styles.exercisePickActive]}>
            <Text style={styles.exerciseIcon}>{nom === 'Sentadilla' ? '🦵' : nom === 'Peso muerto' ? '💪' : '🏋️'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseName}>{nom}</Text>
              <Text style={styles.exerciseSub}>{PROGRESO_EJS_DEMO[nom].length} sesiones registradas</Text>
            </View>
            {ejSelec === nom ? <Text style={styles.activeCheck}>✓</Text> : null}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.cardTitle}>{ejSelec}</Text>
            <Text style={styles.cardSub}>RF52 · evolución de carga</Text>
          </View>
          <Text style={[styles.positiveBadge, { color: ganancia >= 0 ? COLORS.success : COLORS.danger }]}>{ganancia >= 0 ? '+' : ''}{ganancia}{unidad}</Text>
        </View>
        <PeriodSelector value={periodoEj} onChange={setPeriodoEj} />
        <BarChart values={valores} height={130} color={COLORS.accent} />
        <View style={styles.statsMiniGrid}>
          <View style={styles.miniStat}><Text style={styles.miniValue}>{maxKg}{unidad}</Text><Text style={styles.miniLabel}>Máximo</Text></View>
          <View style={styles.miniStat}><Text style={styles.miniValue}>{minKg}{unidad}</Text><Text style={styles.miniLabel}>Inicio período</Text></View>
          <View style={styles.miniStat}><Text style={[styles.miniValue, { color: COLORS.success }]}>{ganancia >= 0 ? '+' : ''}{ganancia}{unidad}</Text><Text style={styles.miniLabel}>Cambio</Text></View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Comparativo de sesiones</Text>
        {datos.map((d, i, arr) => {
          const anterior = i > 0 ? arr[i - 1].kg : d.kg;
          return <FilaComparativa key={`${d.fecha}-${i}`} d={d} numero={arr.length - i} diff={d.kg - anterior} unidad={unidad} />;
        })}
      </View>
    </>
  );
}

function ConsistenciaTab({ periodoCons, setPeriodoCons }) {
  const semanas = [
    { label: 'S1 Ene', dias: 3, objetivo: 3 },
    { label: 'S2 Ene', dias: 2, objetivo: 3 },
    { label: 'S3 Ene', dias: 3, objetivo: 3 },
    { label: 'S4 Ene', dias: 3, objetivo: 3 },
    { label: 'S1 Feb', dias: 1, objetivo: 3 },
    { label: 'S2 Feb', dias: 3, objetivo: 3 },
    { label: 'S3 Feb', dias: 3, objetivo: 3 },
    { label: 'S4 Feb', dias: 2, objetivo: 3 },
    { label: 'S1 Mar', dias: 3, objetivo: 3 },
  ];
  const adherencia = Math.round((semanas.reduce((s, w) => s + w.dias, 0) / semanas.reduce((s, w) => s + w.objetivo, 0)) * 100);
  const grupos = [
    { label: 'Pecho', value: 34, color: COLORS.accent },
    { label: 'Pierna', value: 29, color: COLORS.accent2 },
    { label: 'Espalda', value: 22, color: COLORS.accent3 },
    { label: 'Hombro', value: 15, color: COLORS.success },
  ];

  return (
    <>
      <View style={styles.cardAccent}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.bigTitle}>🔥 14 días</Text>
            <Text style={styles.cardSub}>Racha actual de entrenamiento</Text>
          </View>
          <View style={styles.ringFake}><Text style={styles.ringText}>{adherencia}%</Text></View>
        </View>
        <PeriodSelector value={periodoCons} onChange={setPeriodoCons} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Adherencia semanal</Text>
        <View style={styles.weekChart}>
          {semanas.map((s, i) => (
            <View key={s.label} style={styles.weekColumn}>
              <View style={styles.weekTrack}>
                <View style={[styles.weekBar, { height: `${Math.min(100, (s.dias / s.objetivo) * 100)}%`, backgroundColor: s.dias >= s.objetivo ? COLORS.success : COLORS.accent3 }]} />
              </View>
              <Text style={styles.weekLabel}>{i + 1}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.cardSub}>Objetivo declarado: 3 días por semana</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Grupos musculares trabajados</Text>
        {grupos.map(g => (
          <View key={g.label} style={styles.muscleRow}>
            <Text style={styles.muscleName}>{g.label}</Text>
            <View style={styles.muscleTrack}><View style={[styles.muscleFill, { width: `${g.value}%`, backgroundColor: g.color }]} /></View>
            <Text style={styles.muscleValue}>{g.value}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.kpiGrid}>
        <KpiCard icon="📅" value="3.1" label="Prom./sem" color={COLORS.accent} />
        <KpiCard icon="🏋️" value="24" label="Entrenos" color={COLORS.success} />
        <KpiCard icon="🎯" value="8" label="Ejercicios" color={COLORS.accent2} />
        <KpiCard icon="🧩" value="4" label="Grupos" color={COLORS.accent3} />
      </View>
    </>
  );
}

function ExportModal({ visible, onClose, tabActiva }) {
  const [formato, setFormato] = useState('csv');
  const [anonimizar, setAnonimizar] = useState(false);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          <View style={styles.handle} />
          <Text style={styles.modalTitle}>Exportar progreso</Text>
          <Text style={styles.cardSub}>RF57 · genera un reporte para consulta personal</Text>
          <View style={styles.exportGrid}>
            {['csv', 'pdf'].map(f => (
              <TouchableOpacity key={f} onPress={() => setFormato(f)} style={[styles.exportOption, formato === f && styles.exportActive]}>
                <Text style={styles.exportIcon}>{f === 'csv' ? '📊' : '📄'}</Text>
                <Text style={[styles.exportText, formato === f && styles.exportTextActive]}>{f.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {tabActiva === 'resumen' ? (
            <TouchableOpacity onPress={() => setAnonimizar(v => !v)} style={[styles.checkRow, anonimizar && styles.checkRowActive]}>
              <View style={[styles.checkbox, anonimizar && styles.checkboxActive]}><Text style={styles.checkText}>{anonimizar ? '✓' : ''}</Text></View>
              <View>
                <Text style={styles.checkTitle}>Anonimizar datos identificables</Text>
                <Text style={styles.checkSub}>Sustituye nombre y correo por ID interno</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { onClose(); Alert.alert('Exportación demo', `Se exportaría como ${formato.toUpperCase()}.`); }}>
            <Text style={styles.primaryText}>{formato === 'csv' ? '📊' : '📄'} Exportar como {formato.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onClose}>
            <Text style={styles.secondaryText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function ProgresoScreen({ navigation }) {
  const [tabActiva, setTabActiva] = useState('resumen');
  const [ejSelec, setEjSelec] = useState('Press de banca');
  const [grupoFiltro, setGrupoFiltro] = useState('Todos');
  const [periodoEj, setPeriodoEj] = useState('3m');
  const [periodoRes, setPeriodoRes] = useState('1m');
  const [periodoCons, setPeriodoCons] = useState('3m');
  const [modalExport, setModalExport] = useState(false);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Badge>RF50–RF57</Badge>
        <TabSelector active={tabActiva} onChange={setTabActiva} />
        {tabActiva === 'resumen' && <ResumenTab periodoRes={periodoRes} setPeriodoRes={setPeriodoRes} navigation={navigation} onExport={() => setModalExport(true)} />}
        {tabActiva === 'ejercicio' && <EjercicioTab ejSelec={ejSelec} setEjSelec={setEjSelec} grupoFiltro={grupoFiltro} setGrupoFiltro={setGrupoFiltro} periodoEj={periodoEj} setPeriodoEj={setPeriodoEj} />}
        {tabActiva === 'consistencia' && <ConsistenciaTab periodoCons={periodoCons} setPeriodoCons={setPeriodoCons} />}
      </ScrollView>
      <ExportModal visible={modalExport} onClose={() => setModalExport(false)} tabActiva={tabActiva} />
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
  badge: { alignSelf: 'flex-start', borderWidth: 1, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: '900' },
  tabsShell: { flexDirection: 'row', gap: 6, backgroundColor: COLORS.surface2, borderRadius: 10, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.accent },
  tabText: { color: COLORS.muted, fontSize: 12, fontWeight: '900' },
  tabTextActive: { color: 'white' },
  card: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.border, gap: 10 },
  cardAccent: { backgroundColor: 'rgba(124,111,205,0.15)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(124,111,205,0.35)', gap: 12 },
  cardTitle: { color: COLORS.text, fontSize: 13, fontWeight: '900' },
  cardSub: { color: COLORS.muted, fontSize: 11, lineHeight: 16 },
  bigTitle: { color: COLORS.text, fontSize: 28, fontWeight: '900' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', gap: 10 },
  kpiIcon: { fontSize: 22 },
  kpiValue: { fontSize: 16, fontWeight: '900' },
  kpiLabel: { fontSize: 11, color: COLORS.muted, marginTop: 1 },
  legendRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  legendItem: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  legendLine: { width: 14, height: 3, borderRadius: 2 },
  legendText: { color: COLORS.muted, fontSize: 10 },
  radarBox: { gap: 9 },
  measureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  measureLabel: { color: COLORS.text2, fontSize: 11, fontWeight: '800' },
  measureDiff: { fontSize: 10, marginTop: 2 },
  measureTrack: { flex: 1, height: 8, backgroundColor: COLORS.surface2, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  measureBase: { position: 'absolute', height: 8, backgroundColor: 'rgba(124,111,205,0.32)', borderRadius: 8 },
  measureCurrent: { position: 'absolute', height: 8, backgroundColor: COLORS.accent, borderRadius: 8 },
  measureValue: { color: COLORS.text, fontSize: 11, fontWeight: '900', width: 32, textAlign: 'right' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  tag: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.surface3, borderWidth: 1, borderColor: COLORS.border },
  tagActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  tagText: { color: COLORS.muted, fontSize: 11, fontWeight: '800' },
  tagTextActive: { color: 'white' },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderTopWidth: 1, borderTopColor: COLORS.border },
  dateBox: { width: 40, borderRadius: 8, backgroundColor: COLORS.surface2, alignItems: 'center', paddingVertical: 6 },
  dateMonth: { color: COLORS.muted, fontSize: 9, textTransform: 'uppercase' },
  dateDay: { color: COLORS.accent, fontSize: 16, fontWeight: '900' },
  recentTitle: { color: COLORS.text, fontSize: 13, fontWeight: '800' },
  recentSub: { color: COLORS.muted, fontSize: 11, marginTop: 2 },
  noteBadge: { color: COLORS.accent, backgroundColor: 'rgba(124,111,205,0.15)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, overflow: 'hidden' },
  chevron: { color: COLORS.muted, fontSize: 18 },
  outlineBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  outlineText: { color: COLORS.text2, fontSize: 13, fontWeight: '800' },
  selectGrid: { flexDirection: 'row', gap: 10 },
  tinyLabel: { color: COLORS.muted, fontSize: 10, fontWeight: '900', marginBottom: 6, textTransform: 'uppercase' },
  dateChip: { backgroundColor: COLORS.surface2, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 6, paddingHorizontal: 8, marginBottom: 6 },
  dateChipActive: { borderColor: COLORS.accent, backgroundColor: 'rgba(124,111,205,0.18)' },
  dateChipText: { color: COLORS.muted, fontSize: 11, fontWeight: '700' },
  dateChipTextActive: { color: COLORS.accent },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 2 },
  emptyText: { color: COLORS.muted, fontSize: 12, textAlign: 'center', paddingVertical: 10 },
  commonRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  commonName: { flex: 1, color: COLORS.text2, fontSize: 11 },
  commonValue: { color: COLORS.accent, fontSize: 12, fontWeight: '900' },
  primaryBtn: { backgroundColor: COLORS.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryText: { color: 'white', fontWeight: '900', fontSize: 14 },
  secondaryBtn: { backgroundColor: COLORS.surface2, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  secondaryText: { color: COLORS.text2, fontWeight: '800', fontSize: 14 },
  exercisePick: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.surface2, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, padding: 10 },
  exercisePickActive: { borderColor: COLORS.accent, backgroundColor: 'rgba(124,111,205,0.16)' },
  exerciseIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  exerciseName: { color: COLORS.text, fontSize: 13, fontWeight: '800' },
  exerciseSub: { color: COLORS.muted, fontSize: 11, marginTop: 2 },
  activeCheck: { color: COLORS.accent, fontSize: 16, fontWeight: '900' },
  rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  positiveBadge: { fontSize: 13, fontWeight: '900', backgroundColor: 'rgba(52,211,153,0.12)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, overflow: 'hidden' },
  chartPlaceholder: { backgroundColor: COLORS.surface2, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: COLORS.border },
  chartBars: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 7 },
  chartBar: { flex: 1, borderTopLeftRadius: 6, borderTopRightRadius: 6, minHeight: 18 },
  statsMiniGrid: { flexDirection: 'row', gap: 8 },
  miniStat: { flex: 1, backgroundColor: COLORS.surface2, borderRadius: 8, alignItems: 'center', paddingVertical: 9 },
  miniValue: { color: COLORS.accent, fontSize: 14, fontWeight: '900' },
  miniLabel: { color: COLORS.muted, fontSize: 9, marginTop: 2 },
  compareRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderTopWidth: 1, borderTopColor: COLORS.border },
  setNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.surface3, alignItems: 'center', justifyContent: 'center' },
  setNumText: { color: COLORS.text2, fontWeight: '900', fontSize: 11 },
  compareDate: { color: COLORS.text, fontSize: 13, fontWeight: '800' },
  compareSub: { color: COLORS.muted, fontSize: 11, marginTop: 2 },
  compareKg: { color: COLORS.accent, fontSize: 14, fontWeight: '900' },
  compareDiff: { fontSize: 10, fontWeight: '800', marginTop: 2 },
  noteText: { color: COLORS.muted, fontSize: 10, fontStyle: 'italic', marginTop: 4 },
  ringFake: { width: 64, height: 64, borderRadius: 32, borderWidth: 7, borderColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  ringText: { color: COLORS.text, fontWeight: '900', fontSize: 14 },
  weekChart: { height: 135, flexDirection: 'row', gap: 8, alignItems: 'flex-end', paddingTop: 12 },
  weekColumn: { flex: 1, alignItems: 'center', gap: 5 },
  weekTrack: { width: '100%', height: 100, backgroundColor: COLORS.surface2, borderRadius: 7, justifyContent: 'flex-end', overflow: 'hidden' },
  weekBar: { width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7 },
  weekLabel: { color: COLORS.muted, fontSize: 9 },
  muscleRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 6 },
  muscleName: { color: COLORS.text2, width: 58, fontSize: 12, fontWeight: '700' },
  muscleTrack: { flex: 1, height: 8, borderRadius: 8, backgroundColor: COLORS.surface2, overflow: 'hidden' },
  muscleFill: { height: 8, borderRadius: 8 },
  muscleValue: { color: COLORS.muted, width: 34, textAlign: 'right', fontSize: 11, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 18, paddingBottom: 30, gap: 12 },
  handle: { width: 38, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center' },
  modalTitle: { color: COLORS.text, fontSize: 16, fontWeight: '900' },
  exportGrid: { flexDirection: 'row', gap: 10 },
  exportOption: { flex: 1, backgroundColor: COLORS.surface2, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 14, alignItems: 'center', gap: 6 },
  exportActive: { borderColor: COLORS.accent, backgroundColor: 'rgba(124,111,205,0.18)' },
  exportIcon: { fontSize: 26 },
  exportText: { color: COLORS.muted, fontWeight: '900' },
  exportTextActive: { color: COLORS.accent },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border },
  checkRowActive: { backgroundColor: 'rgba(94,234,212,0.08)', borderColor: COLORS.accent2 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: COLORS.accent2, borderColor: COLORS.accent2 },
  checkText: { color: 'white', fontSize: 12, fontWeight: '900' },
  checkTitle: { color: COLORS.text, fontSize: 12, fontWeight: '900' },
  checkSub: { color: COLORS.muted, fontSize: 10, marginTop: 2 },
});