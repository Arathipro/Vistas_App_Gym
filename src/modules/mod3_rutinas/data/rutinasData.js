/**
 * rutinasData.js — Datos estáticos Módulo 3 (sin backend aún)
 * 18 ejercicios incluyendo Core y Cardio (RF12)
 */
export const EJERCICIOS_DATA = [
  { id:1,  nombre:'Press de banca',       categoria:'Pecho',   icon:'🏋️', sets:'4x8-10',  series:4, reps:9,  descanso:120, articulacion:'Multiarticular', lateralidad:'Bilateral',  descripcion:'Acostado en el banco, baja la barra hasta el pecho y empuja hasta extender los brazos completamente.' },
  { id:2,  nombre:'Sentadilla',            categoria:'Piernas', icon:'🦵',  sets:'4x8-12',  series:4, reps:10, descanso:120, articulacion:'Multiarticular', lateralidad:'Bilateral',  descripcion:'Con la barra en la espalda alta, baja hasta que los muslos queden paralelos al suelo y sube extendiendo caderas y rodillas.' },
  { id:3,  nombre:'Peso muerto',           categoria:'Espalda', icon:'💪',  sets:'3x5-8',   series:3, reps:6,  descanso:150, articulacion:'Multiarticular', lateralidad:'Bilateral',  descripcion:'Con la barra en el suelo, agarra con ambas manos, espalda neutral, y levanta extendiendo caderas y rodillas simultáneamente.' },
  { id:4,  nombre:'Jalón al pecho',        categoria:'Espalda', icon:'🔝',  sets:'4x10-12', series:4, reps:11, descanso:90,  articulacion:'Multiarticular', lateralidad:'Bilateral',  descripcion:'Sentado en la polea, jala la barra hacia el pecho manteniendo el torso ligeramente inclinado hacia atrás.' },
  { id:5,  nombre:'Press militar',         categoria:'Hombros', icon:'🎯',  sets:'3x8-12',  series:3, reps:10, descanso:90,  articulacion:'Multiarticular', lateralidad:'Bilateral',  descripcion:'De pie o sentado, empuja la barra desde los hombros hasta arriba de la cabeza extendiendo completamente los brazos.' },
  { id:6,  nombre:'Curl de bíceps',        categoria:'Brazos',  icon:'💪',  sets:'3x10-15', series:3, reps:12, descanso:60,  articulacion:'Monoarticular',  lateralidad:'Bilateral',  descripcion:'De pie, con mancuernas o barra, flexiona el codo llevando el peso hacia el hombro sin mover el codo del costado.' },
  { id:7,  nombre:'Curl martillo',         categoria:'Brazos',  icon:'🔨',  sets:'3x10-12', series:3, reps:11, descanso:60,  articulacion:'Monoarticular',  lateralidad:'Unilateral', descripcion:'Con agarre neutro (pulgar arriba), flexiona el codo alternando brazos para trabajar braquial y braquiorradial.' },
  { id:8,  nombre:'Extensión tríceps',     categoria:'Brazos',  icon:'⬇️',  sets:'3x12-15', series:3, reps:13, descanso:60,  articulacion:'Monoarticular',  lateralidad:'Bilateral',  descripcion:'Con polea o mancuerna sobre la cabeza, extiende el codo llevando el peso hacia abajo manteniendo los codos fijos.' },
  { id:9,  nombre:'Zancada',               categoria:'Piernas', icon:'🚶',  sets:'3x10-12', series:3, reps:11, descanso:90,  articulacion:'Multiarticular', lateralidad:'Unilateral', descripcion:'Da un paso al frente y baja la rodilla trasera hasta casi tocar el suelo. Alterna piernas o completa un lado y luego el otro.' },
  { id:10, nombre:'Elevación lateral',     categoria:'Hombros', icon:'🎽',  sets:'3x12-15', series:3, reps:13, descanso:60,  articulacion:'Monoarticular',  lateralidad:'Bilateral',  descripcion:'De pie con mancuernas al costado, sube los brazos lateralmente hasta la altura del hombro con codos ligeramente flexionados.' },
  { id:11, nombre:'Plancha',               categoria:'Core',    icon:'🧘',  sets:'3x60s',   series:3, reps:60, descanso:60,  articulacion:'Isométrico',     lateralidad:'Bilateral',  descripcion:'Apoya los antebrazos y puntas de los pies, mantén el cuerpo recto como una tabla. Activa abdomen y glúteos durante todo el tiempo.' },
  { id:12, nombre:'Crunch abdominal',      categoria:'Core',    icon:'🔄',  sets:'3x20',    series:3, reps:20, descanso:45,  articulacion:'Monoarticular',  lateralidad:'Bilateral',  descripcion:'Acostado boca arriba, dobla las rodillas y eleva los hombros del suelo contrayendo el abdomen. No jales el cuello con las manos.' },
  { id:13, nombre:'Rueda abdominal',       categoria:'Core',    icon:'⚙️',  sets:'3x10',    series:3, reps:10, descanso:60,  articulacion:'Multiarticular', lateralidad:'Bilateral',  descripcion:'Arrodillado, empuja la rueda hacia adelante con los brazos extendidos y regresa controlando el movimiento con el core.' },
  { id:14, nombre:'Caminata 30 min',       categoria:'Cardio',  icon:'🚶',  sets:'1x30min', series:1, reps:1,  descanso:0,   articulacion:'Cardiovascular', lateralidad:'Bilateral',  descripcion:'Camina a un ritmo moderado durante 30 minutos. Mantén una postura erguida y pasos constantes para maximizar el beneficio cardiovascular.' },
  { id:15, nombre:'Saltar la cuerda',      categoria:'Cardio',  icon:'🪃',  sets:'5x2min',  series:5, reps:2,  descanso:60,  articulacion:'Cardiovascular', lateralidad:'Bilateral',  descripcion:'Salta la cuerda a un ritmo constante durante 2 minutos por serie. Ideal para calentar o como ejercicio de acondicionamiento.' },
  { id:16, nombre:'Remo con barra',        categoria:'Espalda', icon:'🏗️',  sets:'4x8-10',  series:4, reps:9,  descanso:90,  articulacion:'Multiarticular', lateralidad:'Bilateral',  descripcion:'Con la barra colgando y torso inclinado ~45°, jala la barra hacia el abdomen apretando los omóplatos al final del movimiento.' },
  { id:17, nombre:'Face pull',             categoria:'Hombros', icon:'🎯',  sets:'3x15',    series:3, reps:15, descanso:60,  articulacion:'Monoarticular',  lateralidad:'Bilateral',  descripcion:'Agarra la cuerda con ambas manos. Jala hacia tu rostro separando las manos al final del movimiento para trabajar el manguito rotador.' },
  { id:18, nombre:'Fondos en paralelas',   categoria:'Brazos',  icon:'💪',  sets:'4x10',    series:4, reps:10, descanso:90,  articulacion:'Multiarticular', lateralidad:'Bilateral',  descripcion:'Apoya las palmas en las barras paralelas. Baja el cuerpo doblando los codos hasta 90° y sube extendiendo los brazos.' },
];

