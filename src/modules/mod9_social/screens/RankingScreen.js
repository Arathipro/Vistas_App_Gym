import React from 'react';
import PlaceholderBase from '../../../shared/components/PlaceholderBase';

export default function RankingScreen({ navigation }) {
  return (
    <PlaceholderBase
      navigation={navigation}
      icon="🏆" title="Rankings" badge="RF70"
      backScreen="Home"
      items={[
        { icon: '🥇', title: 'Luis Torres',  sub: '28 sesiones este mes' },
        { icon: '🥈', title: 'María García', sub: '24 sesiones este mes' },
        { icon: '🥉', title: 'Tú',           sub: '20 sesiones este mes' },
      ]}
    />
  );
}
