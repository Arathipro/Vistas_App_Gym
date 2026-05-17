import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function ScannerGymScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="📷" title="Escáner Gym" badge="Módulo 6 · RF40–RF44"
      backScreen="Home"
      items={[
        { icon: '📸', title: 'Capturar foto de máquina', sub: 'Identifica equipos con IA' },
        { icon: '🏗️', title: 'Resultado identificación', sub: 'Nombre · músculos · recomendaciones', screen: 'ScannerResultGym' },
      ]}
    />
  );
}
