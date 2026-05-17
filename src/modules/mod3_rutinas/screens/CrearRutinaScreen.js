import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function CrearRutinaScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🗂️" title="Crear rutina" badge="RF17"
      items={[
        { icon: '✏️', title: 'Nombre de la rutina',  sub: 'Placeholder — sin lógica aún' },
        { icon: '➕', title: 'Agregar ejercicios',    sub: 'Placeholder — sin lógica aún', screen: 'Ejercicios' },
        { icon: '⏱️', title: 'Tiempo estimado',      sub: 'Se calculará automáticamente' },
      ]}
    />
  );
}
