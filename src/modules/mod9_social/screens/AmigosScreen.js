import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSocial } from '../context/SocialContext';
import { C, s } from '../styles/socialStyles';

const TABS = ['Todos', 'Amigos', 'Solicitudes'];
const REQUEST_FILTERS = ['Todas', 'Recibidas', 'Enviadas'];

function estadoConfig(estado) {
  if (estado === 'amigo') return { label: 'Amigo', color: C.green, bg: 'rgba(52,211,153,0.12)' };
  if (estado === 'recibida') return { label: 'Solicitud recibida', color: C.orange, bg: 'rgba(255,160,50,0.12)' };
  return { label: 'Solicitud enviada', color: C.teal, bg: 'rgba(94,234,212,0.10)' };
}

export default function AmigosScreen({ navigation, route }) {
  const {
    usuarios,
    amigos,
    solicitudesRecibidas,
    solicitudesEnviadas,
    cancelarSolicitud,
    aceptarSolicitud,
    rechazarSolicitud,
    eliminarAmistad,
  } = useSocial();
  const [busqueda, setBusqueda] = useState('');
  const [tab, setTab] = useState(route?.params?.tab === 'Solicitudes' ? 'Solicitudes' : 'Todos');
  const [requestFilter, setRequestFilter] = useState('Todas');

  const relaciones = useMemo(
    () => usuarios.filter(user => ['amigo', 'recibida', 'enviada'].includes(user.estado)),
    [usuarios],
  );

  const filtrados = useMemo(() => relaciones.filter(user => {
    const texto = `${user.nombre} ${user.codigo}`.toLowerCase();
    const coincide = !busqueda.trim() || texto.includes(busqueda.trim().toLowerCase());
    const coincideTab = tab === 'Todos'
      || (tab === 'Amigos' && user.estado === 'amigo')
      || (tab === 'Solicitudes' && ['recibida', 'enviada'].includes(user.estado));
    const coincideSolicitud = tab !== 'Solicitudes'
      || requestFilter === 'Todas'
      || (requestFilter === 'Recibidas' && user.estado === 'recibida')
      || (requestFilter === 'Enviadas' && user.estado === 'enviada');
    return coincide && coincideTab && coincideSolicitud;
  }), [relaciones, busqueda, tab, requestFilter]);

  function confirmarCancelacion(user) {
    Alert.alert(
      'Cancelar solicitud',
      `¿Quieres cancelar la solicitud enviada a ${user.nombre}?`,
      [
        { text: 'Conservar', style: 'cancel' },
        { text: 'Cancelar solicitud', style: 'destructive', onPress: () => cancelarSolicitud(user.id) },
      ],
    );
  }

  function confirmarEliminacion(user) {
    Alert.alert(
      'Eliminar amistad',
      `Tú y ${user.nombre} perderán acceso a comparaciones y rankings entre sí.`,
      [
        { text: 'Conservar amistad', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminarAmistad(user.id) },
      ],
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Amigos</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={s.hero}>
          <Text style={s.heroBadge}>GESTIÓN DE RELACIONES</Text>
          <Text style={s.heroTitle}>Amigos y solicitudes</Text>
          <Text style={s.heroSub}>Consulta amistades aceptadas y administra solicitudes enviadas o recibidas. Las nuevas personas se buscan desde Comunidad.</Text>
        </View>

        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statValue}>{amigos.length}</Text>
            <Text style={s.statLabel}>AMIGOS</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: C.orange }]}>{solicitudesRecibidas.length}</Text>
            <Text style={s.statLabel}>RECIBIDAS</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: C.teal }]}>{solicitudesEnviadas.length}</Text>
            <Text style={s.statLabel}>ENVIADAS</Text>
          </View>
        </View>

        <TextInput
          style={s.input}
          placeholder="Filtrar amigos o solicitudes..."
          placeholderTextColor={C.muted}
          value={busqueda}
          onChangeText={setBusqueda}
          autoCapitalize="none"
        />

        <View style={s.chips}>
          {TABS.map(item => (
            <TouchableOpacity key={item} onPress={() => setTab(item)} style={[s.chip, tab === item && s.chipOn]}>
              <Text style={[s.chipText, tab === item && s.chipTextOn]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'Solicitudes' ? (
          <View style={[s.chips, { marginTop: -4 }]}>
            {REQUEST_FILTERS.map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => setRequestFilter(item)}
                style={[
                  s.chip,
                  requestFilter === item && {
                    backgroundColor: item === 'Recibidas' ? 'rgba(255,160,50,0.14)' : item === 'Enviadas' ? 'rgba(94,234,212,0.12)' : 'rgba(124,111,205,0.18)',
                    borderColor: item === 'Recibidas' ? C.orange : item === 'Enviadas' ? C.teal : C.purple,
                  },
                ]}
              >
                <Text style={[s.chipText, requestFilter === item && { color: C.text }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {filtrados.map(user => {
          const status = estadoConfig(user.estado);
          return (
            <View key={user.id} style={s.userCard}>
              <View style={s.userTop}>
                <View style={{ position: 'relative' }}>
                  <View style={s.avatar}>
                    <Text style={s.avatarText}>{user.iniciales}</Text>
                  </View>
                  {user.online ? <View style={s.onlineDot} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.userName}>{user.nombre}</Text>
                  <Text style={s.userMeta}>{user.codigo} · {user.actividad}</Text>
                  <View style={[s.statusPill, { backgroundColor: status.bg }]}>
                    <Text style={[s.statusText, { color: status.color }]}>{status.label}</Text>
                  </View>
                </View>
              </View>

              {user.estado === 'amigo' && user.comparteProgreso ? (
                <View style={{ marginTop: 12, paddingTop: 11, borderTopWidth: 1, borderTopColor: C.border }}>
                  <View style={[s.row, { justifyContent: 'space-between', marginBottom: 7 }]}>
                    <Text style={{ color: C.sub, fontSize: 10, fontWeight: '800' }}>Progreso semanal compartido</Text>
                    <Text style={{ color: C.teal, fontSize: 10, fontWeight: '900' }}>{user.progreso}%</Text>
                  </View>
                  <View style={s.progressTrack}>
                    <View style={[s.progressFill, { width: `${user.progreso}%`, backgroundColor: C.teal }]} />
                  </View>
                  <View style={[s.row, { gap: 14, marginTop: 8 }]}>
                    <Text style={{ color: C.sub, fontSize: 10 }}>🔥 {user.racha} días</Text>
                    <Text style={{ color: C.sub, fontSize: 10 }}>🏋️ {user.sesionesSemana} sesiones</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Ranking')}>
                      <Text style={{ color: C.purple, fontSize: 10, fontWeight: '900' }}>Comparar →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              {user.estado === 'amigo' && !user.comparteProgreso ? (
                <View style={{ marginTop: 11, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border }}>
                  <Text style={{ color: C.muted, fontSize: 10 }}>🔒 Este usuario no comparte métricas de progreso.</Text>
                </View>
              ) : null}

              <View style={s.actionsRow}>
                {user.estado === 'enviada' ? (
                  <>
                    <View style={[s.secondaryBtn, { flex: 1 }]}>
                      <Text style={[s.secondaryBtnText, { color: C.teal }]}>⏳ Pendiente</Text>
                    </View>
                    <TouchableOpacity style={[s.secondaryBtn, s.dangerBtn]} onPress={() => confirmarCancelacion(user)}>
                      <Text style={[s.secondaryBtnText, s.dangerBtnText]}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                ) : null}

                {user.estado === 'recibida' ? (
                  <>
                    <TouchableOpacity style={[s.primaryBtn, s.successBtn, { flex: 1 }]} onPress={() => aceptarSolicitud(user.id)}>
                      <Text style={[s.primaryBtnText, s.successBtnText]}>✓ Aceptar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.secondaryBtn, s.dangerBtn, { flex: 1 }]} onPress={() => rechazarSolicitud(user.id)}>
                      <Text style={[s.secondaryBtnText, s.dangerBtnText]}>✕ Rechazar</Text>
                    </TouchableOpacity>
                  </>
                ) : null}

                {user.estado === 'amigo' ? (
                  <>
                    <TouchableOpacity style={[s.secondaryBtn, { flex: 1 }]} onPress={() => navigation.navigate('Ranking')}>
                      <Text style={s.secondaryBtnText}>📊 Ver comparativa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.secondaryBtn, s.dangerBtn]} onPress={() => confirmarEliminacion(user)}>
                      <Text style={[s.secondaryBtnText, s.dangerBtnText]}>Eliminar</Text>
                    </TouchableOpacity>
                  </>
                ) : null}
              </View>
            </View>
          );
        })}

        {filtrados.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>{tab === 'Amigos' ? '🤝' : '📨'}</Text>
            <Text style={s.emptyText}>No hay elementos en esta sección.</Text>
            <Text style={{ color: C.muted, fontSize: 10, marginTop: 5 }}>Cambia el filtro o limpia el texto de búsqueda.</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
