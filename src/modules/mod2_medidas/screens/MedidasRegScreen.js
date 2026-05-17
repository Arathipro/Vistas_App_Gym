import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function MedidasRegScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="➕" title="Nueva medición" badge="RF09"
      items={[
        { icon: '⚖️',  title: 'Peso (kg)',    sub: 'Placeholder — sin lógica aún' },
        { icon: '📐', title: 'Brazos (cm)',   sub: 'Placeholder — sin lógica aún' },
        { icon: '📐', title: 'Cintura (cm)',  sub: 'Placeholder — sin lógica aún' },
        { icon: '📐', title: 'Cadera (cm)',   sub: 'Placeholder — sin lógica aún' },
        { icon: '📐', title: 'Pecho (cm)',    sub: 'Placeholder — sin lógica aún' },
        { icon: '📐', title: 'Muslos (cm)',   sub: 'Placeholder — sin lógica aún' },
      ]}
    />
  );
}
