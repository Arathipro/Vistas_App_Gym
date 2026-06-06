export const PERIODOS = [
  { id: '1m', t: '1m' },
  { id: '3m', t: '3m' },
  { id: '6m', t: '6m' },
  { id: '1a', t: '1a' },
  { id: 'todo', t: 'Todo' },
];

export const GRUPOS = ['Todos', 'Pecho', 'Espalda', 'Pierna', 'Brazos', 'Hombros', 'Abdomen'];

export const EJERCICIOS = {
  'Press de banca': ['Pecho', '🏋️', 'kg', [50, 55, 60, 65, 70, 75]],
  Aperturas: ['Pecho', '🤸', 'kg', [12, 14, 16, 18, 18, 20]],
  'Jalón al pecho': ['Espalda', '🔝', 'kg', [45, 50, 55, 60, 60, 65]],
  'Peso muerto': ['Espalda', '💪', 'kg', [85, 92, 100, 108, 112, 115]],
  Sentadilla: ['Pierna', '🦵', 'kg', [70, 75, 82, 90, 95, 100]],
  Prensa: ['Pierna', '🦵', 'kg', [120, 130, 140, 150, 160, 170]],
  'Curl bíceps': ['Brazos', '💪', 'kg', [12, 14, 16, 18, 18, 20]],
  'Extensión tríceps': ['Brazos', '⬇️', 'kg', [25, 28, 30, 32, 34, 36]],
  'Press militar': ['Hombros', '🎯', 'kg', [28, 30, 32, 35, 35, 38]],
  Plancha: ['Abdomen', '🧱', 's', [45, 50, 55, 65, 70, 80]],
};

export const SESIONES = [
  {
    id: 1,
    fecha: 'Mar 24, 2026',
    hora: '18:20',
    dur: '52m',
    vol: '3,480 kg',
    e: [
      { n: 'Press de banca', ic: '🏋️', s: [[1, 70, 8, '42s'], [2, 75, 7, '45s'], [3, 72, 8, '44s']] },
      { n: 'Press militar', ic: '🎯', s: [[1, 35, 10, '35s'], [2, 35, 9, '36s']] },
    ],
  },
  {
    id: 2,
    fecha: 'Mar 18, 2026',
    hora: '17:40',
    dur: '58m',
    vol: '4,120 kg',
    e: [
      { n: 'Sentadilla', ic: '🦵', s: [[1, 90, 8, '48s'], [2, 95, 7, '52s'], [3, 100, 6, '54s']] },
      { n: 'Peso muerto', ic: '💪', s: [[1, 108, 5, '42s'], [2, 112, 4, '44s']] },
    ],
  },
  {
    id: 3,
    fecha: 'Mar 10, 2026',
    hora: '19:05',
    dur: '49m',
    vol: '3,020 kg',
    e: [
      { n: 'Press de banca', ic: '🏋️', s: [[1, 65, 9, '40s'], [2, 70, 8, '43s']] },
      { n: 'Jalón al pecho', ic: '🔝', s: [[1, 55, 12, '36s'], [2, 60, 10, '38s']] },
    ],
  },
  {
    id: 4,
    fecha: 'Feb 28, 2026',
    hora: '18:10',
    dur: '45m',
    vol: '2,880 kg',
    e: [{ n: 'Press militar', ic: '🎯', s: [[1, 30, 11, '34s'], [2, 32, 10, '36s']] }],
  },
  {
    id: 5,
    fecha: 'Feb 14, 2026',
    hora: '17:50',
    dur: '55m',
    vol: '3,240 kg',
    e: [{ n: 'Press de banca', ic: '🏋️', s: [[1, 60, 9, '39s'], [2, 65, 8, '41s']] }],
  },
];

export const MEDIDAS = [
  ['Cintura', 85, 81, -4],
  ['Pecho', 95, 98, 3],
  ['Brazo', 35, 37, 2],
  ['Cadera', 98, 95, -3],
  ['Muslo', 54, 55, 1],
  ['Pantorrilla', 36, 37, 1],
];

export function topEjercicios() {
  return Object.entries(EJERCICIOS)
    .map(([label, e]) => ({ label, val: e[3].at(-1) - e[3][0], unit: e[2], sub: e[0] }))
    .sort((a, b) => b.val - a.val);
}

export function topGruposPeso() {
  return [
    { label: 'Pierna', val: 80, unit: 'kg', sub: 'Sentadilla + prensa' },
    { label: 'Espalda', val: 50, unit: 'kg', sub: 'Peso muerto + jalón' },
    { label: 'Pecho', val: 33, unit: 'kg', sub: 'Press + aperturas' },
    { label: 'Tríceps', val: 11, unit: 'kg', sub: 'Extensiones' },
    { label: 'Bíceps', val: 8, unit: 'kg', sub: 'Curl' },
  ];
}

export function topGruposMedida() {
  return [
    { label: 'Pecho', val: 3, unit: 'cm', sub: '95 → 98 cm' },
    { label: 'Bíceps', val: 2, unit: 'cm', sub: '35 → 37 cm' },
    { label: 'Tríceps', val: 2, unit: 'cm', sub: 'Estimado por brazo' },
    { label: 'Pantorrilla', val: 1, unit: 'cm', sub: '36 → 37 cm' },
    { label: 'Muslo', val: 1, unit: 'cm', sub: '54 → 55 cm' },
  ];
}

export const SEMANAS = {
  '1m': [3, 2, 3, 3],
  '3m': [3, 2, 3, 3, 1, 3, 3, 2, 3],
  '6m': [2, 3, 1, 3, 2, 3, 3, 2, 3, 3, 1, 3],
  '1a': [2, 3, 1, 3, 2, 3, 3, 2, 3, 3, 1, 3, 2, 3, 3, 2],
  todo: [2, 3, 1, 3, 2, 3, 3, 2, 3, 3, 1, 3, 2, 3, 3, 2, 3, 3, 1, 3],
};
