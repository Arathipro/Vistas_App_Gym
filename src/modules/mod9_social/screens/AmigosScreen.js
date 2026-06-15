import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSocial } from '../context/SocialContext';
import { C, s } from '../styles/socialStyles';

const TABS = ['Todos', 'Amigos', 'Solicitudes', 'Buscar'];

function estadoConfig(estado) {
  if (estado === 'amigo') return { label: 'Amigo', color: C.green, bg: 'rgba(52,211,153,0.12)' };
  if (estado === 'recibida') return { label: 'Solicitud recibida', color: C.orange, bg: 'rgba(255,160,50,0.12)' };
  if (estado === 'enviada') return { label: 'Solicitud enviada', color: C.teal, bg: 'rgba(94,234,212,0.10)' };
  return { label: 'Disponible', color: C.sub, bg: C.surface };
}

export default function AmigosScreen({ navigation }) {
  const {
    usuarios,
    amigos,
    solicitudesRecibidas,
    solicitudesEnviadas,
    enviarSolicitud,
    cancelarSolicitud,
    aceptarSolicitud,
    rechazarSolicitud,
    eliminarAmistad,
  } = useSocial();
  const [busqueda, setBusqueda] = useState('');
  const [tab, setTab] = useState('Todos');

  const filtrados = useMemo(() => usuarios.filter(user => {
    const texto = `${user.nombre} ${user.codigo}`.toLowerCase();
    const coincide = !busqueda.trim() || texto.includes(busqueda.trim().toLowerCase());
    const coincideTab = tab === 'Todos'
      || (tab === 'Amigos' && user.estado === 'amigo')
      || (tab === 'Solicitudes' && ['recibida', 'enviada'].includes(user.estado))
      || (tab === 'Buscar' && user.estado === 'disponible');
    return coincide && coincideTab;
  }), [usuarios, busqueda, tab]);

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
          <Text style={s.heroBadge}>RF58–RF66</Text>
          <Text style={s.heroTitle}>Conexiones y solicitudes</Text>
          <Text style={s.heroSub}>Busca por nombre o código único, administra solicitudes y controla tus amistades.</Text>
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
          placeholder="Buscar nombre o código de amigo..."
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

        {filtrados.map(user => {
          const status = estadoConfig(user.estado);
          return (
            <View key={user.id} style={s.userCard}>
              <View style={s.userTop}>
                <View style={{ position: 'relative' }}>
                  <View style={[s.avatar, user.estado === 'disponible' && { backgroundColor: C.soft }]}>
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
                {user.estado === 'disponible' ? (
                  <TouchableOpacity style={[s.primaryBtn, { flex: 1 }]} onPress={() => enviarSolicitud(user.id)}>
                    <Text style={s.primaryBtnText}>＋ Agregar amigo</Text>
                  </TouchableOpacity>
                ) : null}

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
            <Text style={s.emptyIcon}>🔍</Text>
            <Text style={s.emptyText}>No encontramos usuarios en esta sección.</Text>
            <Text style={{ color: C.muted, fontSize: 10, marginTop: 5 }}>Prueba otro nombre, código o filtro.</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
