import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function EjercicioDetScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🔍" title="Detalle de ejercicio" badge="RF12–RF13"
      items={[
        { icon: '🎥', title: 'Video demostrativo',    sub: 'Disponible en módulo real' },
        { icon: '💪', title: 'Grupo muscular',        sub: 'Pecho principal · Tríceps secundario' },
        { icon: '⏱️', title: 'Tiempos recomendados', sub: 'Serie: 60s · Descanso: 120s' },
        { icon: '🔗', title: 'Tipo',                  sub: 'Multiarticular bilateral' },
      ]}
    />
  );
}
