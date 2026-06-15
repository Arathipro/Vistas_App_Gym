import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SOCIAL_ACTIVITY } from '../data/socialMock';
import { useSocial } from '../context/SocialContext';
import { C, s } from '../styles/socialStyles';

const NAV_ITEMS = [
  { icon: '🤝', title: 'Amigos', sub: 'Gestiona amistades y solicitudes enviadas o recibidas', screen: 'Amigos', color: C.purple },
  { icon: '👥', title: 'Grupos', sub: 'Participa en retos medibles y rankings por comunidad', screen: 'Grupos', color: C.teal },
  { icon: '🏆', title: 'Ranking', sub: 'Compara sesiones, días activos y rachas', screen: 'Ranking', color: C.orange },
  { icon: '🔒', title: 'Privacidad', sub: 'Controla las métricas que compartes', screen: 'Privacidad', color: C.red },
];

export default function SocialScreen({ navigation }) {
  const {
    amigos,
    solicitudesRecibidas,
    misGrupos,
    unreadCount,
  } = useSocial();

  const amigosActivos = amigos.filter(item => item.online);
  const miPosicion = 3;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Comunidad</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notificaciones')} style={s.headerAction}>
          <Text style={{ fontSize: 18 }}>🔔</Text>
          {unreadCount > 0 ? (
            <View style={s.bellDot}>
              <Text style={s.bellDotText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={[s.hero, s.cardAccent]}>
          <View style={s.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.heroBadge}>MÓDULO 9 · RF58–RF72</Text>
              <Text style={s.heroTitle}>Tu comunidad fitness</Text>
              <Text style={s.heroSub}>Conecta, comparte avances permitidos y participa en retos que la aplicación puede medir.</Text>
            </View>
            <View style={s.heroIcon}>
              <Text style={{ fontSize: 31 }}>👥</Text>
            </View>
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statValue}>{amigos.length}</Text>
            <Text style={s.statLabel}>AMIGOS</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: C.green }]}>{amigosActivos.length}</Text>
            <Text style={s.statLabel}>ACTIVOS</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: C.teal }]}>{misGrupos.length}</Text>
            <Text style={s.statLabel}>GRUPOS</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: C.orange }]}>#{miPosicion}</Text>
            <Text style={s.statLabel}>RANKING</Text>
          </View>
        </View>

        {solicitudesRecibidas.length > 0 ? (
          <TouchableOpacity style={[s.card, { backgroundColor: 'rgba(255,160,50,0.10)', borderColor: 'rgba(255,160,50,0.34)' }]} onPress={() => navigation.navigate('Amigos', { tab: 'Solicitudes' })}>
            <View style={[s.row, { gap: 11 }]}>
              <View style={[s.iconBox, { backgroundColor: 'rgba(255,160,50,0.15)', borderColor: 'rgba(255,160,50,0.35)' }]}>
                <Text style={{ fontSize: 22 }}>🤝</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.navTitle}>{solicitudesRecibidas.length} solicitud pendiente</Text>
                <Text style={s.navSub}>Acéptala o recházala desde el gestor de Amigos.</Text>
              </View>
              <Text style={[s.arrow, { color: C.orange }]}>›</Text>
            </View>
          </TouchableOpacity>
        ) : null}

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Amigos activos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Amigos')}>
            <Text style={s.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontalContent} style={{ marginRight: -18, marginBottom: 16 }}>
          {amigosActivos.map(friend => (
            <TouchableOpacity key={friend.id} style={s.activeFriend} onPress={() => navigation.navigate('Amigos')}>
              <View style={{ alignSelf: 'flex-start', position: 'relative' }}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{friend.iniciales}</Text>
                </View>
                <View style={s.onlineDot} />
              </View>
              <Text style={s.friendName} numberOfLines={1}>{friend.nombre.split(' ')[0]}</Text>
              <Text style={s.friendMeta} numberOfLines={2}>{friend.actividad}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[s.activeFriend, { borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' }]} onPress={() => navigation.navigate('BuscarAmigos')}>
            <Text style={{ color: C.purple, fontSize: 27, fontWeight: '900' }}>＋</Text>
            <Text style={[s.friendName, { textAlign: 'center' }]}>Buscar amigos</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Explorar comunidad</Text>
        </View>

        {NAV_ITEMS.map(item => (
          <TouchableOpacity key={item.screen} style={s.card} onPress={() => navigation.navigate(item.screen)} activeOpacity={0.76}>
            <View style={[s.row, { gap: 12 }]}>
              <View style={[s.iconBox, { backgroundColor: `${item.color}1F`, borderColor: `${item.color}55` }]}>
                <Text style={{ fontSize: 22 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.navTitle}>{item.title}</Text>
                <Text style={s.navSub}>{item.sub}</Text>
              </View>
              <Text style={s.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Actividad reciente</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notificaciones')}>
            <Text style={s.sectionLink}>Notificaciones</Text>
          </TouchableOpacity>
        </View>

        <View style={s.card}>
          {SOCIAL_ACTIVITY.map((item, index) => (
            <View key={item.id} style={[s.activityRow, index === 0 && { borderTopWidth: 0, paddingTop: 0 }]}>
              <View style={[s.iconBox, { width: 38, height: 38, borderRadius: 12, backgroundColor: `${item.color}1C`, borderColor: `${item.color}45` }]}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.activityTitle}><Text style={{ fontWeight: '900' }}>{item.nombre}</Text> {item.texto}</Text>
                <Text style={s.activityTime}>{item.tiempo}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[s.card, { backgroundColor: 'rgba(52,211,153,0.09)', borderColor: 'rgba(52,211,153,0.30)' }]} onPress={() => navigation.navigate('Grupos')}>
          <View style={[s.row, { gap: 12 }]}>
            <Text style={{ fontSize: 30 }}>🎯</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.navTitle}>Reto de grupo: 3 sesiones</Text>
              <Text style={s.navSub}>Completaste la meta semanal de Gym DPUAS y ocupas el tercer lugar.</Text>
              <View style={[s.progressTrack, { marginTop: 10 }]}>
                <View style={[s.progressFill, { width: '100%', backgroundColor: C.green }]} />
              </View>
            </View>
            <Text style={[s.arrow, { color: C.green }]}>›</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
