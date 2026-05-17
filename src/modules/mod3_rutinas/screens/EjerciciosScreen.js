import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { useRutinas } from '../../../context/RutinasContext';

const CATEGORIAS = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Cardio'];

function coincideCategoria(e, filtro) {
  if (filtro === 'Todos') return true;
  return (e.categoria || '').toLowerCase().includes(filtro.toLowerCase());
}

export default function EjerciciosScreen({ navigation }) {
  const { ejerciciosCatalogo, ejPersonalizados, setEjercicioActual, desdeDia } = useRutinas();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  function filtrar(lista) {
    const q = busqueda.trim().toLowerCase();
    return lista.filter(e => {
      const texto = `${e.nombre} ${e.categoria} ${e.articulacion || ''}`.toLowerCase();
      return (!q || texto.includes(q)) && coincideCategoria(e, filtro);
    });
  }

  const app = useMemo(() => filtrar(ejerciciosCatalogo), [ejerciciosCatalogo, busqueda, filtro]);
  const personalizados = useMemo(() => filtrar(ejPersonalizados), [ejPersonalizados, busqueda, filtro]);

  function abrirDetalle(ej) {
    setEjercicioActual(ej);
    navigation.navigate('EjercicioDet');
  }

  function crearPersonalizado() {
    setEjercicioActual({ id: `nuevo-${Date.now()}`, nombre: '', categoria: '', icon: '✏️', series: 3, repsMin: '8', repsMax: '12', descanso: 90, unidad: 'kg', articulacion: 'Multiarticular', lateralidad: 'Bilateral', descripcion: '', isCustom: true, isNew: true });
    navigation.navigate('EjercicioDet');
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate(desdeDia ? 'DiaRutina' : 'Rutinas')} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>{desdeDia ? `Agregar a ${desdeDia}` : 'Catálogo'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.badge}><Text style={s.badgeText}>RF12–RF15 · Catálogo</Text></View>

        {desdeDia && <View style={s.contextBox}><Text style={s.contextIcon}>📅</Text><View style={{ flex: 1 }}><Text style={s.contextTitle}>Agregando al día {desdeDia}</Text><Text style={s.contextSub}>Elige un ejercicio y configura sus parámetros.</Text></View></View>}

        <TextInput style={s.search} value={busqueda} onChangeText={setBusqueda} placeholder="Buscar ejercicio..." placeholderTextColor="#666" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>{CATEGORIAS.map(c => <TouchableOpacity key={c} style={[s.filter, filtro === c && s.filterActive]} onPress={() => setFiltro(c)}><Text style={[s.filterText, filtro === c && s.filterTextActive]}>{c}</Text></TouchableOpacity>)}</ScrollView>

        <Section title="Ejercicios de la app" count={app.length} color="#7c6fcd">
          {app.length === 0 ? <Empty /> : app.map(e => <ExerciseRow key={e.id} e={e} onPress={() => abrirDetalle(e)} cta={desdeDia ? 'Configurar →' : e.sets} />)}
        </Section>

        <Section title="Mis ejercicios personalizados" count={personalizados.length} color="#5eead4">
          {personalizados.length === 0 ? <Text style={s.emptySmall}>Aún no tienes ejercicios personalizados.</Text> : personalizados.map(e => <ExerciseRow key={e.id} e={e} onPress={() => abrirDetalle(e)} cta={desdeDia ? 'Configurar →' : e.sets} custom />)}
        </Section>

        <TouchableOpacity style={s.createCard} onPress={crearPersonalizado}>
          <View style={s.createIcon}><Text style={{ fontSize: 20 }}>✏️</Text></View>
          <View style={{ flex: 1 }}><Text style={s.createTitle}>Crear ejercicio personalizado</Text><Text style={s.createSub}>Agrega uno que no está en el catálogo</Text></View>
          <Text style={s.createPlus}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Section({ title, count, color, children }) {
  return <View style={{ marginBottom: 16 }}><View style={s.sectionHeader}><View style={[s.dot, { backgroundColor: color }]} /><Text style={s.sectionLabel}>{title}</Text><View style={s.line} /><Text style={s.count}>{count}</Text></View><View style={s.listCard}>{children}</View></View>;
}
function Empty() { return <Text style={s.emptySmall}>Sin resultados.</Text>; }
function ExerciseRow({ e, onPress, cta, custom }) {
  return <TouchableOpacity style={[s.exerciseRow, custom && s.exerciseRowCustom]} onPress={onPress}><View style={[s.exerciseIcon, custom && s.exerciseIconCustom]}><Text style={s.exerciseIconText}>{custom ? '✏️' : e.icon}</Text></View><View style={{ flex: 1 }}><Text style={s.exerciseName}>{e.nombre || 'Nuevo ejercicio'}</Text><Text style={[s.exerciseSub, custom && { color: '#5eead4' }]}>{custom ? 'Personalizado · ' : ''}{e.categoria || 'Sin categoría'} · {e.articulacion || '—'}</Text></View><View style={s.cta}><Text style={s.ctaText}>{cta}</Text></View></TouchableOpacity>;
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#1a1a22'},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'},backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'},backText:{color:'white',fontSize:18},headerTitle:{fontSize:17,fontWeight:'800',color:'white'},body:{padding:16,paddingBottom:40},badge:{alignSelf:'flex-start',backgroundColor:'rgba(249,115,22,.12)',borderWidth:1,borderColor:'rgba(249,115,22,.3)',borderRadius:20,paddingHorizontal:10,paddingVertical:3,marginBottom:14},badgeText:{fontSize:10,fontWeight:'700',color:'#f97316'},contextBox:{backgroundColor:'rgba(124,111,205,.14)',borderWidth:1,borderColor:'rgba(124,111,205,.3)',borderRadius:12,padding:12,flexDirection:'row',gap:10,alignItems:'center',marginBottom:12},contextIcon:{fontSize:20},contextTitle:{fontSize:13,fontWeight:'800',color:'#7c6fcd'},contextSub:{fontSize:11,color:'#aaa',marginTop:2},search:{backgroundColor:'#2a2a35',borderRadius:12,padding:14,color:'white',fontSize:14,borderWidth:1,borderColor:'#333',marginBottom:10},filterRow:{gap:8,paddingBottom:14},filter:{backgroundColor:'#2a2a35',borderRadius:20,paddingHorizontal:12,paddingVertical:7,borderWidth:1,borderColor:'#333'},filterActive:{backgroundColor:'rgba(124,111,205,.2)',borderColor:'#7c6fcd'},filterText:{color:'#888',fontSize:12,fontWeight:'700'},filterTextActive:{color:'white'},sectionHeader:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:8},dot:{width:8,height:8,borderRadius:4},sectionLabel:{fontSize:12,fontWeight:'800',color:'#888',textTransform:'uppercase',letterSpacing:.4},line:{flex:1,height:1,backgroundColor:'#2a2a35'},count:{color:'#666',fontSize:11},listCard:{backgroundColor:'#2a2a35',borderRadius:14,borderWidth:1,borderColor:'#333',overflow:'hidden'},emptySmall:{color:'#888',fontSize:13,textAlign:'center',padding:16},exerciseRow:{flexDirection:'row',alignItems:'center',gap:12,padding:13,borderBottomWidth:1,borderBottomColor:'#333'},exerciseRowCustom:{backgroundColor:'rgba(94,234,212,.04)'},exerciseIcon:{width:38,height:38,borderRadius:10,backgroundColor:'#1a1a22',alignItems:'center',justifyContent:'center'},exerciseIconCustom:{backgroundColor:'rgba(94,234,212,.12)'},exerciseIconText:{fontSize:18},exerciseName:{fontSize:14,fontWeight:'800',color:'white'},exerciseSub:{fontSize:11,color:'#888',marginTop:2},cta:{backgroundColor:'rgba(124,111,205,.12)',borderRadius:7,paddingHorizontal:8,paddingVertical:4},ctaText:{color:'#7c6fcd',fontSize:10,fontWeight:'800'},createCard:{flexDirection:'row',alignItems:'center',gap:14,padding:15,borderRadius:14,backgroundColor:'rgba(94,234,212,.07)',borderWidth:1.5,borderStyle:'dashed',borderColor:'rgba(94,234,212,.4)'},createIcon:{width:42,height:42,borderRadius:12,backgroundColor:'rgba(94,234,212,.15)',alignItems:'center',justifyContent:'center'},createTitle:{fontSize:14,fontWeight:'800',color:'#5eead4'},createSub:{fontSize:11,color:'#888',marginTop:2},createPlus:{fontSize:22,color:'#5eead4',fontWeight:'800'}
});
