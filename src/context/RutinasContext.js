import React, { createContext, useContext, useMemo, useState } from 'react';
import { EJERCICIOS_DATA, RUTINAS_INICIALES } from '../modules/mod3_rutinas/data/rutinasData';

const RutinasContext = createContext(null);

export const GRUPOS_MUSCULARES = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Cardio'];

export function esCardio(ejercicio) {
  return (ejercicio?.categoria || '').toLowerCase() === 'cardio';
}

export function esCore(ejercicio) {
  const cat = (ejercicio?.categoria || '').toLowerCase();
  return cat === 'core' || cat === 'abdomen' || cat === 'abdominales';
}

export function etiquetaCategoria(cat) {
  return cat === 'Core' ? 'Core / Abdomen' : cat;
}

const EJERCICIOS_PERSONALIZADOS_INICIAL = [
  {
    id: 'c1', nombre: 'Face pull con polea', categoria: 'Hombros', icon: '🎯', sets: '3x15',
    series: 3, reps: 15, repsMin: '12', repsMax: '15', descanso: 60,
    articulacion: 'Monoarticular', lateralidad: 'Bilateral', unidad: 'kg', isCustom: true,
    descripcion: 'Jala la cuerda hacia el rostro separando las manos al final del movimiento.', videoUrl: null,
  },
  {
    id: 'c2', nombre: 'Fondos en paralelas', categoria: 'Brazos', icon: '💪', sets: '4x8-12',
    series: 4, reps: 10, repsMin: '8', repsMax: '12', descanso: 90,
    articulacion: 'Multiarticular', lateralidad: 'Bilateral', unidad: 'kg', isCustom: true,
    descripcion: 'Baja el cuerpo doblando los codos de forma controlada y sube extendiendo los brazos.', videoUrl: null,
  },
];

function crearMapaDias(dias) {
  return dias.reduce((acc, dia) => ({ ...acc, [dia]: [] }), {});
}

function crearConteoDias(dias) {
  return dias.reduce((acc, dia) => ({ ...acc, [dia]: 0 }), {});
}

function normalizarConfig(ejercicio, config = {}) {
  if (esCardio(ejercicio)) {
    return {
      duracionMin: Number(config.duracionMin ?? ejercicio.duracionMin ?? ejercicio.reps ?? 30) || 30,
      unidad: 'tiempo',
      series: 1,
      repsMin: '',
      repsMax: '',
      descanso: 0,
      articulacion: null,
      lateralidad: null,
    };
  }

  const base = {
    series: Number(config.series ?? ejercicio.series ?? 3) || 3,
    repsMin: String(config.repsMin ?? ejercicio.repsMin ?? ejercicio.reps ?? 8),
    repsMax: String(config.repsMax ?? ejercicio.repsMax ?? ((ejercicio.reps || 8) + 4)),
    descanso: Number(config.descanso ?? ejercicio.descanso ?? 90) || 0,
    unidad: config.unidad ?? ejercicio.unidad ?? 'kg',
  };

  if (esCore(ejercicio)) {
    return { ...base, articulacion: null, lateralidad: null };
  }

  return {
    ...base,
    articulacion: config.articulacion ?? ejercicio.articulacion ?? 'Multiarticular',
    lateralidad: config.lateralidad ?? ejercicio.lateralidad ?? 'Bilateral',
  };
}

function calcularSets(data) {
  if (esCardio(data)) return `${data.duracionMin || 30} min`;
  return `${data.series || 3}x${data.repsMin || 8}-${data.repsMax || 12}`;
}

