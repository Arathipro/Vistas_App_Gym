import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Modal, Pressable, Alert } from 'react-native';
import { useRutinas, esCardio, esCore, etiquetaCategoria } from '../../../context/RutinasContext';

export default function EjercicioDetScreen({ navigation, route }) {
  const {
    ejercicioActual, desdeDia, rutinaActual, rutinas, gruposMusculares,
    agregarEjercicioADia, crearEjercicioPersonalizado, seleccionarDia,
  } = useRutinas();

  const base = ejercicioActual || {};
  const rutina = rutinas.find(r => r.id === rutinaActual?.id) || rutinaActual;
  const esNuevo = !!base.isNew;
  const esCustom = !!base.isCustom;
  const fromCatalogFree = !!route?.params?.fromCatalogFree;

  const [nombre, setNombre] = useState(base.nombre || '');
  const [categoria, setCategoria] = useState(base.categoria || '');
  const [descripcion, setDescripcion] = useState(base.descripcion || '');
  const [series, setSeries] = useState(String(base.series || 3));
  const [repsMin, setRepsMin] = useState(String(base.repsMin || base.reps || 8));
  const [repsMax, setRepsMax] = useState(String(base.repsMax || ((base.reps || 8) + 4)));
  const [descanso, setDescanso] = useState(String(base.descanso || 90));
  const [unidad, setUnidad] = useState(base.unidad || 'kg');
  const [duracionMin, setDuracionMin] = useState(String(base.duracionMin || (esCardio(base) ? base.reps || 30 : 30)));
  const [articulacion, setArticulacion] = useState(base.articulacion || 'Multiarticular');
  const [lateralidad, setLateralidad] = useState(base.lateralidad || 'Bilateral');
  const [modalVisible, setModalVisible] = useState(false);
  const [rutinaSel, setRutinaSel] = useState(rutinas.length === 1 ? rutinas[0] : null);

  const categoriaFinal = esCustom ? categoria : base.categoria;
  const ejercicioPreview = { ...base, categoria: categoriaFinal };
  const cardio = esCardio(ejercicioPreview);
  const core = esCore(ejercicioPreview);
  const fuerza = !cardio && !core;
  const nombreFinal = esCustom ? (nombre.trim() || 'Nuevo ejercicio') : base.nombre;
  const puedeGuardar = !esCustom || (nombre.trim().length > 0 && categoria.trim().length > 0);

  function validarConfigMinima() {
    if (!puedeGuardar) {
      Alert.alert('Datos incompletos', 'Completa el nombre y grupo muscular del ejercicio.');
      return false;
    }
    if (cardio) {
      if (!String(duracionMin).trim() || Number(duracionMin) <= 0) {
        Alert.alert('Configuración incompleta', 'Indica una duración válida para el ejercicio de cardio.');
        return false;
      }
      return true;
    }
    if (!String(series).trim() || Number(series) <= 0) {
      Alert.alert('Configuración incompleta', 'Indica al menos la cantidad de series del ejercicio.');
      return false;
    }
    if (!String(descanso).trim() || Number(descanso) < 0) {
      Alert.alert('Configuración incompleta', 'Indica el descanso del ejercicio. Puede ser 0 si no tendrá descanso.');
      return false;
    }
    if (!String(unidad).trim()) {
      Alert.alert('Configuración incompleta', 'Selecciona el tipo de peso: kg, lb o placa.');
      return false;
    }
    return true;
  }

  function buildEjercicio() {
    const data = {
      ...base,
      nombre: nombreFinal,
      categoria: categoriaFinal,
      descripcion,
      isCustom: esCustom,
      icon: esCustom ? '✏️' : (base.icon || '💪'),
    };
    if (cardio) {
      return { ...data, duracionMin: Number(duracionMin) || 30, series: 1, repsMin: '', repsMax: '', descanso: 0, unidad: 'tiempo', articulacion: null, lateralidad: null };
    }
    return {
      ...data,
      series: Number(series) || 3,
      reps: Number(repsMin) || 8,
      repsMin,
      repsMax,
      descanso: Number(descanso) || 0,
      unidad,
      articulacion: core ? null : articulacion,
      lateralidad: core ? null : lateralidad,
    };
  }

  function configActual() {
    if (cardio) return { duracionMin: Number(duracionMin) || 30 };
    return { series: Number(series), repsMin, repsMax, descanso: Number(descanso), unidad, articulacion, lateralidad };
  }

  function guardarPersonalizado() {
    if (!validarConfigMinima()) return;
    const nuevo = crearEjercicioPersonalizado(buildEjercicio());
    if (desdeDia && rutina) {
      agregarEjercicioADia(rutina.id, desdeDia, nuevo, configActual());
      navigation.navigate('DiaRutina');
    } else {
      navigation.navigate('Ejercicios');
    }
  }

  function agregarADia() {
    if (!desdeDia || !rutina) return;
    if (!validarConfigMinima()) return;
    agregarEjercicioADia(rutina.id, desdeDia, buildEjercicio(), configActual());
    navigation.navigate('DiaRutina');
  }

  function abrirModalRutina() {
    if (!validarConfigMinima()) return;
    setRutinaSel(rutinas.length === 1 ? rutinas[0] : null);
    setModalVisible(true);
  }

  function agregarADiaElegido(dia) {
    if (!rutinaSel) return;
    if (!validarConfigMinima()) return;
    const ejercicio = esNuevo ? crearEjercicioPersonalizado(buildEjercicio()) : buildEjercicio();
    agregarEjercicioADia(rutinaSel.id, dia, ejercicio, configActual());
    seleccionarDia(rutinaSel, dia);
    setModalVisible(false);
    navigation.navigate('DiaRutina');
  }

  const subInfo = cardio ? `${etiquetaCategoria(categoriaFinal)} · Duración directa` : core ? `${etiquetaCategoria(categoriaFinal)} · Series/Reps` : `${categoriaFinal || 'Sin categoría'} · ${articulacion} · ${lateralidad}`;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Ejercicios')} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>{nombreFinal}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.badge}><Text style={s.badgeText}>{esCustom ? 'RF14 — Ejercicio personalizado' : 'RF12–RF13 — Detalle ejercicio'}</Text></View>

        {!esCustom && (
          <View style={s.videoBox}>
            <Text style={s.play}>▶</Text>
            <Text style={s.videoTitle}>Video demostrativo</Text>
            <Text style={s.videoSub}>{base.videoUrl ? 'Video disponible' : 'Placeholder visual · pendiente de recurso'}</Text>
          </View>
        )}

        {esCustom && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Datos del ejercicio</Text>
            <Text style={s.label}>Nombre *</Text>
            <TextInput style={s.input} value={nombre} onChangeText={setNombre} placeholder="Ej. Face pull con polea" placeholderTextColor="#555" />
            <Text style={s.label}>Grupo muscular *</Text>
            <View style={s.categoryGrid}>{gruposMusculares.map(g => <TouchableOpacity key={g} style={[s.categoryBtn, categoria === g && s.categoryActive]} onPress={() => setCategoria(g)}><Text style={[s.categoryText, categoria === g && s.categoryTextActive]}>{etiquetaCategoria(g)}</Text></TouchableOpacity>)}</View>
            <Text style={s.label}>Descripción</Text>
            <TextInput style={[s.input, { minHeight: 80, textAlignVertical: 'top' }]} value={descripcion} onChangeText={setDescripcion} multiline placeholder="Técnica o indicaciones opcionales" placeholderTextColor="#555" />
          </View>
        )}

        <View style={s.card}>
          <View style={s.titleRow}><Text style={s.bigIcon}>{esCustom ? '✏️' : base.icon || '💪'}</Text><View style={{ flex: 1 }}><Text style={s.name}>{nombreFinal}</Text><Text style={s.sub}>{subInfo}</Text></View></View>
          {!esCustom && <Text style={s.description}>{base.descripcion || 'Descripción del ejercicio pendiente.'}</Text>}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Configurar para rutina</Text>
          {cardio ? (
            <>
              <Text style={s.label}>Duración total *</Text>
              <View style={s.timeRow}><TextInput style={s.inputCenterWide} keyboardType="numeric" value={duracionMin} onChangeText={setDuracionMin} /><Text style={s.timeUnit}>minutos</Text></View>
              <View style={s.preview}><Text style={s.previewText}>Cardio · {duracionMin || '?'} minutos directos en la rutina</Text></View>
            </>
          ) : (
            <>
              <View style={s.grid}>
                <Field label="Series *" value={series} setValue={setSeries} />
                <Field label="Rep min" value={repsMin} setValue={setRepsMin} />
                <Field label="Rep max" value={repsMax} setValue={setRepsMax} />
                <Field label="Descanso *" value={descanso} setValue={setDescanso} />
              </View>
              <Text style={s.label}>Unidad de peso *</Text>
              <OptionRow items={['kg','lb','placa']} value={unidad} setValue={setUnidad} labels={{ placa: 'Placa #' }} color="orange" />
              {fuerza && <>
                <Text style={s.label}>Tipo de articulación</Text>
                <OptionRow items={['Monoarticular','Multiarticular']} value={articulacion} setValue={setArticulacion} labels={{ Monoarticular: 'Mono', Multiarticular: 'Multi' }} color="purple" />
                <Text style={s.label}>Lateralidad</Text>
                <OptionRow items={['Unilateral','Bilateral']} value={lateralidad} setValue={setLateralidad} color="teal" />
              </>}
              <View style={s.preview}><Text style={s.previewText}>{series || '?'} series · rango sugerido {repsMin || '?'}–{repsMax || '?'} reps · {descanso || '0'}s descanso · {unidad === 'placa' ? 'Placa #' : unidad}</Text></View>
            </>
          )}
        </View>

        {esCustom && !desdeDia && <TouchableOpacity style={[s.btnPrimary, !puedeGuardar && s.btnDisabled]} disabled={!puedeGuardar} onPress={guardarPersonalizado}><Text style={s.btnPrimaryText}>Guardar en mis ejercicios</Text></TouchableOpacity>}
        {desdeDia && <TouchableOpacity style={[s.btnPrimary, !puedeGuardar && s.btnDisabled]} disabled={!puedeGuardar} onPress={esNuevo ? guardarPersonalizado : agregarADia}><Text style={s.btnPrimaryText}>➕ Agregar a {desdeDia}</Text></TouchableOpacity>}
        {!desdeDia && fromCatalogFree && <TouchableOpacity style={[s.btnPrimary, !puedeGuardar && s.btnDisabled]} disabled={!puedeGuardar} onPress={abrirModalRutina}><Text style={s.btnPrimaryText}>➕ Agregar a una rutina</Text></TouchableOpacity>}
        {!desdeDia && fromCatalogFree && <TouchableOpacity style={s.btnSecondary} onPress={() => navigation.navigate('Ejercicios')}><Text style={s.btnSecondaryText}>← Volver al catálogo</Text></TouchableOpacity>}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={s.overlay} onPress={() => setModalVisible(false)} />
        <View style={s.sheet}>
          <View style={s.handle} />
          <View style={s.sheetHead}>
            <View><Text style={s.sheetTitle}>Agregar a rutina</Text><Text style={s.sheetSub}>{base.icon || '💪'} {nombreFinal}</Text></View>
            <TouchableOpacity style={s.closeBtn} onPress={() => setModalVisible(false)}><Text style={s.closeText}>✕</Text></TouchableOpacity>
          </View>

          {rutinas.length === 0 ? (
            <View style={s.emptyModal}><Text style={s.emptySmall}>No tienes rutinas creadas. Crea una rutina primero.</Text><TouchableOpacity style={s.modalBtn} onPress={() => { setModalVisible(false); navigation.navigate('CrearRutina'); }}><Text style={s.modalBtnText}>Crear rutina</Text></TouchableOpacity></View>
          ) : (
            <>
              {rutinas.length > 1 && <><Text style={s.modalLabel}>1. Elige la rutina</Text>{rutinas.map(r => <TouchableOpacity key={r.id} style={[s.rutinaOption, rutinaSel?.id === r.id && s.rutinaOptionActive]} onPress={() => setRutinaSel(r)}><Text style={s.rutinaName}>🏋️ {r.nombre}</Text><Text style={s.rutinaDays}>{r.diasHabilitados.join(' · ')}</Text>{rutinaSel?.id === r.id && <Text style={s.check}>✓</Text>}</TouchableOpacity>)}</>}
              {rutinaSel && <><Text style={s.modalLabel}>{rutinas.length > 1 ? '2.' : '1.'} Elige el día</Text><View style={s.diasRow}>{rutinaSel.diasHabilitados.map(d => <TouchableOpacity key={d} style={s.diaBtn} onPress={() => agregarADiaElegido(d)}><Text style={s.diaBtnText}>{d}</Text></TouchableOpacity>)}</View></>}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

function Field({ label, value, setValue }) {
  return <View style={{ flex: 1 }}><Text style={s.label}>{label}</Text><TextInput style={s.inputCenter} keyboardType="numeric" value={String(value)} onChangeText={setValue} /></View>;
}
function OptionRow({ items, value, setValue, labels = {}, color }) {
  return <View style={s.optRow}>{items.map(v => <TouchableOpacity key={v} style={[s.opt, value === v && (color === 'teal' ? s.optTeal : color === 'orange' ? s.optOrange : s.optPurple)]} onPress={() => setValue(v)}><Text style={[s.optText, value === v && (color === 'teal' ? s.optTextTeal : color === 'orange' ? s.optTextOrange : s.optTextPurple)]}>{labels[v] || v}</Text></TouchableOpacity>)}</View>;
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#1a1a22'},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'},backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'},backText:{color:'white',fontSize:18},headerTitle:{fontSize:16,fontWeight:'800',color:'white',flex:1,textAlign:'center',marginHorizontal:8},body:{padding:16,paddingBottom:40},badge:{alignSelf:'flex-start',backgroundColor:'rgba(249,115,22,.12)',borderWidth:1,borderColor:'rgba(249,115,22,.3)',borderRadius:20,paddingHorizontal:10,paddingVertical:3,marginBottom:14},badgeText:{fontSize:10,fontWeight:'700',color:'#f97316'},videoBox:{height:150,borderRadius:16,backgroundColor:'#11111b',borderWidth:1,borderColor:'#333',alignItems:'center',justifyContent:'center',marginBottom:12},play:{fontSize:38,color:'#7c6fcd'},videoTitle:{color:'white',fontWeight:'800',marginTop:6},videoSub:{color:'#888',fontSize:11,marginTop:2},card:{backgroundColor:'#2a2a35',borderRadius:14,padding:15,borderWidth:1,borderColor:'#333',marginBottom:12},cardTitle:{fontSize:14,fontWeight:'800',color:'white',marginBottom:12},label:{fontSize:10,color:'#888',fontWeight:'800',textTransform:'uppercase',letterSpacing:.4,marginBottom:5,marginTop:8},input:{backgroundColor:'#1a1a22',borderWidth:1,borderColor:'#333',borderRadius:10,padding:12,color:'white',fontSize:14},inputCenter:{backgroundColor:'#1a1a22',borderWidth:1,borderColor:'#333',borderRadius:10,padding:10,color:'white',fontSize:14,textAlign:'center'},inputCenterWide:{backgroundColor:'#1a1a22',borderWidth:1,borderColor:'#333',borderRadius:10,padding:12,color:'white',fontSize:16,textAlign:'center',flex:1},timeRow:{flexDirection:'row',alignItems:'center',gap:10},timeUnit:{color:'#aaa',fontSize:13},categoryGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},categoryBtn:{backgroundColor:'#1a1a22',borderRadius:9,borderWidth:1,borderColor:'#333',paddingHorizontal:10,paddingVertical:8},categoryActive:{backgroundColor:'rgba(94,234,212,.1)',borderColor:'#5eead4'},categoryText:{color:'#888',fontSize:12,fontWeight:'700'},categoryTextActive:{color:'#5eead4'},titleRow:{flexDirection:'row',alignItems:'center',gap:12},bigIcon:{fontSize:32},name:{fontSize:18,fontWeight:'800',color:'white'},sub:{fontSize:12,color:'#888',marginTop:2},description:{fontSize:13,color:'#ccc',lineHeight:20,marginTop:12},grid:{flexDirection:'row',gap:8},optRow:{flexDirection:'row',gap:8,flexWrap:'wrap',marginBottom:4},opt:{paddingHorizontal:12,paddingVertical:8,borderRadius:9,backgroundColor:'#1a1a22',borderWidth:1,borderColor:'#333'},optText:{fontSize:12,color:'#888',fontWeight:'700'},optPurple:{borderColor:'#7c6fcd',backgroundColor:'rgba(124,111,205,.12)'},optTeal:{borderColor:'#5eead4',backgroundColor:'rgba(94,234,212,.1)'},optOrange:{borderColor:'#f97316',backgroundColor:'rgba(249,115,22,.12)'},optTextPurple:{color:'#7c6fcd'},optTextTeal:{color:'#5eead4'},optTextOrange:{color:'#f97316'},preview:{backgroundColor:'rgba(124,111,205,.1)',borderRadius:10,padding:10,marginTop:12,borderWidth:1,borderColor:'rgba(124,111,205,.2)'},previewText:{color:'#ccc',fontSize:12,textAlign:'center'},btnPrimary:{backgroundColor:'#7c6fcd',borderRadius:12,padding:16,alignItems:'center',marginTop:4},btnDisabled:{opacity:.45},btnPrimaryText:{color:'white',fontWeight:'800',fontSize:15},btnSecondary:{backgroundColor:'#2a2a35',borderRadius:12,padding:16,alignItems:'center',marginTop:10,borderWidth:1,borderColor:'#333'},btnSecondaryText:{color:'#ccc',fontWeight:'700'},overlay:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,.65)'},sheet:{position:'absolute',left:0,right:0,bottom:0,maxHeight:'82%',backgroundColor:'#1a1a22',borderTopLeftRadius:20,borderTopRightRadius:20,borderWidth:1,borderColor:'#333',padding:16,paddingBottom:28},handle:{width:38,height:4,borderRadius:2,backgroundColor:'#444',alignSelf:'center',marginBottom:14},sheetHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14},sheetTitle:{fontSize:16,fontWeight:'800',color:'white'},sheetSub:{fontSize:12,color:'#888',marginTop:2},closeBtn:{width:32,height:32,borderRadius:9,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'},closeText:{color:'#888'},modalLabel:{fontSize:11,color:'#888',fontWeight:'800',textTransform:'uppercase',letterSpacing:.5,marginBottom:8,marginTop:6},rutinaOption:{backgroundColor:'#2a2a35',borderRadius:12,padding:12,borderWidth:1.5,borderColor:'#333',marginBottom:8},rutinaOptionActive:{borderColor:'#7c6fcd',backgroundColor:'rgba(124,111,205,.13)'},rutinaName:{color:'white',fontSize:14,fontWeight:'800'},rutinaDays:{color:'#888',fontSize:11,marginTop:3},check:{position:'absolute',right:12,top:15,color:'#7c6fcd',fontSize:18,fontWeight:'800'},diasRow:{flexDirection:'row',flexWrap:'wrap',gap:8},diaBtn:{backgroundColor:'#7c6fcd',borderRadius:10,paddingHorizontal:16,paddingVertical:10},diaBtnText:{color:'white',fontWeight:'800'},emptyModal:{alignItems:'center',gap:10},emptySmall:{color:'#888',fontSize:13,textAlign:'center',padding:16},modalBtn:{backgroundColor:'#7c6fcd',borderRadius:10,paddingHorizontal:16,paddingVertical:12},modalBtnText:{color:'white',fontWeight:'800'}
});