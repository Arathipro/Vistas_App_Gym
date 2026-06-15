import React, { useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSocial } from '../context/SocialContext';
import { C, s } from '../styles/socialStyles';

export default function GruposScreen({ navigation }) {
  const {
    grupos,
    misGrupos,
    crearGrupo,
    unirseGrupo,
    salirGrupo,
    notificarEntrenamiento,
  } = useSocial();
  const [tab, setTab] = useState('Mis grupos');
  const [grupoAbierto, setGrupoAbierto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const visibles = useMemo(
    () => tab === 'Mis grupos' ? grupos.filter(item => item.joined) : grupos.filter(item => !item.joined),
    [grupos, tab],
  );

  function guardarGrupo() {
    if (!nombre.trim()) {
      Alert.alert('Nombre requerido', 'Escribe un nombre para crear el grupo.');
      return;
    }
    const id = crearGrupo(nombre, descripcion);
    setNombre('');
    setDescripcion('');
    setModalVisible(false);
    setTab('Mis grupos');
    setGrupoAbierto(id);
  }

  function confirmarSalida(group) {
    Alert.alert(
      'Salir del grupo',
      `Dejarás de recibir avisos y actividad de ${group.nombre}.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: () => salirGrupo(group.id) },
      ],
    );
  }

  function compartirActividad(group) {
    notificarEntrenamiento(group.id);
    Alert.alert('Actividad compartida', `Se notificó a ${group.nombre} que comenzaste a entrenar.`);
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Grupos</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={s.headerAction}>
          <Text style={{ color: C.teal, fontSize: 21, fontWeight: '900' }}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.heroBadge}>RF71 · RF72</Text>
              <Text style={s.heroTitle}>Entrena acompañado</Text>
              <Text style={s.heroSub}>Crea grupos, explora comunidades y comparte el inicio de tus entrenamientos.</Text>
            </View>
            <View style={[s.heroIcon, { backgroundColor: 'rgba(94,234,212,0.12)', borderColor: 'rgba(94,234,212,0.32)' }]}>
              <Text style={{ fontSize: 30 }}>👥</Text>
            </View>
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statValue}>{misGrupos.length}</Text>
            <Text style={s.statLabel}>MIS GRUPOS</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: C.teal }]}>{misGrupos.reduce((total, item) => total + item.miembros, 0)}</Text>
            <Text style={s.statLabel}>CONEXIONES</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: C.orange }]}>2</Text>
            <Text style={s.statLabel}>RETOS ACTIVOS</Text>
          </View>
        </View>

        <View style={s.periodToggle}>
          {['Mis grupos', 'Explorar'].map(item => (
            <TouchableOpacity key={item} onPress={() => setTab(item)} style={[s.periodBtn, tab === item && s.periodBtnOn]}>
              <Text style={[s.periodText, tab === item && { color: C.teal }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{tab}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={s.sectionLink}>＋ Crear grupo</Text>
          </TouchableOpacity>
        </View>

        {visibles.map(group => {
          const open = grupoAbierto === group.id;
          return (
            <View key={group.id} style={[s.groupCard, open && { borderColor: `${group.color}88` }]}>
              <TouchableOpacity style={s.groupMain} onPress={() => setGrupoAbierto(open ? null : group.id)} activeOpacity={0.78}>
                <View style={[s.iconBox, { width: 49, height: 49, backgroundColor: `${group.color}1E`, borderColor: `${group.color}55` }]}>
                  <Text style={{ fontSize: 23 }}>{group.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={[s.row, { justifyContent: 'space-between', gap: 8 }]}>
                    <Text style={[s.groupTitle, { flex: 1 }]}>{group.nombre}</Text>
                    <View style={[s.infoPill, { backgroundColor: group.joined ? 'rgba(52,211,153,0.10)' : C.surface }]}>
                      <Text style={[s.infoPillText, { color: group.joined ? C.green : C.sub }]}>{group.joined ? 'MIEMBRO' : 'ABIERTO'}</Text>
                    </View>
                  </View>
                  <Text style={s.groupMeta}>{group.miembros} miembros · {group.meta}</Text>
                  <Text style={s.groupDescription} numberOfLines={open ? undefined : 2}>{group.descripcion}</Text>
                  <View style={[s.row, { justifyContent: 'space-between', marginTop: 10 }]}>
                    <View style={s.miniAvatars}>
                      {group.miembrosPreview.map((member, index) => (
                        <View key={`${member}-${index}`} style={[s.miniAvatar, { backgroundColor: index === 0 ? group.color : C.purple }]}>
                          <Text style={s.miniAvatarText}>{member}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={{ color: C.muted, fontSize: 10, fontWeight: '900' }}>{open ? 'Ocultar ▲' : 'Ver detalle ▼'}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {open ? (
                <View style={s.groupDetails}>
                  <Text style={s.sectionLabel}>OBJETIVO DEL GRUPO</Text>
                  <Text style={{ color: C.text, fontSize: 12, fontWeight: '800', marginTop: 6 }}>{group.objetivo}</Text>
                  <View style={[s.row, { justifyContent: 'space-between', marginTop: 10, marginBottom: 6 }]}>
                    <Text style={{ color: C.sub, fontSize: 10 }}>Progreso colectivo</Text>
                    <Text style={{ color: group.color, fontSize: 10, fontWeight: '900' }}>{group.progreso}%</Text>
                  </View>
                  <View style={s.progressTrack}>
                    <View style={[s.progressFill, { width: `${group.progreso}%`, backgroundColor: group.color }]} />
                  </View>

                  <Text style={[s.sectionLabel, { marginTop: 15, marginBottom: 4 }]}>ACTIVIDAD RECIENTE</Text>
                  {group.actividad.map((activity, index) => (
                    <View key={`${activity}-${index}`} style={[s.row, { gap: 8, paddingVertical: 7 }]}>
                      <Text style={{ fontSize: 13 }}>•</Text>
                      <Text style={{ color: C.sub, fontSize: 10, lineHeight: 15, flex: 1 }}>{activity}</Text>
                    </View>
                  ))}

                  <View style={s.actionsRow}>
                    {group.joined ? (
                      <>
                        <TouchableOpacity style={[s.primaryBtn, { flex: 1, backgroundColor: group.color }]} onPress={() => compartirActividad(group)}>
                          <Text style={s.primaryBtnText}>🏋️ Avisar que entreno</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.secondaryBtn, s.dangerBtn]} onPress={() => confirmarSalida(group)}>
                          <Text style={[s.secondaryBtnText, s.dangerBtnText]}>Salir</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity style={[s.primaryBtn, { flex: 1, backgroundColor: group.color }]} onPress={() => unirseGrupo(group.id)}>
                        <Text style={s.primaryBtnText}>＋ Unirme al grupo</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}

        {visibles.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>👥</Text>
            <Text style={s.emptyText}>{tab === 'Mis grupos' ? 'Todavía no perteneces a grupos.' : 'No hay grupos nuevos para explorar.'}</Text>
          </View>
        ) : null}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Crear grupo</Text>
            <Text style={s.modalSub}>Crea un espacio para tus amigos. Por ahora se guardará como dato demo local.</Text>
            <TextInput
              style={s.input}
              placeholder="Nombre del grupo"
              placeholderTextColor={C.muted}
              value={nombre}
              onChangeText={setNombre}
              maxLength={40}
            />
            <TextInput
              style={[s.input, { minHeight: 82, textAlignVertical: 'top' }]}
              placeholder="Descripción u objetivo (opcional)"
              placeholderTextColor={C.muted}
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              maxLength={140}
            />
            <View style={s.actionsRow}>
              <TouchableOpacity style={[s.secondaryBtn, { flex: 1 }]} onPress={() => setModalVisible(false)}>
                <Text style={s.secondaryBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.primaryBtn, { flex: 1, opacity: nombre.trim() ? 1 : 0.45 }]} onPress={guardarGrupo}>
                <Text style={s.primaryBtnText}>Crear grupo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