export function RutinasProvider({ children }) {
  const [rutinas, setRutinas] = useState(RUTINAS_INICIALES);
  const [rutinaActual, setRutinaActual] = useState(RUTINAS_INICIALES[0] || null);
  const [desdeDia, setDesdeDia] = useState(null);
  const [ejercicioActual, setEjercicioActual] = useState(null);
  const [ejPersonalizados, setEjPersonalizados] = useState(EJERCICIOS_PERSONALIZADOS_INICIAL);
  const [sesionActual, setSesionActual] = useState(null);

  function crearRutina({ nombre, diasHabilitados, tipo = 'Personalizada' }) {
    const dias = diasHabilitados || [];
    const nueva = {
      id: `r-${Date.now()}`,
      nombre: nombre.trim(),
      tipo,
      diasHabilitados: dias,
      ejerciciosPorDia: crearConteoDias(dias),
      ejerciciosDetallePorDia: crearMapaDias(dias),
    };
    setRutinas(prev => [nueva, ...prev]);
    setRutinaActual(nueva);
    setDesdeDia(null);
    return nueva;
  }

  function actualizarRutina(id, cambios) {
    let actualizada = null;
    setRutinas(prev => prev.map(r => {
      if (r.id !== id) return r;
      actualizada = { ...r, ...cambios };
      return actualizada;
    }));
    if (rutinaActual?.id === id && actualizada) setRutinaActual(actualizada);
    return actualizada;
  }

  function eliminarRutina(id) {
    setRutinas(prev => prev.filter(r => r.id !== id));
    if (rutinaActual?.id === id) {
      setRutinaActual(null);
      setDesdeDia(null);
    }
  }

  function seleccionarRutina(rutina) {
    setRutinaActual(rutina);
    setDesdeDia(null);
  }

  function abrirCatalogoLibre() {
    setDesdeDia(null);
    setEjercicioActual(null);
  }

  function seleccionarDia(rutina, dia) {
    setRutinaActual(rutina);
    setDesdeDia(dia);
  }

  function agregarEjercicioADia(rutinaId, dia, ejercicio, config = {}) {
    const cfg = normalizarConfig(ejercicio, config);
    const nuevo = {
      uid: `ej-${Date.now()}`,
      id: ejercicio.id,
      nombre: ejercicio.nombre,
      categoria: ejercicio.categoria,
      icon: ejercicio.icon || '💪',
      isCustom: !!ejercicio.isCustom,
      descripcion: ejercicio.descripcion || '',
      videoUrl: ejercicio.videoUrl || null,
      ...cfg,
    };

    setRutinas(prev => prev.map(r => {
      if (r.id !== rutinaId) return r;
      const lista = r.ejerciciosDetallePorDia?.[dia] || [];
      const nuevaLista = [...lista, nuevo];
      const actualizada = {
        ...r,
        ejerciciosDetallePorDia: { ...r.ejerciciosDetallePorDia, [dia]: nuevaLista },
        ejerciciosPorDia: { ...r.ejerciciosPorDia, [dia]: nuevaLista.length },
      };
      if (rutinaActual?.id === rutinaId) setRutinaActual(actualizada);
      return actualizada;
    }));
    return nuevo;
  }

  function actualizarEjercicioDia(rutinaId, dia, uid, cambios) {
    setRutinas(prev => prev.map(r => {
      if (r.id !== rutinaId) return r;
      const lista = r.ejerciciosDetallePorDia?.[dia] || [];
      const nuevaLista = lista.map(e => e.uid === uid ? { ...e, ...cambios } : e);
      const actualizada = { ...r, ejerciciosDetallePorDia: { ...r.ejerciciosDetallePorDia, [dia]: nuevaLista } };
      if (rutinaActual?.id === rutinaId) setRutinaActual(actualizada);
      return actualizada;
    }));
  }

  function eliminarEjercicioDia(rutinaId, dia, uid) {
    setRutinas(prev => prev.map(r => {
      if (r.id !== rutinaId) return r;
      const lista = r.ejerciciosDetallePorDia?.[dia] || [];
      const nuevaLista = lista.filter(e => e.uid !== uid);
      const actualizada = {
        ...r,
        ejerciciosDetallePorDia: { ...r.ejerciciosDetallePorDia, [dia]: nuevaLista },
        ejerciciosPorDia: { ...r.ejerciciosPorDia, [dia]: nuevaLista.length },
      };
      if (rutinaActual?.id === rutinaId) setRutinaActual(actualizada);
      return actualizada;
    }));
  }

  function crearEjercicioPersonalizado(data) {
    const cfg = normalizarConfig(data, data);
    const nuevo = {
      id: `c-${Date.now()}`,
      icon: data.icon || '✏️',
      isCustom: true,
      videoUrl: null,
      ...data,
      ...cfg,
    };
    nuevo.sets = calcularSets(nuevo);
    setEjPersonalizados(prev => [nuevo, ...prev]);
    setEjercicioActual(nuevo);
    return nuevo;
  }

  const value = useMemo(() => ({
    ejerciciosCatalogo: EJERCICIOS_DATA,
    gruposMusculares: GRUPOS_MUSCULARES,
    rutinas, setRutinas, rutinaActual, setRutinaActual,
    desdeDia, setDesdeDia, ejercicioActual, setEjercicioActual,
    ejPersonalizados, setEjPersonalizados, sesionActual, setSesionActual,
    crearRutina, actualizarRutina, eliminarRutina, seleccionarRutina, abrirCatalogoLibre, seleccionarDia,
    agregarEjercicioADia, actualizarEjercicioDia, eliminarEjercicioDia, crearEjercicioPersonalizado,
  }), [rutinas, rutinaActual, desdeDia, ejercicioActual, ejPersonalizados, sesionActual]);

  return <RutinasContext.Provider value={value}>{children}</RutinasContext.Provider>;
}

export function useRutinas() {
  const ctx = useContext(RutinasContext);
  if (!ctx) throw new Error('useRutinas debe usarse dentro de <RutinasProvider>');
  return ctx;
}
