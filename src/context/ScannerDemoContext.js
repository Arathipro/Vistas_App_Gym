import React, { createContext, useContext, useMemo, useState } from 'react';

export const MACHINE_RESULTS = [
  {
    id: 'gym-press-pecho', nombre: 'Press de pecho en maquina', confianza: 94, grupo: 'Pecho', icon: '🏗️',
    musculos: 'Pectoral mayor · Triceps · Deltoides anterior',
    descripcion: 'Maquina guiada para empujar al frente desde posicion sentada. Ayuda a trabajar pecho con estabilidad.',
    recomendaciones: ['Ajusta el asiento a la altura del pecho.', 'Mantén la espalda apoyada.', 'Usa un peso controlable.'],
  },
  {
    id: 'gym-jalon', nombre: 'Jalon al pecho en polea', confianza: 91, grupo: 'Espalda', icon: '🔝',
    musculos: 'Dorsal ancho · Biceps · Romboides',
    descripcion: 'Equipo de polea para trabajar espalda jalando la barra hacia el pecho con control.',
    recomendaciones: ['Evita balancear el torso.', 'Lleva los codos hacia abajo.', 'Controla la subida.'],
  },
  {
    id: 'gym-prensa', nombre: 'Prensa de pierna', confianza: 89, grupo: 'Piernas', icon: '🦵',
    musculos: 'Cuadriceps · Gluteos · Isquiotibiales',
    descripcion: 'Maquina para empujar una plataforma con las piernas, util para trabajo guiado del tren inferior.',
    recomendaciones: ['No bloquees completamente las rodillas.', 'Apoya bien la espalda.', 'Baja de forma controlada.'],
  },
];

export const FOOD_RESULTS = [
  { id: 'food-pollo-arroz', nombre: 'Bowl de pollo con arroz', icon: '🍱', confianza: 88, kcal: 620, prot: 42, carbs: 68, grasas: 18, porcion: '1 plato mediano' },
  { id: 'food-huevo-papa', nombre: 'Huevo con papa y verduras', icon: '🍳', confianza: 86, kcal: 540, prot: 26, carbs: 58, grasas: 23, porcion: '1 plato mediano' },
  { id: 'food-sandwich', nombre: 'Sandwich integral de pollo', icon: '🥪', confianza: 84, kcal: 405, prot: 33, carbs: 46, grasas: 16, porcion: '1 pieza' },
];

const FOOD_BASE = [
  { id: 'base-cafe', nombre: 'Cafe con leche', icon: '☕', kcal: 120, prot: 6, carbs: 12, grasas: 4 },
  { id: 'base-manzana', nombre: 'Manzana', icon: '🍎', kcal: 95, prot: 1, carbs: 25, grasas: 0 },
];

const ScannerDemoContext = createContext(null);

export function ScannerDemoProvider({ children }) {
  const [machineCatalog, setMachineCatalog] = useState([]);
  const [foodDaily, setFoodDaily] = useState(FOOD_BASE);
  const [foodSaved, setFoodSaved] = useState([]);
  const [foodIndex, setFoodIndex] = useState(0);

  function resetMachines() { setMachineCatalog([]); }
  function resetFood() { setFoodDaily(FOOD_BASE); setFoodSaved([]); setFoodIndex(0); }

  function getNextFood() {
    const food = FOOD_RESULTS[foodIndex % FOOD_RESULTS.length];
    setFoodIndex(i => i + 1);
    return food;
  }

  function saveMachine(machine) {
    setMachineCatalog(prev => {
      if (prev.some(x => x.id === machine.id || x.nombre === machine.nombre)) return prev;
      return [{ ...machine, savedAt: 'Hoy' }, ...prev];
    });
  }

  function addFoodToDay(food) {
    const item = { ...food, id: `${food.id}-${Date.now()}` };
    setFoodDaily(prev => [item, ...prev]);
    setFoodSaved(prev => [item, ...prev]);
  }

  const dailyTotals = useMemo(() => foodDaily.reduce((acc, x) => ({
    kcal: acc.kcal + Number(x.kcal || 0),
    prot: acc.prot + Number(x.prot || 0),
    carbs: acc.carbs + Number(x.carbs || 0),
    grasas: acc.grasas + Number(x.grasas || 0),
  }), { kcal: 0, prot: 0, carbs: 0, grasas: 0 }), [foodDaily]);

  const value = useMemo(() => ({
    machineCatalog, saveMachine, resetMachines,
    foodDaily, foodSaved, dailyTotals, addFoodToDay, getNextFood, resetFood,
  }), [machineCatalog, foodDaily, foodSaved, dailyTotals]);

  return <ScannerDemoContext.Provider value={value}>{children}</ScannerDemoContext.Provider>;
}

export function useScannerDemo() {
  const ctx = useContext(ScannerDemoContext);
  if (!ctx) throw new Error('useScannerDemo debe usarse dentro de ScannerDemoProvider');
  return ctx;
}
