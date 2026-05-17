import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function GruposScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="👥" title="Grupos" badge="RF71–RF72"
      items={[
        { icon: '👥', title: 'Grupo Gym DPUAS', sub: '5 miembros · Activo' },
        { icon: '➕', title: 'Crear grupo',      sub: 'Placeholder — sin lógica aún' },
      ]}
    />
  );
}
