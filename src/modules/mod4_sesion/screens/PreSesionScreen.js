import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function PreSesionScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="▶️" title="Pre-Sesión" badge="Módulo 4 · RF20"
      items={[
        { icon: '⏱️', title: 'Tiempo estimado: 45 min', sub: 'Basado en series y descansos configurados' },
        { icon: '🏋️', title: 'Press de banca',          sub: '4 series · 70 kg · 90s descanso' },
        { icon: '🏋️', title: 'Sentadilla',              sub: '4 series · 80 kg · 150s descanso' },
        { icon: '▶️', title: 'Iniciar entrenamiento',   sub: 'Placeholder — sin lógica aún', screen: 'SesionActiva' },
      ]}
    />
  );
}
