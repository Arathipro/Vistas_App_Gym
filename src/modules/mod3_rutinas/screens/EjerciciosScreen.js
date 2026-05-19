import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Modal, Pressable } from 'react-native';
import { useRutinas } from '../../../context/RutinasContext';

const CATEGORIAS = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Cardio', 'Personalizados'];

function coincideCategoria(e, filtro) {
  if (filtro === 'Todos' || filtro === 'Personalizados') return true;
  return (e.categoria || '').toLowerCase() === filtro.toLowerCase();
}

export default function EjerciciosScreen({ navigation }) {
  const {
    ejerciciosCatalogo, ejPersonalizados, rutinas, desdeDia,
    setEjercicioActual, seleccionarDia, abrirCatalogoLibre,
  } = useRutinas();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [rutinaSel, setRutinaSel] = useState(null);
  const [ejercicioModal, setEjercicioModal] = useState(null);

  const modoPersonalizados = filtro === 'Personalizados';
  const modoDesdeDia = !!desdeDia;

  function filtrar(lista) {
    const q = busqueda.trim().toLowerCase();
    return lista.filter(e => {
      const texto = `${e.nombre} ${e.categoria} ${e.articulacion || ''}`.toLowerCase();
      return (!q || texto.includes(q)) && coincideCategoria(e, filtro);
    });
  }

  const app = useMemo(() => modoPersonalizados ? [] : filtrar(ejerciciosCatalogo), [ejerciciosCatalogo, busqueda, filtro]);
  const personalizados = useMemo(() => filtrar(ejPersonalizados), [ejPersonalizados, busqueda, filtro]);

  function volver() {
    navigation.navigate(modoDesdeDia ? 'DiaRutina' : 'Rutinas');
  }

  function abrirDetalle(ej) {
    setEjercicioActual(ej);
    navigation.navigate('EjercicioDet', { fromCatalogFree: !modoDesdeDia });
  }

  function crearPersonalizado() {
    setEjercicioActual({
      id: `nuevo-${Date.now()}`, nombre: '', categoria: '', icon: '✏️',
      series: 3, repsMin: '8', repsMax: '12', descanso: 90, unidad: 'kg',
      articulacion: 'Multiarticular', lateralidad: 'Bilateral', descripcion: '',
      isCustom: true, isNew: true,
    });
    navigation.navigate('EjercicioDet', { fromCatalogFree: !modoDesdeDia });
  }

  function abrirModalAgregar(ej) {
    setEjercicioModal(ej);
    if (rutinas.length === 1) setRutinaSel(rutinas[0]);
    else setRutinaSel(null);
    setModalVisible(true);
  }

  function elegirDia(dia) {
    if (!rutinaSel || !ejercicioModal) return;
    seleccionarDia(rutinaSel, dia);
    setEjercicioActual(ejercicioModal);
    setModalVisible(false);
    navigation.navigate('EjercicioDet', { fromCatalogFree: false });
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={volver} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>{modoDesdeDia ? `Agregar a ${desdeDia}` : 'Catálogo'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.badge}><Text style={s.badgeText}>RF12–RF15 · Catálogo</Text></View>

        {modoDesdeDia ? (
          <View style={s.contextBox}><Text style={s.contextIcon}>📅</Text><View style={{ flex: 1 }}><Text style={s.contextTitle}>Agregando al día {desdeDia}</Text><Text style={s.contextSub}>Elige un ejercicio y configura sus parámetros.</Text></View></View>
        ) : (
          <View style={s.contextBoxFree}><Text style={s.contextIcon}>📚</Text><View style={{ flex: 1 }}><Text style={s.contextTitleFree}>Catálogo libre</Text><Text style={s.contextSub}>Puedes revisar ejercicios o agregarlos a una rutina.</Text></View></View>
        )}

        <TextInput style={s.search} value={busqueda} onChangeText={setBusqueda} placeholder="Buscar ejercicio..." placeholderTextColor="#666" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>{CATEGORIAS.map(c => <TouchableOpacity key={c} style={[s.filter, filtro === c && s.filterActive]} onPress={() => setFiltro(c)}><Text style={[s.filterText, filtro === c && s.filterTextActive]}>{c}</Text></TouchableOpacity>)}</ScrollView>

        {!modoPersonalizados && <Section title="Ejercicios de la app" count={app.length} color="#7c6fcd">
          {app.length === 0 ? <Empty /> : app.map(e => <ExerciseRow key={e.id} e={e} onPress={() => abrirDetalle(e)} onAdd={() => abrirModalAgregar(e)} cta={modoDesdeDia ? 'Configurar →' : 'Ver'} showAdd={!modoDesdeDia} />)}
        </Section>}

        <Section title="Mis ejercicios personalizados" count={personalizados.length} color="#5eead4">
          {personalizados.length === 0 ? <Text style={s.emptySmall}>Aún no tienes ejercicios personalizados.</Text> : personalizados.map(e => <ExerciseRow key={e.id} e={e} onPress={() => abrirDetalle(e)} onAdd={() => abrirModalAgregar(e)} cta={modoDesdeDia ? 'Configurar →' : 'Ver'} custom showAdd={!modoDesdeDia} />)}
        </Section>

        <TouchableOpacity style={s.createCard} onPress={crearPersonalizado}>
          <View style={s.createIcon}><Text style={{ fontSize: 20 }}>✏️</Text></View>
          <View style={{ flex: 1 }}><Text style={s.createTitle}>Crear ejercicio personalizado</Text><Text style={s.createSub}>Agrega uno que no está en el catálogo</Text></View>
          <Text style={s.createPlus}>+</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={s.overlay} onPress={() => setModalVisible(false)} />
        <View style={s.sheet}>
          <View style={s.handle} />
          <View style={s.sheetHead}><View><Text style={s.sheetTitle}>Agregar a rutina</Text><Text style={s.sheetSub}>{ejercicioModal?.icon || '💪'} {ejercicioModal?.nombre}</Text></View><TouchableOpacity style={s.closeBtn} onPress={() => setModalVisible(false)}><Text style={s.closeText}>✕</Text></TouchableOpacity></View>

          {rutinas.length === 0 ? (
            <View style={s.emptyModal}><Text style={s.emptySmall}>No tienes rutinas creadas. Crea una rutina primero.</Text><TouchableOpacity style={s.modalBtn} onPress={() => { setModalVisible(false); abrirCatalogoLibre(); navigation.navigate('CrearRutina'); }}><Text style={s.modalBtnText}>Crear rutina</Text></TouchableOpacity></View>
          ) : (
            <>
              {rutinas.length > 1 && <><Text style={s.modalLabel}>1. Elige la rutina</Text>{rutinas.map(r => <TouchableOpacity key={r.id} style={[s.rutinaOption, rutinaSel?.id === r.id && s.rutinaOptionActive]} onPress={() => setRutinaSel(r)}><Text style={s.rutinaName}>🏋️ {r.nombre}</Text><Text style={s.rutinaDays}>{r.diasHabilitados.join(' · ')}</Text>{rutinaSel?.id === r.id && <Text style={s.check}>✓</Text>}</TouchableOpacity>)}</>}
              {rutinaSel && <><Text style={s.modalLabel}>{rutinas.length > 1 ? '2.' : '1.'} Elige el día</Text><View style={s.diasRow}>{rutinaSel.diasHabilitados.map(d => <TouchableOpacity key={d} style={s.diaBtn} onPress={() => elegirDia(d)}><Text style={s.diaBtnText}>{d}</Text></TouchableOpacity>)}</View></>}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

function Section({ title, count, color, children }) {
  return <View style={{ marginBottom: 16 }}><View style={s.sectionHeader}><View style={[s.dot, { backgroundColor: color }]} /><Text style={s.sectionLabel}>{title}</Text><View style={s.line} /><Text style={s.count}>{count}</Text></View><View style={s.listCard}>{children}</View></View>;
}
function Empty() { return <Text style={s.emptySmall}>Sin resultados.</Text>; }
function ExerciseRow({ e, onPress, onAdd, cta, custom, showAdd }) {
  const desc = `${e.categoria || 'Sin categoría'}${e.articulacion ? ` · ${e.articulacion}` : ''}`;
  return <TouchableOpacity style={[s.exerciseRow, custom && s.exerciseRowCustom]} onPress={onPress}><View style={[s.exerciseIcon, custom && s.exerciseIconCustom]}><Text style={s.exerciseIconText}>{custom ? '✏️' : e.icon}</Text></View><View style={{ flex: 1 }}><Text style={s.exerciseName}>{e.nombre || 'Nuevo ejercicio'}</Text><Text style={[s.exerciseSub, custom && { color: '#5eead4' }]}>{desc}</Text></View><View style={s.cta}><Text style={s.ctaText}>{cta}</Text></View>{showAdd && <TouchableOpacity style={s.addMini} onPress={(ev) => { ev.stopPropagation?.(); onAdd?.(); }}><Text style={s.addMiniText}>+</Text></TouchableOpacity>}</TouchableOpacity>;
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#1a1a22'},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'},backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'},backText:{color:'white',fontSize:18},headerTitle:{fontSize:17,fontWeight:'800',color:'white'},body:{padding:16,paddingBottom:40},badge:{alignSelf:'flex-start',backgroundColor:'rgba(249,115,22,.12)',borderWidth:1,borderColor:'rgba(249,115,22,.3)',borderRadius:20,paddingHorizontal:10,paddingVertical:3,marginBottom:14},badgeText:{fontSize:10,fontWeight:'700',color:'#f97316'},contextBox:{backgroundColor:'rgba(124,111,205,.14)',borderWidth:1,borderColor:'rgba(124,111,205,.3)',borderRadius:12,padding:12,flexDirection:'row',gap:10,alignItems:'center',marginBottom:12},contextBoxFree:{backgroundColor:'rgba(94,234,212,.08)',borderWidth:1,borderColor:'rgba(94,234,212,.25)',borderRadius:12,padding:12,flexDirection:'row',gap:10,alignItems:'center',marginBottom:12},contextIcon:{fontSize:20},contextTitle:{fontSize:13,fontWeight:'800',color:'#7c6fcd'},contextTitleFree:{fontSize:13,fontWeight:'800',color:'#5eead4'},contextSub:{fontSize:11,color:'#aaa',marginTop:2},search:{backgroundColor:'#2a2a35',borderRadius:12,padding:14,color:'white',fontSize:14,borderWidth:1,borderColor:'#333',marginBottom:10},filterRow:{gap:8,paddingBottom:14},filter:{backgroundColor:'#2a2a35',borderRadius:20,paddingHorizontal:12,paddingVertical:7,borderWidth:1,borderColor:'#333'},filterActive:{backgroundColor:'rgba(124,111,205,.2)',borderColor:'#7c6fcd'},filterText:{color:'#888',fontSize:12,fontWeight:'700'},filterTextActive:{color:'white'},sectionHeader:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:8},dot:{width:8,height:8,borderRadius:4},sectionLabel:{fontSize:12,fontWeight:'800',color:'#888',textTransform:'uppercase',letterSpacing:.4},line:{flex:1,height:1,backgroundColor:'#2a2a35'},count:{color:'#666',fontSize:11},listCard:{backgroundColor:'#2a2a35',borderRadius:14,borderWidth:1,borderColor:'#333',overflow:'hidden'},emptySmall:{color:'#888',fontSize:13,textAlign:'center',padding:16},exerciseRow:{flexDirection:'row',alignItems:'center',gap:10,padding:13,borderBottomWidth:1,borderBottomColor:'#333'},exerciseRowCustom:{backgroundColor:'rgba(94,234,212,.04)'},exerciseIcon:{width:38,height:38,borderRadius:10,backgroundColor:'#1a1a22',alignItems:'center',justifyContent:'center'},exerciseIconCustom:{backgroundColor:'rgba(94,234,212,.12)'},exerciseIconText:{fontSize:18},exerciseName:{fontSize:14,fontWeight:'800',color:'white'},exerciseSub:{fontSize:11,color:'#888',marginTop:2},cta:{backgroundColor:'rgba(124,111,205,.12)',borderRadius:7,paddingHorizontal:8,paddingVertical:4},ctaText:{color:'#7c6fcd',fontSize:10,fontWeight:'800'},addMini:{width:28,height:28,borderRadius:7,backgroundColor:'rgba(94,234,212,.14)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(94,234,212,.35)'},addMiniText:{color:'#5eead4',fontSize:18,fontWeight:'800'},createCard:{flexDirection:'row',alignItems:'center',gap:14,padding:15,borderRadius:14,backgroundColor:'rgba(94,234,212,.07)',borderWidth:1.5,borderStyle:'dashed',borderColor:'rgba(94,234,212,.4)'},createIcon:{width:42,height:42,borderRadius:12,backgroundColor:'rgba(94,234,212,.15)',alignItems:'center',justifyContent:'center'},createTitle:{fontSize:14,fontWeight:'800',color:'#5eead4'},createSub:{fontSize:11,color:'#888',marginTop:2},createPlus:{fontSize:22,color:'#5eead4',fontWeight:'800'},overlay:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,.65)'},sheet:{position:'absolute',left:0,right:0,bottom:0,maxHeight:'82%',backgroundColor:'#1a1a22',borderTopLeftRadius:20,borderTopRightRadius:20,borderWidth:1,borderColor:'#333',padding:16,paddingBottom:28},handle:{width:38,height:4,borderRadius:2,backgroundColor:'#444',alignSelf:'center',marginBottom:14},sheetHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14},sheetTitle:{fontSize:16,fontWeight:'800',color:'white'},sheetSub:{fontSize:12,color:'#888',marginTop:2},closeBtn:{width:32,height:32,borderRadius:9,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'},closeText:{color:'#888'},modalLabel:{fontSize:11,color:'#888',fontWeight:'800',textTransform:'uppercase',letterSpacing:.5,marginBottom:8,marginTop:6},rutinaOption:{backgroundColor:'#2a2a35',borderRadius:12,padding:12,borderWidth:1.5,borderColor:'#333',marginBottom:8},rutinaOptionActive:{borderColor:'#7c6fcd',backgroundColor:'rgba(124,111,205,.13)'},rutinaName:{color:'white',fontSize:14,fontWeight:'800'},rutinaDays:{color:'#888',fontSize:11,marginTop:3},check:{position:'absolute',right:12,top:15,color:'#7c6fcd',fontSize:18,fontWeight:'800'},diasRow:{flexDirection:'row',flexWrap:'wrap',gap:8},diaBtn:{backgroundColor:'#7c6fcd',borderRadius:10,paddingHorizontal:16,paddingVertical:10},diaBtnText:{color:'white',fontWeight:'800'},emptyModal:{alignItems:'center',gap:10},modalBtn:{backgroundColor:'#7c6fcd',borderRadius:10,paddingHorizontal:16,paddingVertical:12},modalBtnText:{color:'white',fontWeight:'800'}
});
