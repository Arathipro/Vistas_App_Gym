import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function ScannerResultFoodScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🍎" title="Resultado Alimento" badge="RF47–RF48"
      items={[
        { icon: '🍎', title: 'Manzana mediana',      sub: 'Identificado con 89% confianza' },
        { icon: '🔥', title: '95 kcal aprox.',       sub: '⚠️ Margen de error ±20-30% (RF48)' },
        { icon: '🥩', title: 'Proteínas: 0.5g',     sub: 'Macronutriente' },
        { icon: '🌾', title: 'Carbohidratos: 25g',  sub: 'Macronutriente' },
        { icon: '🧈', title: 'Grasas: 0.3g',        sub: 'Macronutriente' },
      ]}
    />
  );
}
