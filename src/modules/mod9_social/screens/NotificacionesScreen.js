import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function NotificacionesScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🔔" title="Notificaciones" badge="RF72"
      items={[
        { icon: '🤝', title: 'Solicitud de amistad',   sub: 'Juan Pérez quiere conectar' },
        { icon: '🏋️', title: 'María comenzó entreno', sub: 'Hace 10 minutos' },
      ]}
    />
  );
}
