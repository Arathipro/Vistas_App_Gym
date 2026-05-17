import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function AmigosScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🤝" title="Amigos" badge="RF58–RF66"
      items={[
        { icon: '👤', title: 'María García',   sub: 'Amiga · entrena hoy' },
        { icon: '👤', title: 'Luis Torres',    sub: 'Amigo · racha 8 días' },
        { icon: '🔍', title: 'Buscar usuarios', sub: 'Por nombre o código (RF58)' },
      ]}
    />
  );
}
