import React, { useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GROUP_CHALLENGE_TYPES } from '../data/socialMock';
import { useSocial } from '../context/SocialContext';
import { C, s } from '../styles/socialStyles';

const MEDALS = ['🥇', '🥈', '🥉'];

function createForm() {
  const type = GROUP_CHALLENGE_TYPES[0];
  return {
    mode: 'create',
    groupId: null,
    nombre: '',
    descripcion: '',
    reglas: '',
    tipo: type.id,
    meta: String(type.defaultGoal),
    periodo: type.periods[0],
  };
}

export default function GruposScreen({ navigation }) {
  const {
    grupos,
    misGrupos,
    crearGrupo,
    actualizarDatosGrupo,
    actualizarRetoGrupo,
    unirseGrupo,
    salirGrupo,
    notificarEntrenamiento,
  } = useSocial();
  const [tab, setTab] = useState('Mis grupos');
  const [grupoAbierto, setGrupoAbierto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(createForm());

  const visibles = useMemo(
    () => tab === 'Mis grupos' ? grupos.filter(item => item.joined) : grupos.filter(item => !item.joined),
    [grupos, tab],
  );
  const selectedType = GROUP_CHALLENGE_TYPES.find(item => item.id === form.tipo) || GROUP_CHALLENGE_TYPES[0];

  function abrirCrear() {
    setForm(createForm());
    setModalVisible(true);
  }

  function abrirEditarDatos(group) {
    setForm({
      mode: 'group',
      groupId: group.id,
      nombre: group.nombre,
      descripcion: group.descripcion || '',
      reglas: group.reglas || '',
      tipo: group.reto.tipo,
      meta: String(group.reto.meta),
      periodo: group.reto.periodo,
    });
    setModalVisible(true);
  }

  function abrirEditarReto(group) {
    setForm({
      mode: 'challenge',
      groupId: group.id,
      nombre: group.nombre,
      descripcion: group.descripcion || '',
      reglas: group.reglas || '',
      tipo: group.reto.tipo,
      meta: String(group.reto.meta),
      periodo: group.reto.periodo,
    });
    setModalVisible(true);
  }

  function cambiarTipo(tipoId) {
    const type = GROUP_CHALLENGE_TYPES.find(item => item.id === tipoId) || GROUP_CHALLENGE_TYPES[0];
    setForm(prev => ({
      ...prev,
      tipo: type.id,
      meta: String(type.defaultGoal),
      periodo: type.periods[0],
    }));
  }

  function guardar() {
    if (form.mode === 'group') {
      if (!form.nombre.trim()) {
        Alert.alert('Nombre requerido', 'El grupo debe conservar un nombre.');
        return;
      }
      const saved = actualizarDatosGrupo(form.groupId, {
        nombre: form.nombre,
        descripcion: form.descripcion,
        reglas: form.reglas,
      });
      if (!saved) {
        Alert.alert('No autorizado', 'Solo el administrador puede editar la información del grupo.');
        return;
      }
      setModalVisible(false);
      return;
    }

    const metaNumerica = Number(form.meta);
    if (form.mode === 'create' && !form.nombre.trim()) {
      Alert.alert('Nombre requerido', 'Escribe un nombre para crear el grupo.');
      return;
    }
    if (!Number.isFinite(metaNumerica) || metaNumerica <= 0) {
      Alert.alert('Meta inválida', 'La meta del reto debe ser un número mayor que cero.');
      return;
    }

    const retoConfig = { tipo: form.tipo, meta: metaNumerica, periodo: form.periodo };
    if (form.mode === 'challenge') {
      actualizarRetoGrupo(form.groupId, retoConfig);
      setGrupoAbierto(form.groupId);
    } else {
      const id = crearGrupo(form.nombre, form.descripcion, form.reglas, retoConfig);
      setTab('Mis grupos');
      setGrupoAbierto(id);
    }
    setModalVisible(false);
  }

  function confirmarSalida(group) {
    Alert.alert(
      'Salir del grupo',
      `Dejarás de participar en el reto y ranking de ${group.nombre}.`,
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

  const modalTitle = form.mode === 'create'
    ? 'Crear grupo con reto'
    : form.mode === 'group'
      ? 'Editar información del grupo'
      : 'Actualizar reto del grupo';

  const modalDescription = form.mode === 'create'
    ? 'Define la comunidad, sus reglas y un objetivo que la aplicación pueda comprobar.'
    : form.mode === 'group'
      ? 'Actualiza el nombre, descripción o reglas. El reto y su progreso no se modificarán.'
      : 'Al cambiar el reto, el progreso y ranking del ciclo actual se reiniciarán.';

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Grupos y retos</Text>
        <TouchableOpacity onPress={abrirCrear} style={s.headerAction}>
          <Text style={{ color: C.teal, fontSize: 21, fontWeight: '900' }}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.heroBadge}>COMUNIDADES CON OBJETIVO</Text>
              <Text style={s.heroTitle}>Retos que la app sí puede medir</Text>
              <Text style={s.heroSub}>Cada grupo define información, reglas, una meta y un ranking específico basado en el historial real.</Text>
            </View>
            <View style={[s.heroIcon, { backgroundColor: 'rgba(94,234,212,0.12)', borderColor: 'rgba(94,234,212,0.32)' }]}>
              <Text style={{ fontSize: 30 }}>🎯</Text>
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
            <Text style={[s.statValue, { color: C.orange }]}>{misGrupos.filter(item => item.reto).length}</Text>
            <Text style={s.statLabel}>RETOS ACTIVOS</Text>
          </View>
        </View>

        <View style={[s.card, { backgroundColor: 'rgba(96,165,250,0.08)', borderColor: 'rgba(96,165,250,0.28)' }]}>
          <Text style={{ color: C.blue, fontSize: 12, fontWeight: '900' }}>ℹ️ Retos permitidos</Text>
          <Text style={{ color: C.sub, fontSize: 10, lineHeight: 16, marginTop: 6 }}>Sesiones completadas, días activos, minutos totales y minutos de cardio. No se incluyen pasos, calorías, distancia ni cambios corporales.</Text>
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
          <TouchableOpacity onPress={abrirCrear}>
            <Text style={s.sectionLink}>＋ Crear grupo</Text>
          </TouchableOpacity>
        </View>

        {visibles.map(group => {
          const open = grupoAbierto === group.id;
          const ranking = [...group.ranking].sort((a, b) => b.valor - a.valor);
          const myPosition = ranking.findIndex(member => member.id === 0);
          return (
            <View key={group.id} style={[s.groupCard, open && { borderColor: `${group.color}88` }]}>
              <TouchableOpacity style={s.groupMain} onPress={() => setGrupoAbierto(open ? null : group.id)} activeOpacity={0.78}>
                <View style={[s.iconBox, { width: 49, height: 49, backgroundColor: `${group.color}1E`, borderColor: `${group.color}55` }]}>
                  <Text style={{ fontSize: 23 }}>{group.reto.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={[s.row, { justifyContent: 'space-between', gap: 8 }]}>
                    <Text style={[s.groupTitle, { flex: 1 }]}>{group.nombre}</Text>
                    <View style={[s.infoPill, { backgroundColor: group.joined ? 'rgba(52,211,153,0.10)' : C.surface }]}>
                      <Text style={[s.infoPillText, { color: group.joined ? C.green : C.sub }]}>{group.admin ? 'ADMIN' : group.joined ? 'MIEMBRO' : 'ABIERTO'}</Text>
                    </View>
                  </View>
                  <Text style={s.groupMeta}>{group.miembros} miembros · Creado por {group.creador}</Text>
                  <Text style={s.groupDescription} numberOfLines={open ? undefined : 2}>{group.descripcion}</Text>
                  <View style={[s.card, { marginTop: 10, marginBottom: 0, padding: 10, backgroundColor: `${group.color}12`, borderColor: `${group.color}3D` }]}>
                    <Text style={{ color: group.color, fontSize: 10, fontWeight: '900' }}>{group.reto.icon} {group.reto.label}</Text>
                    <Text style={{ color: C.text, fontSize: 12, fontWeight: '900', marginTop: 4 }}>{group.reto.meta} {group.reto.unit} · {group.reto.periodo}</Text>
                  </View>
                  <View style={[s.row, { justifyContent: 'space-between', marginTop: 10 }]}>
                    <View style={s.miniAvatars}>
                      {group.miembrosPreview.map((member, index) => (
                        <View key={`${member}-${index}`} style={[s.miniAvatar, { backgroundColor: index === 0 ? group.color : C.purple }]}>
                          <Text style={s.miniAvatarText}>{member}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={{ color: C.muted, fontSize: 10, fontWeight: '900' }}>{open ? 'Ocultar ▲' : 'Ver reto y ranking ▼'}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {open ? (
                <View style={s.groupDetails}>
                  <View style={[s.row, { justifyContent: 'space-between', gap: 10 }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.sectionLabel}>INFORMACIÓN DEL GRUPO</Text>
                      <Text style={{ color: C.text, fontSize: 13, fontWeight: '900', marginTop: 6 }}>{group.nombre}</Text>
                    </View>
                    {group.admin ? (
                      <TouchableOpacity style={s.secondaryBtn} onPress={() => abrirEditarDatos(group)}>
                        <Text style={[s.secondaryBtnText, { color: C.teal }]}>✎ Editar grupo</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  <View style={[s.card, { marginTop: 10, marginBottom: 12, padding: 12, backgroundColor: C.card }]}>
                    <Text style={s.sectionLabel}>REGLAS Y NOTAS</Text>
                    <Text style={{ color: C.sub, fontSize: 10, lineHeight: 16, marginTop: 6 }}>{group.reglas || 'Sin reglas adicionales definidas.'}</Text>
                  </View>

                  <View style={[s.row, { justifyContent: 'space-between', gap: 10 }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.sectionLabel}>RETO ACTUAL</Text>
                      <Text style={{ color: C.text, fontSize: 13, fontWeight: '900', marginTop: 6 }}>{group.reto.label}</Text>
                      <Text style={{ color: group.color, fontSize: 11, fontWeight: '900', marginTop: 4 }}>Meta: {group.reto.meta} {group.reto.unit} · {group.reto.periodo}</Text>
                    </View>
                    {group.admin ? (
                      <TouchableOpacity style={s.secondaryBtn} onPress={() => abrirEditarReto(group)}>
                        <Text style={[s.secondaryBtnText, { color: C.orange }]}>✎ Editar reto</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <Text style={{ color: C.muted, fontSize: 9, lineHeight: 14, marginTop: 8 }}>Fuente: {group.reto.source}</Text>

                  <View style={[s.row, { justifyContent: 'space-between', marginTop: 12, marginBottom: 6 }]}>
                    <Text style={{ color: C.sub, fontSize: 10 }}>Progreso colectivo estimado</Text>
                    <Text style={{ color: group.color, fontSize: 10, fontWeight: '900' }}>{group.progreso}%</Text>
                  </View>
                  <View style={s.progressTrack}>
                    <View style={[s.progressFill, { width: `${group.progreso}%`, backgroundColor: group.color }]} />
                  </View>

                  <View style={[s.sectionHeader, { marginTop: 17 }]}>
                    <Text style={s.sectionTitle}>Ranking del reto</Text>
                    {myPosition >= 0 ? <Text style={[s.sectionLabel, { color: group.color }]}>TU POSICIÓN #{myPosition + 1}</Text> : null}
                  </View>
                  {ranking.slice(0, 5).map((member, index) => {
                    const isMe = member.id === 0;
                    const memberProgress = Math.min(100, Math.round((member.valor / group.reto.meta) * 100));
                    return (
                      <View key={`${group.id}-${member.id}`} style={[s.rankRow, index === 0 && { borderTopWidth: 0 }, isMe && s.rankMe]}>
                        <Text style={s.rankPos}>{MEDALS[index] || `#${index + 1}`}</Text>
                        <View style={[s.avatar, s.avatarSmall, { backgroundColor: isMe ? C.purple : C.soft }]}>
                          <Text style={[s.avatarText, { fontSize: 10 }]}>{member.iniciales}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.rankName}>{member.nombre}{isMe ? ' · TÚ' : ''}</Text>
                          <View style={[s.progressTrack, { marginTop: 6, height: 5 }]}>
                            <View style={[s.progressFill, { width: `${Math.max(member.valor > 0 ? 8 : 0, memberProgress)}%`, backgroundColor: isMe ? C.purple : group.color }]} />
                          </View>
                        </View>
                        <Text style={s.rankValue}>{member.valor}/{group.reto.meta} {group.reto.unit}</Text>
                      </View>
                    );
                  })}

                  <Text style={[s.sectionLabel, { marginTop: 15, marginBottom: 4 }]}>ACTIVIDAD RECIENTE</Text>
                  {group.actividad.slice(0, 3).map((activity, index) => (
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
                        {!group.admin ? (
                          <TouchableOpacity style={[s.secondaryBtn, s.dangerBtn]} onPress={() => confirmarSalida(group)}>
                            <Text style={[s.secondaryBtnText, s.dangerBtnText]}>Salir</Text>
                          </TouchableOpacity>
                        ) : null}
                      </>
                    ) : (
                      <TouchableOpacity style={[s.primaryBtn, { flex: 1, backgroundColor: group.color }]} onPress={() => unirseGrupo(group.id)}>
                        <Text style={s.primaryBtnText}>＋ Unirme al reto</Text>
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
          <View style={[s.modalCard, { maxHeight: '90%' }]}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{modalTitle}</Text>
            <Text style={s.modalSub}>{modalDescription}</Text>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {form.mode !== 'challenge' ? (
                <>
                  <Text style={[s.sectionLabel, { marginBottom: 7 }]}>DATOS DEL GRUPO</Text>
                  <TextInput
                    style={s.input}
                    placeholder="Nombre del grupo"
                    placeholderTextColor={C.muted}
                    value={form.nombre}
                    onChangeText={nombre => setForm(prev => ({ ...prev, nombre }))}
                    maxLength={40}
                  />
                  <TextInput
                    style={[s.input, { minHeight: 74, textAlignVertical: 'top' }]}
                    placeholder="Descripción del grupo"
                    placeholderTextColor={C.muted}
                    value={form.descripcion}
                    onChangeText={descripcion => setForm(prev => ({ ...prev, descripcion }))}
                    multiline
                    maxLength={180}
                  />
                  <TextInput
                    style={[s.input, { minHeight: 90, textAlignVertical: 'top' }]}
                    placeholder="Reglas, acuerdos o notas del reto"
                    placeholderTextColor={C.muted}
                    value={form.reglas}
                    onChangeText={reglas => setForm(prev => ({ ...prev, reglas }))}
                    multiline
                    maxLength={500}
                  />
                </>
              ) : (
                <View style={[s.card, { backgroundColor: C.card }]}>
                  <Text style={s.navTitle}>{form.nombre}</Text>
                  <Text style={s.navSub}>Solo el administrador puede modificar el reto.</Text>
                </View>
              )}

              {form.mode !== 'group' ? (
                <>
                  <Text style={[s.sectionLabel, { marginBottom: 8 }]}>TIPO DE RETO</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 12 }} style={{ marginBottom: 13 }}>
                    {GROUP_CHALLENGE_TYPES.map(type => (
                      <TouchableOpacity
                        key={type.id}
                        onPress={() => cambiarTipo(type.id)}
                        style={[
                          s.secondaryBtn,
                          { minWidth: 145, alignItems: 'flex-start' },
                          form.tipo === type.id && { backgroundColor: 'rgba(124,111,205,0.20)', borderColor: C.purple },
                        ]}
                      >
                        <Text style={{ fontSize: 20 }}>{type.icon}</Text>
                        <Text style={[s.secondaryBtnText, { color: form.tipo === type.id ? C.text : C.sub, marginTop: 5 }]}>{type.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={[s.card, { backgroundColor: 'rgba(96,165,250,0.08)', borderColor: 'rgba(96,165,250,0.28)' }]}>
                    <Text style={{ color: C.blue, fontSize: 11, fontWeight: '900' }}>Fuente de medición</Text>
                    <Text style={{ color: C.sub, fontSize: 10, lineHeight: 15, marginTop: 5 }}>{selectedType.source}</Text>
                  </View>

                  <Text style={[s.sectionLabel, { marginBottom: 7 }]}>PERIODO</Text>
                  <View style={s.chips}>
                    {selectedType.periods.map(period => (
                      <TouchableOpacity
                        key={period}
                        onPress={() => setForm(prev => ({ ...prev, periodo: period }))}
                        style={[s.chip, form.periodo === period && s.chipOn]}
                      >
                        <Text style={[s.chipText, form.periodo === period && s.chipTextOn]}>{period}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[s.sectionLabel, { marginBottom: 7 }]}>META DEL RETO</Text>
                  <TextInput
                    style={s.input}
                    placeholder={`Cantidad de ${selectedType.unit}`}
                    placeholderTextColor={C.muted}
                    value={form.meta}
                    onChangeText={meta => setForm(prev => ({ ...prev, meta: meta.replace(/[^0-9]/g, '') }))}
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                  <View style={[s.card, { backgroundColor: `${C.teal}10`, borderColor: `${C.teal}40` }]}>
                    <Text style={{ color: C.teal, fontSize: 10, fontWeight: '900' }}>VISTA PREVIA</Text>
                    <Text style={{ color: C.text, fontSize: 14, fontWeight: '900', marginTop: 6 }}>{selectedType.icon} {selectedType.label}</Text>
                    <Text style={{ color: C.sub, fontSize: 11, marginTop: 4 }}>Meta: {form.meta || '0'} {selectedType.unit} · {form.periodo}</Text>
                  </View>
                </>
              ) : null}
            </ScrollView>

            <View style={s.actionsRow}>
              <TouchableOpacity style={[s.secondaryBtn, { flex: 1 }]} onPress={() => setModalVisible(false)}>
                <Text style={s.secondaryBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.primaryBtn, { flex: 1 }]} onPress={guardar}>
                <Text style={s.primaryBtnText}>{form.mode === 'create' ? 'Crear grupo' : 'Guardar cambios'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
