import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function EjerciciosScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="📚" title="Catálogo de ejercicios" badge="RF12–RF15"
      items={[
        { icon: '💪', title: 'Press de banca',              sub: 'Pecho · Multiarticular',   screen: 'EjercicioDet' },
        { icon: '💪', title: 'Sentadilla',                  sub: 'Piernas · Multiarticular', screen: 'EjercicioDet' },
        { icon: '💪', title: 'Peso muerto',                 sub: 'Espalda · Multiarticular', screen: 'EjercicioDet' },
        { icon: '💪', title: 'Curl de bíceps',              sub: 'Brazos · Monoarticular',   screen: 'EjercicioDet' },
        { icon: '💪', title: 'Extensión tríceps',           sub: 'Brazos · Monoarticular',   screen: 'EjercicioDet' },
        { icon: '💪', title: 'Jalón al pecho',              sub: 'Espalda · Multiarticular', screen: 'EjercicioDet' },
        { icon: '➕', title: 'Crear ejercicio personalizado', sub: 'RF14',                   screen: 'EjercicioDet' },
      ]}
    />
  );
}
