import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function PrivacidadScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🔒" title="Privacidad" badge="RF67"
      items={[
        { icon: '📊', title: 'Compartir progreso',       sub: 'Desactivado' },
        { icon: '📏', title: 'Compartir medidas',        sub: 'Desactivado' },
        { icon: '🏋️', title: 'Compartir entrenamientos', sub: 'Activado' },
      ]}
    />
  );
}
