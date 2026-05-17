import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function EditarRutinaScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="✏️" title="Editar rutina" badge="RF18"
      items={[
        { icon: '🔃', title: 'Reordenar ejercicios', sub: 'Placeholder — sin lógica aún' },
        { icon: '➕', title: 'Agregar ejercicio',     sub: 'Placeholder — sin lógica aún', screen: 'Ejercicios' },
        { icon: '🗑️', title: 'Eliminar ejercicio',   sub: 'Placeholder — sin lógica aún' },
      ]}
    />
  );
}
