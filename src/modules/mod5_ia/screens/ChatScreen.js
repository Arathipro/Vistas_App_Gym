import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function ChatScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🤖" title="Asistente IA" badge="Módulo 5 · RF33–RF39"
      backScreen="Home"
      items={[
        { icon: '💬', title: '¿Cuántas calorías necesito?',       sub: 'Consulta de ejemplo' },
        { icon: '💬', title: '¿Qué ejercicios para espalda?',     sub: 'Consulta de ejemplo' },
        { icon: '💬', title: 'Explícame la sobrecarga progresiva', sub: 'Consulta de ejemplo' },
        { icon: '🧮', title: 'Cálculo TMB / TDEE',               sub: 'RF37 — basado en tu perfil' },
      ]}
    />
  );
}
