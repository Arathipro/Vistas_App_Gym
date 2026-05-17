import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function HistorialSesionesScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="📋" title="Historial Sesiones" badge="RF26 · RF56"
      items={[
        { icon: '🏋️', title: 'Full Body · Hoy',      sub: '45 min · 3 ejercicios completados' },
        { icon: '🏋️', title: 'Push · Ayer',          sub: '52 min · 4 ejercicios completados' },
        { icon: '🏋️', title: 'Pull · Hace 3 días',   sub: '41 min · 3 ejercicios completados' },
      ]}
    />
  );
}
