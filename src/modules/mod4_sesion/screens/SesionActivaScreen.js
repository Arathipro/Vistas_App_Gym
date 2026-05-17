import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function SesionActivaScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="⏱️" title="Sesión activa" badge="RF20–RF32"
      items={[
        { icon: '🔢', title: 'Serie 1 de 4',         sub: 'Press de banca · 70 kg' },
        { icon: '⏱️', title: 'Contador preparación', sub: '3 seg → inicio automático' },
        { icon: '⏸️', title: 'Cronómetro serie',      sub: 'Se detiene manualmente' },
        { icon: '😴', title: 'Descanso: 90s',        sub: 'Formulario registro simultáneo' },
        { icon: '📝', title: 'Nota de serie',        sub: 'Hasta 500 caracteres opcionales' },
      ]}
    />
  );
}
