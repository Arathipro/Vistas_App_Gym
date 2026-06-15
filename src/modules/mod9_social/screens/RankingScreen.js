import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SOCIAL_RANKINGS } from '../data/socialMock';
import { C, s } from '../styles/socialStyles';

const METRICAS = [
  { id: 'sesiones', label: 'Sesiones', icon: '🏋️' },
  { id: 'puntos', label: 'Puntos', icon: '⚡' },
  { id: 'racha', label: 'Racha', icon: '🔥' },
];
const MEDALS = ['🥇', '🥈', '🥉'];

export default function RankingScreen({ navigation }) {
  const [periodo, setPeriodo] = useState('semanal');
  const [metrica, setMetrica] = useState('sesiones');

  const ranking = SOCIAL_RANKINGS[periodo][metrica];
  const currentIndex = ranking.findIndex(item => item.id === 0);
  const current = ranking[currentIndex];
  const leader = ranking[0];
  const max = Math.max(...ranking.map(item => item.valor), 1);
  const diferencia = Math.max(0, leader.valor - current.valor);

  const mensaje = useMemo(() => {
    if (currentIndex === 0) return '¡Vas liderando! Mantén la constancia sin convertirlo en una competencia negativa.';
    if (metrica === 'sesiones') return `Estás a ${diferencia} sesión${diferencia === 1 ? '' : 'es'} del primer lugar.`;
    if (metrica === 'puntos') return `Te separan ${diferencia.toLocaleString()} puntos del primer lugar.`;
    return `Estás a ${diferencia} día${diferencia === 1 ? '' : 's'} de la mejor racha.`;
  }, [currentIndex, diferencia, metrica]);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Ranking</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={[s.hero, s.rankingHero]}>
          <View style={s.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={[s.heroBadge, { color: C.orange }]}>RF69 · RF70</Text>
              <Text style={s.heroTitle}>Competencia amistosa</Text>
              <Text style={s.heroSub}>Compara métricas compartidas por tus amigos durante la semana o el mes.</Text>
            </View>
            <View style={[s.heroIcon, { backgroundColor: 'rgba(255,160,50,0.13)', borderColor: 'rgba(255,160,50,0.35)' }]}>
              <Text style={{ fontSize: 31 }}>🏆</Text>
            </View>
          </View>
        </View>

        <View style={s.periodToggle}>
          {['semanal', 'mensual'].map(item => (
            <TouchableOpacity key={item} onPress={() => setPeriodo(item)} style={[s.periodBtn, periodo === item && s.periodBtnOn]}>
              <Text style={[s.periodText, periodo === item && s.periodTextOn]}>{item === 'semanal' ? 'Esta semana' : 'Este mes'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.chips}>
          {METRICAS.map(item => (
            <TouchableOpacity key={item.id} onPress={() => setMetrica(item.id)} style={[s.chip, metrica === item.id && { backgroundColor: 'rgba(255,160,50,0.16)', borderColor: C.orange }]}>
              <Text style={[s.chipText, metrica === item.id && { color: C.orange }]}>{item.icon} {item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[s.card, { paddingTop: 17 }]}>
          <View style={[s.row, { justifyContent: 'space-between', marginBottom: 13 }]}>
            <View>
              <Text style={s.sectionTitle}>Clasificación {periodo}</Text>
              <Text style={{ color: C.sub, fontSize: 10, marginTop: 3 }}>{METRICAS.find(item => item.id === metrica)?.label} entre amigos</Text>
            </View>
            <View style={[s.infoPill, { backgroundColor: 'rgba(255,160,50,0.12)' }]}>
              <Text style={[s.infoPillText, { color: C.orange }]}>TU POSICIÓN #{currentIndex + 1}</Text>
            </View>
          </View>

          {ranking.map((item, index) => {
            const isMe = item.id === 0;
            return (
              <View key={item.id} style={[s.rankRow, index === 0 && { borderTopWidth: 0 }, isMe && s.rankMe]}>
                <Text style={s.rankPos}>{MEDALS[index] || `#${index + 1}`}</Text>
                <View style={[s.avatar, s.avatarSmall, { backgroundColor: isMe ? C.purple : C.soft }]}>
                  <Text style={[s.avatarText, { fontSize: 10 }]}>{item.iniciales}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={s.row}>
                    <Text style={s.rankName}>{item.nombre}</Text>
                    {isMe ? <Text style={{ color: C.purple, fontSize: 9, fontWeight: '900' }}>  · TÚ</Text> : null}
                  </View>
                  <Text style={s.rankExtra}>{item.extra}</Text>
                  <View style={[s.progressTrack, { marginTop: 7, height: 5 }]}>
                    <View style={[s.progressFill, { width: `${Math.max(8, (item.valor / max) * 100)}%`, backgroundColor: isMe ? C.purple : index === 0 ? C.orange : C.teal }]} />
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end', maxWidth: 82 }}>
                  <Text style={s.rankValue}>{item.display}</Text>
                  <Text style={[{ fontSize: 9, fontWeight: '900', marginTop: 4 }, item.tendencia.startsWith('+') ? s.trendUp : { color: C.muted }]}>
                    {item.tendencia === '—' ? 'sin cambio' : `${item.tendencia} posición`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={[s.card, s.compareBox]}>
          <Text style={s.sectionTitle}>Tú vs líder</Text>
          <Text style={{ color: C.sub, fontSize: 10, marginTop: 4, marginBottom: 14 }}>{mensaje}</Text>
          <View style={[s.row, { gap: 9 }]}>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 13, padding: 12 }}>
              <Text style={{ color: C.purple, fontSize: 10, fontWeight: '900' }}>TÚ · #{currentIndex + 1}</Text>
              <Text style={{ color: C.text, fontSize: 16, fontWeight: '900', marginTop: 5 }}>{current.display}</Text>
            </View>
            <Text style={{ color: C.teal, fontSize: 11, fontWeight: '900' }}>VS</Text>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 13, padding: 12 }}>
              <Text style={{ color: C.orange, fontSize: 10, fontWeight: '900' }}>LÍDER · #1</Text>
              <Text style={{ color: C.text, fontSize: 16, fontWeight: '900', marginTop: 5 }}>{leader.display}</Text>
            </View>
          </View>
        </View>

        <View style={[s.card, s.warning]}>
          <Text style={s.warningTitle}>🔒 Comparación con privacidad</Text>
          <Text style={s.warningText}>Solo aparecen métricas que cada amigo autorizó compartir. Las notas de entrenamiento nunca forman parte del ranking.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
