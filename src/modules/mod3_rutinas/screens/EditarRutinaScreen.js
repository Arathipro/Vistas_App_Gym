import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert } from 'react-native';
import { useRutinas } from '../../../context/RutinasContext';

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function EditarRutinaScreen({ navigation }) {
  const { rutinas, rutinaActual, actualizarRutina, eliminarRutina } = useRutinas();
  const rutina = rutinas.find(r => r.id === rutinaActual?.id) || rutinaActual;
  const [nombre, setNombre] = useState(rutina?.nombre || '');
  const [tipo, setTipo] = useState(rutina?.tipo || 'Personalizada');
  const [diasSel, setDiasSel] = useState(rutina?.diasHabilitados || []);

  if (!rutina) {
    return <View style={s.container}><View style={s.center}><Text style={s.emptyText}>No hay rutina seleccionada</Text><TouchableOpacity style={s.btnPrimary} onPress={()=>navigation.navigate('Rutinas')}><Text style={s.btnPrimaryText}>Ir a rutinas</Text></TouchableOpacity></View></View>;
  }

  function toggleDia(dia) {
    setDiasSel(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]);
  }

  function guardar() {
    if (!nombre.trim() || diasSel.length === 0) return;
    const diasOrdenados = DIAS_SEMANA.filter(d => diasSel.includes(d));
    const ejerciciosDetallePorDia = { ...(rutina.ejerciciosDetallePorDia || {}) };
    const ejerciciosPorDia = { ...(rutina.ejerciciosPorDia || {}) };
    diasOrdenados.forEach(d => {
      if (!ejerciciosDetallePorDia[d]) ejerciciosDetallePorDia[d] = [];
      ejerciciosPorDia[d] = ejerciciosDetallePorDia[d].length;
    });
    Object.keys(ejerciciosDetallePorDia).forEach(d => {
      if (!diasOrdenados.includes(d)) {
        delete ejerciciosDetallePorDia[d];
        delete ejerciciosPorDia[d];
      }
    });
    actualizarRutina(rutina.id, { nombre: nombre.trim(), tipo, diasHabilitados: diasOrdenados, ejerciciosDetallePorDia, ejerciciosPorDia });
    navigation.navigate('RutinaDetalle');
  }

  function confirmarEliminar() {
    Alert.alert('Eliminar rutina', `¿Eliminar "${rutina.nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { eliminarRutina(rutina.id); navigation.navigate('Rutinas'); } },
    ]);
  }

  const puedeGuardar = nombre.trim().length > 0 && diasSel.length > 0;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}><TouchableOpacity onPress={()=>navigation.navigate('RutinaDetalle')} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity><Text style={s.headerTitle}>Editar rutina</Text><View style={{width:36}}/></View>
      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.badge}><Text style={s.badgeText}>RF18 — Editar rutina</Text></View>
        <View style={s.inputGroup}><Text style={s.inputLabel}>Nombre de la rutina</Text><TextInput style={s.input} value={nombre} onChangeText={setNombre} placeholder="Nombre" placeholderTextColor="#555" /></View>
        <View style={s.inputGroup}><Text style={s.inputLabel}>Tipo</Text><View style={s.optRow}>{['Personalizada','Full Body','PPL','Upper/Lower'].map(v=><TouchableOpacity key={v} style={[s.optBtn,tipo===v&&s.optBtnActive]} onPress={()=>setTipo(v)}><Text style={[s.optText,tipo===v&&s.optTextActive]}>{v}</Text></TouchableOpacity>)}</View></View>
        <View style={s.inputGroup}><Text style={s.inputLabel}>Días de entrenamiento</Text><View style={s.diasRow}>{DIAS_SEMANA.map(d=><TouchableOpacity key={d} style={[s.diaBtn,diasSel.includes(d)&&s.diaBtnActive]} onPress={()=>toggleDia(d)}><Text style={[s.diaBtnText,diasSel.includes(d)&&s.diaBtnTextActive]}>{d}</Text></TouchableOpacity>)}</View></View>
        <View style={s.infoBox}><Text style={s.infoIcon}>💡</Text><Text style={s.infoText}>Si quitas un día, también se quitan los ejercicios configurados en ese día durante esta ejecución.</Text></View>
        <TouchableOpacity style={[s.btnPrimary,!puedeGuardar&&s.btnDisabled]} disabled={!puedeGuardar} onPress={guardar}><Text style={s.btnPrimaryText}>Guardar cambios</Text></TouchableOpacity>
        <TouchableOpacity style={s.btnDanger} onPress={confirmarEliminar}><Text style={s.btnDangerText}>🗑 Eliminar rutina</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({container:{flex:1,backgroundColor:'#1a1a22'},center:{flex:1,alignItems:'center',justifyContent:'center',padding:24},emptyText:{color:'#aaa'},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'},backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'},backText:{color:'white',fontSize:18,fontWeight:'600'},headerTitle:{fontSize:17,fontWeight:'800',color:'white'},body:{padding:16,paddingBottom:40},badge:{alignSelf:'flex-start',backgroundColor:'rgba(249,115,22,0.12)',borderWidth:1,borderColor:'rgba(249,115,22,0.3)',borderRadius:20,paddingHorizontal:10,paddingVertical:3,marginBottom:20},badgeText:{fontSize:10,fontWeight:'700',color:'#f97316'},inputGroup:{marginBottom:20},inputLabel:{fontSize:12,fontWeight:'700',color:'#aaa',marginBottom:8,textTransform:'uppercase',letterSpacing:.5},input:{backgroundColor:'#2a2a35',borderRadius:10,padding:14,color:'white',fontSize:15,borderWidth:1,borderColor:'#333'},optRow:{flexDirection:'row',flexWrap:'wrap',gap:8},optBtn:{paddingHorizontal:12,paddingVertical:9,borderRadius:10,backgroundColor:'#2a2a35',borderWidth:1.5,borderColor:'#333'},optBtnActive:{backgroundColor:'rgba(94,234,212,0.12)',borderColor:'#5eead4'},optText:{fontSize:12,color:'#888',fontWeight:'600'},optTextActive:{color:'#5eead4'},diasRow:{flexDirection:'row',flexWrap:'wrap',gap:8},diaBtn:{paddingHorizontal:14,paddingVertical:9,borderRadius:10,backgroundColor:'#2a2a35',borderWidth:1.5,borderColor:'transparent'},diaBtnActive:{backgroundColor:'rgba(124,111,205,0.2)',borderColor:'#7c6fcd'},diaBtnText:{fontSize:13,color:'#888',fontWeight:'500'},diaBtnTextActive:{color:'white',fontWeight:'700'},infoBox:{backgroundColor:'rgba(124,111,205,0.08)',borderWidth:1,borderColor:'rgba(124,111,205,0.2)',borderRadius:12,padding:14,flexDirection:'row',gap:10,alignItems:'flex-start',marginBottom:20},infoIcon:{fontSize:16},infoText:{flex:1,fontSize:12,color:'#aaa',lineHeight:18},btnPrimary:{backgroundColor:'#7c6fcd',borderRadius:12,padding:16,alignItems:'center',marginBottom:12},btnDisabled:{opacity:.45},btnPrimaryText:{color:'white',fontWeight:'700',fontSize:15},btnDanger:{backgroundColor:'rgba(248,113,113,0.07)',borderRadius:12,padding:16,alignItems:'center',borderWidth:1,borderColor:'rgba(248,113,113,0.3)'},btnDangerText:{color:'#f87171',fontWeight:'700'}});
