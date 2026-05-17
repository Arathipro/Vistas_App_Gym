import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRutinas } from '../../../context/RutinasContext';

function totalEjercicios(r) { return Object.values(r?.ejerciciosPorDia || {}).reduce((a,b)=>a+b,0); }
function estimarLista(lista=[]) { return lista.reduce((t,e)=>{ const s=Number(e.series)||3; const d=Number(e.descanso)||90; return t+(s*60)+Math.max(0,s-1)*d; },0); }

export default function RutinaDetalleScreen({ navigation }) {
  const { rutinas, rutinaActual, seleccionarDia, setSesionActual } = useRutinas();
  const rutina = rutinas.find(r => r.id === rutinaActual?.id) || rutinaActual;

  if (!rutina) {
    return <View style={s.container}><StatusBar barStyle="light-content"/><View style={s.center}><Text style={s.emptyIcon}>🏋️</Text><Text style={s.emptyText}>Selecciona una rutina primero</Text><TouchableOpacity style={s.btnPrimary} onPress={()=>navigation.navigate('Rutinas')}><Text style={s.btnPrimaryText}>Ir a rutinas</Text></TouchableOpacity></View></View>;
  }

  const diasConEj = Object.values(rutina.ejerciciosDetallePorDia || {}).filter(l => l.length > 0);
  const promMin = diasConEj.length ? Math.round(diasConEj.map(estimarLista).reduce((a,b)=>a+b,0) / diasConEj.length / 60) : 0;

  function iniciarSesion() {
    const primerDia = rutina.diasHabilitados.find(d => (rutina.ejerciciosDetallePorDia?.[d] || []).length > 0) || rutina.diasHabilitados[0];
    setSesionActual({ rutinaId: rutina.id, dia: primerDia, rutinaNombre: rutina.nombre, ejercicios: rutina.ejerciciosDetallePorDia?.[primerDia] || [] });
    navigation.navigate('PreSesion');
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}><TouchableOpacity onPress={()=>navigation.navigate('Rutinas')} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity><Text style={s.headerTitle} numberOfLines={1}>{rutina.nombre}</Text><TouchableOpacity style={s.editBtn} onPress={()=>navigation.navigate('EditarRutina')}><Text style={s.editBtnText}>Editar</Text></TouchableOpacity></View>
      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.badge}><Text style={s.badgeText}>RF19 — Carga de rutina</Text></View>
        <View style={s.accentCard}><View style={s.statsRow}>{[{v:rutina.diasHabilitados.length,l:'días/sem'},{v:totalEjercicios(rutina),l:'ejercicios'},{v:promMin?`~${promMin}m`:'—',l:'prom/día',a:true},{v:rutina.tipo,l:'tipo',small:true}].map((x,i)=><React.Fragment key={i}><View style={s.statItem}><Text style={[x.small?s.statType:s.statValue,x.a&&{color:'#5eead4'}]}>{x.v}</Text><Text style={s.statLabel}>{x.l}</Text></View>{i<3&&<View style={s.statDivider}/>}</React.Fragment>)}</View></View>
        <Text style={s.sectionLabel}>Días de entrenamiento</Text>
        {rutina.diasHabilitados.map(dia => { const lista = rutina.ejerciciosDetallePorDia?.[dia] || []; return <TouchableOpacity key={dia} style={s.diaCard} onPress={()=>{seleccionarDia(rutina,dia); navigation.navigate('DiaRutina');}}><View style={[s.diaIcon, lista.length>0 && s.diaIconActive]}><Text style={s.diaIconText}>{lista.length>0?'📋':'📅'}</Text></View><View style={s.diaInfo}><Text style={s.diaNombre}>{dia}</Text><Text style={[s.diaSub, lista.length>0 && {color:'#7c6fcd'}]}>{lista.length>0?`${lista.length} ejercicio${lista.length!==1?'s':''} · ~${Math.round(estimarLista(lista)/60)} min`:'Sin ejercicios aún — toca para agregar'}</Text></View>{lista.length>0?<Text style={s.chevron}>›</Text>:<View style={s.addChip}><Text style={s.addChipText}>+ Agregar</Text></View>}</TouchableOpacity>})}
        <TouchableOpacity style={[s.btnPrimary, totalEjercicios(rutina)===0 && s.btnDisabled]} disabled={totalEjercicios(rutina)===0} onPress={iniciarSesion}><Text style={s.btnPrimaryText}>▶ Iniciar sesión de hoy</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({container:{flex:1,backgroundColor:'#1a1a22'},center:{flex:1,alignItems:'center',justifyContent:'center',padding:24},emptyIcon:{fontSize:44},emptyText:{color:'#aaa',fontSize:15,marginVertical:12},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'},backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'},backText:{color:'white',fontSize:18,fontWeight:'600'},headerTitle:{fontSize:17,fontWeight:'800',color:'white',flex:1,textAlign:'center',marginHorizontal:8},editBtn:{backgroundColor:'rgba(124,111,205,0.15)',borderRadius:8,paddingHorizontal:12,paddingVertical:6,borderWidth:1,borderColor:'rgba(124,111,205,0.4)'},editBtnText:{color:'#7c6fcd',fontSize:12,fontWeight:'700'},body:{padding:16,paddingBottom:40},badge:{alignSelf:'flex-start',backgroundColor:'rgba(249,115,22,0.12)',borderWidth:1,borderColor:'rgba(249,115,22,0.3)',borderRadius:20,paddingHorizontal:10,paddingVertical:3,marginBottom:16},badgeText:{fontSize:10,fontWeight:'700',color:'#f97316'},accentCard:{backgroundColor:'#7c6fcd',borderRadius:16,padding:18,marginBottom:20},statsRow:{flexDirection:'row',alignItems:'center'},statItem:{alignItems:'center',flex:1},statValue:{fontSize:24,fontWeight:'800',color:'white'},statType:{fontSize:12,fontWeight:'800',color:'white'},statLabel:{fontSize:10,color:'rgba(255,255,255,0.68)',marginTop:2},statDivider:{width:1,height:36,backgroundColor:'rgba(255,255,255,0.2)'},sectionLabel:{fontSize:12,fontWeight:'700',color:'#666',marginBottom:10,textTransform:'uppercase',letterSpacing:.5},diaCard:{backgroundColor:'#2a2a35',borderRadius:12,padding:14,flexDirection:'row',alignItems:'center',marginBottom:8,borderWidth:1,borderColor:'#333'},diaIcon:{width:40,height:40,backgroundColor:'#1a1a22',borderRadius:10,alignItems:'center',justifyContent:'center',marginRight:12},diaIconActive:{backgroundColor:'rgba(124,111,205,0.2)'},diaIconText:{fontSize:18},diaInfo:{flex:1},diaNombre:{fontSize:14,fontWeight:'700',color:'white'},diaSub:{fontSize:12,color:'#666',marginTop:2},chevron:{fontSize:22,color:'#555'},addChip:{backgroundColor:'rgba(124,111,205,0.12)',borderRadius:6,paddingHorizontal:8,paddingVertical:4},addChipText:{fontSize:11,color:'#7c6fcd',fontWeight:'700'},btnPrimary:{backgroundColor:'#7c6fcd',borderRadius:12,padding:16,alignItems:'center',marginTop:12},btnDisabled:{opacity:.45},btnPrimaryText:{color:'white',fontWeight:'700',fontSize:15}});