export const RUTINAS_INICIALES = [
  {
    id: 'r1',
    nombre: 'Full Body · Principiante',
    tipo: 'Full Body',
    diasHabilitados: ['Lun', 'Mié', 'Vie'],
    ejerciciosPorDia: { Lun: 3, Mié: 3, Vie: 3 },
    ejerciciosDetallePorDia: {
      Lun: [
        { uid:'e1', id:2, nombre:'Sentadilla',      icon:'🦵',  series:4, repsMin:'8',  repsMax:'12', descanso:120, unidad:'kg' },
        { uid:'e2', id:1, nombre:'Press de banca',  icon:'🏋️', series:4, repsMin:'8',  repsMax:'10', descanso:120, unidad:'kg' },
        { uid:'e3', id:4, nombre:'Jalón al pecho',  icon:'🔝',  series:3, repsMin:'10', repsMax:'12', descanso:90,  unidad:'kg' },
      ],
      Mié: [
        { uid:'e4', id:3,  nombre:'Peso muerto',    icon:'💪',  series:3, repsMin:'5',  repsMax:'8',  descanso:150, unidad:'kg' },
        { uid:'e5', id:5,  nombre:'Press militar',  icon:'🎯',  series:3, repsMin:'8',  repsMax:'12', descanso:90,  unidad:'kg' },
        { uid:'e6', id:11, nombre:'Plancha',         icon:'🧘',  series:3, repsMin:'30', repsMax:'60', descanso:60,  unidad:'seg' },
      ],
      Vie: [
        { uid:'e7', id:9,  nombre:'Zancada',         icon:'🚶',  series:3, repsMin:'10', repsMax:'12', descanso:90,  unidad:'kg' },
        { uid:'e8', id:8,  nombre:'Extensión tríceps',icon:'⬇️', series:3, repsMin:'12', repsMax:'15', descanso:60,  unidad:'kg' },
        { uid:'e9', id:12, nombre:'Crunch abdominal', icon:'🔄',  series:3, repsMin:'15', repsMax:'20', descanso:45,  unidad:'reps' },
      ],
    },
  },
];
