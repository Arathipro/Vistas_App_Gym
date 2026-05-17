import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function ScannerResultGymScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🏗️" title="Resultado Gym" badge="RF42–RF44"
      items={[
        { icon: '🏗️', title: 'Press de pecho en máquina', sub: 'Confianza: 94%' },
        { icon: '💪', title: 'Músculos',                  sub: 'Pectoral mayor · Tríceps · Deltoides anterior' },
        { icon: '🎥', title: 'Video demostrativo',        sub: 'Disponible en módulo real' },
        { icon: '💾', title: 'Guardar en catálogo',       sub: 'RF44' },
      ]}
    />
  );
}
