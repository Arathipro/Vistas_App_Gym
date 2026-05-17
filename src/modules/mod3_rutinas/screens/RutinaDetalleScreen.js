import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function RutinaDetalleScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="📅" title="Detalle de rutina" badge="RF19"
      items={[
        { icon: '▶️', title: 'Iniciar sesión',    sub: 'Comenzar entrenamiento', screen: 'PreSesion' },
        { icon: '✏️', title: 'Editar rutina',     sub: 'Modificar ejercicios',   screen: 'EditarRutina' },
        { icon: '🏋️', title: 'Press de banca',   sub: '4 series · 70 kg · 90s descanso' },
        { icon: '🏋️', title: 'Sentadilla',       sub: '4 series · 80 kg · 150s descanso' },
        { icon: '🏋️', title: 'Jalón al pecho',  sub: '3 series · 55 kg · 90s descanso' },
      ]}
    />
  );
}
