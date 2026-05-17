import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function MedidasHistScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="📈" title="Historial de medidas" badge="RF10–RF11"
      items={[
        { icon: '📅', title: '10 Mar 2026', sub: '74.2 kg · 88/72/96 cm' },
        { icon: '📅', title: '25 Feb 2026', sub: '75.0 kg · 89/73/97 cm' },
        { icon: '📅', title: '10 Feb 2026', sub: '75.8 kg · 90/74/98 cm' },
      ]}
    />
  );
}
