import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSocial } from '../context/SocialContext';
import { C, s } from '../styles/socialStyles';

const FILTROS = [
  { id: 'todas', label: 'Todas' },
  { id: 'noLeidas', label: 'No leídas' },
  { id: 'solicitud', label: 'Solicitudes' },
  { id: 'actividad', label: 'Actividad' },
];

export default function NotificacionesScreen({ navigation }) {
  const {
    notificaciones,
    unreadCount,
    marcarNotificacion,
    marcarTodas,
    aceptarSolicitud,
    rechazarSolicitud,
  } = useSocial();
  const [filtro, setFiltro] = useState('todas');

  const items = useMemo(() => notificaciones.filter(item => {
    if (filtro === 'noLeidas') return item.unread;
    if (filtro === 'solicitud') return item.tipo === 'solicitud';
    if (filtro === 'actividad') return ['actividad', 'grupo', 'reto', 'logro'].includes(item.tipo);
    return true;
  }), [notificaciones, filtro]);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Notificaciones</Text>
        <TouchableOpacity onPress={marcarTodas} style={s.headerAction} disabled={unreadCount === 0}>
          <Text style={[s.headerActionText, unreadCount === 0 && { color: C.muted }]}>Leer todas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.heroBadge}>RF62 · RF63 · RF72</Text>
              <Text style={s.heroTitle}>Centro de actividad</Text>
              <Text style={s.heroSub}>Solicitudes, retos, logros y avisos de entrenamiento de amigos y grupos.</Text>
            </View>
            <View style={[s.heroIcon, { backgroundColor: 'rgba(52,211,153,0.11)', borderColor: 'rgba(52,211,153,0.32)' }]}>
              <Text style={{ fontSize: 30 }}>🔔</Text>
            </View>
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statValue}>{notificaciones.length}</Text>
            <Text style={s.statLabel}>TOTAL</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: C.teal }]}>{unreadCount}</Text>
            <Text style={s.statLabel}>NO LEÍDAS</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: C.orange }]}>{notificaciones.filter(item => item.tipo === 'solicitud').length}</Text>
            <Text style={s.statLabel}>SOLICITUDES</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingRight: 18 }} style={{ marginRight: -18, marginBottom: 13 }}>
          {FILTROS.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setFiltro(item.id)}
              style={[
                s.secondaryBtn,
                { minWidth: 88, paddingVertical: 8 },
                filtro === item.id && { backgroundColor: 'rgba(124,111,205,0.20)', borderColor: C.purple },
              ]}
            >
              <Text style={[s.secondaryBtnText, filtro === item.id && { color: C.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[s.notificationCard, item.unread && s.notificationUnread]}
            onPress={() => marcarNotificacion(item.id)}
            activeOpacity={0.78}
          >
            <View style={[s.iconBox, { width: 44, height: 44 }]}>
              <Text style={{ fontSize: 21 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={[s.row, { gap: 8, alignItems: 'flex-start' }]}>
                <Text style={[s.notificationTitle, { flex: 1 }]}>{item.titulo}</Text>
                {item.unread ? <View style={s.unreadDot} /> : null}
              </View>
              <Text style={s.notificationSub}>{item.detalle}</Text>
              <Text style={s.notificationTime}>{item.tiempo}</Text>

              {item.tipo === 'solicitud' && item.userId ? (
                <View style={s.actionsRow}>
                  <TouchableOpacity
                    style={[s.primaryBtn, s.successBtn, { flex: 1 }]}
                    onPress={() => aceptarSolicitud(item.userId)}
                  >
                    <Text style={[s.primaryBtnText, s.successBtnText]}>✓ Aceptar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.secondaryBtn, s.dangerBtn, { flex: 1 }]}
                    onPress={() => rechazarSolicitud(item.userId)}
                  >
                    <Text style={[s.secondaryBtnText, s.dangerBtnText]}>✕ Rechazar</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {item.tipo === 'reto' ? (
                <TouchableOpacity style={[s.secondaryBtn, { alignSelf: 'flex-start', marginTop: 10 }]} onPress={() => navigation.navigate('Ranking')}>
                  <Text style={[s.secondaryBtnText, { color: C.orange }]}>Ver reto →</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </TouchableOpacity>
        ))}

        {items.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>✅</Text>
            <Text style={s.emptyText}>No hay notificaciones en este filtro.</Text>
            <Text style={{ color: C.muted, fontSize: 10, marginTop: 5 }}>Todo está al día.</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
