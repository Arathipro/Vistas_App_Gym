import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function HistorialFoodScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🗃️" title="Historial Alimentos" badge="RF49"
      items={[
        { icon: '🍎', title: 'Manzana · hoy',             sub: '95 kcal' },
        { icon: '🍗', title: 'Pollo a la plancha · ayer', sub: '165 kcal' },
        { icon: '🥑', title: 'Aguacate · hace 2 días',    sub: '234 kcal' },
      ]}
    />
  );
}
