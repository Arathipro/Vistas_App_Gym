import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function RutinasScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🏋️" title="Entrenamientos" badge="Módulo 3 · RF12–RF19"
      backScreen="Home"
      items={[
        { icon: '🗂️', title: 'Crear rutina',        sub: 'Arma tu rutina personalizada',  screen: 'CrearRutina' },
        { icon: '📚', title: 'Catálogo ejercicios',  sub: 'Explora más de 50 ejercicios',  screen: 'Ejercicios' },
        { icon: '📅', title: 'Rutina Full Body',     sub: '5 ejercicios · ~45 min',        screen: 'RutinaDetalle' },
        { icon: '📅', title: 'Rutina Push',          sub: '6 ejercicios · ~50 min',        screen: 'RutinaDetalle' },
      ]}
    />
  );
}
