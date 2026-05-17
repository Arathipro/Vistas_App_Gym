import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function MedidasScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="📏" title="Medidas corporales" badge="Módulo 2 · RF09–RF11"
      backScreen="Home"
      items={[
        { icon: '➕', title: 'Nueva medición',       sub: 'Registrar brazos, cintura, piernas…', screen: 'MedidasReg' },
        { icon: '📈', title: 'Historial de medidas', sub: 'Ver evolución y gráficas',            screen: 'MedidasHist' },
      ]}
    />
  );
}
