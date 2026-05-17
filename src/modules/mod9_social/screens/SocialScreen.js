import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function SocialScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="👥" title="Comunidad" badge="Módulo 9 · RF58–RF72"
      backScreen="Home"
      items={[
        { icon: '🤝', title: 'Mis amigos',     sub: '3 conexiones activas',     screen: 'Amigos' },
        { icon: '👥', title: 'Grupos',         sub: '1 grupo activo',           screen: 'Grupos' },
        { icon: '🏆', title: 'Rankings',       sub: 'Comparar métricas',        screen: 'Ranking' },
        { icon: '🔔', title: 'Notificaciones', sub: '2 solicitudes pendientes', screen: 'Notificaciones' },
      ]}
    />
  );
}
