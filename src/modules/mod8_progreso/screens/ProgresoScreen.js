import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function ProgresoScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="📊" title="Progreso" badge="Módulo 8 · RF50–RF57"
      backScreen="Home"
      items={[
        { icon: '📈', title: 'Gráfica evolución peso',  sub: 'Últimos 3 meses' },
        { icon: '💪', title: 'Progreso por ejercicio',  sub: 'Press banca: 60kg → 75kg', screen: 'HistorialSesiones' },
        { icon: '📋', title: 'Historial sesiones',      sub: 'Ver entrenamientos pasados', screen: 'HistorialSesiones' },
        { icon: '🔥', title: 'Racha actual: 14 días',  sub: 'Adherencia semanal: 92%' },
        { icon: '📤', title: 'Exportar datos',          sub: 'CSV o PDF (RF57)' },
      ]}
    />
  );
}
