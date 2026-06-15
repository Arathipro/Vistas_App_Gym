import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSocial } from '../context/SocialContext';
import { C, s } from '../styles/socialStyles';

export default function BuscarAmigosScreen({ navigation }) {
  const {
    usuarios,
    solicitudesEnviadas,
    enviarSolicitud,
    cancelarSolicitud,
  } = useSocial();
  const [busqueda, setBusqueda] = useState('');

  const candidatos = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    const disponibles = usuarios.filter(user => ['disponible', 'enviada'].includes(user.estado));

    if (!texto) return disponibles;
    return disponibles.filter(user => `${user.nombre} ${user.codigo}`.toLowerCase().includes(texto));
  }, [usuarios, busqueda]);

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

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Buscar amigos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Amigos', { tab: 'Solicitudes' })} style={s.headerAction}>
          <Text style={s.headerActionText}>Solicitudes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={s.hero}>
          <View style={s.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.heroBadge}>DESCUBRIR PERSONAS</Text>
              <Text style={s.heroTitle}>Encuentra nuevos compañeros</Text>
              <Text style={s.heroSub}>Busca por nombre o código de amigo y envía una solicitud. La gestión posterior se realiza desde Amigos.</Text>
            </View>
            <View style={s.heroIcon}>
              <Text style={{ fontSize: 30 }}>🔎</Text>
            </View>
          </View>
        </View>

        <TextInput
          style={s.input}
          placeholder="Nombre o código, por ejemplo SOF-341"
          placeholderTextColor={C.muted}
          value={busqueda}
          onChangeText={setBusqueda}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[s.card, { backgroundColor: 'rgba(124,111,205,0.11)', borderColor: 'rgba(124,111,205,0.34)' }]}
          onPress={() => navigation.navigate('Amigos', { tab: 'Solicitudes' })}
        >
          <View style={[s.row, { gap: 11 }]}>
            <View style={s.iconBox}>
              <Text style={{ fontSize: 21 }}>📨</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.navTitle}>Gestionar solicitudes</Text>
              <Text style={s.navSub}>{solicitudesEnviadas.length} enviada{solicitudesEnviadas.length === 1 ? '' : 's'} actualmente · revisa también las recibidas.</Text>
            </View>
            <Text style={s.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{busqueda.trim() ? 'Resultados' : 'Sugerencias para ti'}</Text>
          <Text style={s.sectionLabel}>{candidatos.length} PERSONAS</Text>
        </View>

        {candidatos.map(user => (
          <View key={user.id} style={s.userCard}>
            <View style={s.userTop}>
              <View style={{ position: 'relative' }}>
                <View style={[s.avatar, { backgroundColor: user.estado === 'enviada' ? C.teal : C.purple }]}>
                  <Text style={s.avatarText}>{user.iniciales}</Text>
                </View>
                {user.online ? <View style={s.onlineDot} /> : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.userName}>{user.nombre}</Text>
                <Text style={s.userMeta}>{user.codigo} · {user.actividad}</Text>
                <View style={[s.statusPill, { backgroundColor: user.estado === 'enviada' ? 'rgba(94,234,212,0.10)' : C.surface }]}>
                  <Text style={[s.statusText, { color: user.estado === 'enviada' ? C.teal : C.sub }]}>
                    {user.estado === 'enviada' ? 'Solicitud enviada' : 'Sugerencia disponible'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={s.actionsRow}>
              {user.estado === 'disponible' ? (
                <TouchableOpacity style={[s.primaryBtn, { flex: 1 }]} onPress={() => enviarSolicitud(user.id)}>
                  <Text style={s.primaryBtnText}>＋ Enviar solicitud</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <View style={[s.secondaryBtn, { flex: 1 }]}>
                    <Text style={[s.secondaryBtnText, { color: C.teal }]}>⏳ Pendiente</Text>
                  </View>
                  <TouchableOpacity style={[s.secondaryBtn, s.dangerBtn]} onPress={() => confirmarCancelacion(user)}>
                    <Text style={[s.secondaryBtnText, s.dangerBtnText]}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))}

        {candidatos.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>🔍</Text>
            <Text style={s.emptyText}>No encontramos personas con ese dato.</Text>
            <Text style={{ color: C.muted, fontSize: 10, marginTop: 5 }}>Comprueba el nombre o código de amigo.</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
