import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function ScannerFoodScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🥗" title="Escáner Alimentos" badge="Módulo 7 · RF45–RF49"
      backScreen="Home"
      items={[
        { icon: '📸', title: 'Capturar foto de alimento', sub: 'Identifica calorías con IA' },
        { icon: '🍎', title: 'Ver resultado',             sub: 'Calorías + macronutrientes', screen: 'ScannerResultFood' },
        { icon: '🗃️', title: 'Historial alimentos',      sub: 'Escaneos anteriores',        screen: 'HistorialFood' },
      ]}
    />
  );
}
