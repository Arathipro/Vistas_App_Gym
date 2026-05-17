import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { useRutinas } from '../../../context/RutinasContext';

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function CrearRutinaScreen({ navigation }) {
  const { crearRutina } = useRutinas();
  const [nombre, setNombre] = useState('');
  const [diasSel, setDiasSel] = useState([]);
  const [tipo, setTipo] = useState('Personalizada');

  function toggleDia(dia) {
    setDiasSel(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]);
  }

  function guardar() {
    if (!nombre.trim() || diasSel.length === 0) return;
    crearRutina({ nombre, tipo, diasHabilitados: DIAS_SEMANA.filter(d => diasSel.includes(d)) });
    navigation.navigate('RutinaDetalle');
  }

  const puedeGuardar = nombre.trim().length > 0 && diasSel.length > 0;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Rutinas')} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Nueva rutina</Text><View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.badge}><Text style={s.badgeText}>RF17 — Crear rutina</Text></View>
        <View style={s.cardIntro}><Text style={s.introIcon}>🗂️</Text><Text style={s.introTitle}>Arma tu rutina</Text><Text style={s.introSub}>Guarda primero los días y luego agrega ejercicios a cada día.</Text></View>

        <View style={s.inputGroup}><Text style={s.inputLabel}>Nombre de la rutina</Text><TextInput style={s.input} value={nombre} onChangeText={setNombre} placeholder="Ej. Pecho + Tríceps" placeholderTextColor="#555" /></View>

        <View style={s.inputGroup}><Text style={s.inputLabel}>Tipo de rutina</Text><View style={s.optRow}>{['Personalizada','Full Body','PPL','Upper/Lower'].map(v => <TouchableOpacity key={v} style={[s.optBtn, tipo===v && s.optBtnActive]} onPress={() => setTipo(v)}><Text style={[s.optText, tipo===v && s.optTextActive]}>{v}</Text></TouchableOpacity>)}</View></View>

        <View style={s.inputGroup}><Text style={s.inputLabel}>Días de entrenamiento</Text><View style={s.diasRow}>{DIAS_SEMANA.map(d => <TouchableOpacity key={d} style={[s.diaBtn, diasSel.includes(d) && s.diaBtnActive]} onPress={() => toggleDia(d)}><Text style={[s.diaBtnText, diasSel.includes(d) && s.diaBtnTextActive]}>{d}</Text></TouchableOpacity>)}</View>{diasSel.length === 0 && <Text style={s.hint}>Selecciona al menos un día</Text>}</View>

        {diasSel.length > 0 && <View style={s.previewCard}><View style={s.tagsRow}>{DIAS_SEMANA.filter(d => diasSel.includes(d)).map(d => <View key={d} style={s.tag}><Text style={s.tagText}>{d}</Text></View>)}</View><Text style={s.previewCount}>{diasSel.length} día{diasSel.length !== 1 ? 's' : ''}/sem</Text></View>}

        <View style={s.infoBox}><Text style={s.infoIcon}>💡</Text><Text style={s.infoText}>Al guardar irás al detalle para entrar a cada día y agregar ejercicios del catálogo.</Text></View>
        <TouchableOpacity style={[s.btnPrimary, !puedeGuardar && s.btnDisabled]} onPress={guardar} disabled={!puedeGuardar}><Text style={s.btnPrimaryText}>Guardar y configurar →</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#1a1a22'},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'},backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'},backText:{color:'white',fontSize:18,fontWeight:'600'},headerTitle:{fontSize:17,fontWeight:'800',color:'white'},body:{padding:16,paddingBottom:40},badge:{alignSelf:'flex-start',backgroundColor:'rgba(249,115,22,0.12)',borderWidth:1,borderColor:'rgba(249,115,22,0.3)',borderRadius:20,paddingHorizontal:10,paddingVertical:3,marginBottom:16},badgeText:{fontSize:10,fontWeight:'700',color:'#f97316'},cardIntro:{backgroundColor:'#2a2a35',borderRadius:16,padding:18,alignItems:'center',borderWidth:1,borderColor:'#333',marginBottom:20},introIcon:{fontSize:36},introTitle:{fontSize:18,fontWeight:'800',color:'white',marginTop:8},introSub:{fontSize:12,color:'#888',textAlign:'center',marginTop:4,lineHeight:18},inputGroup:{marginBottom:20},inputLabel:{fontSize:12,fontWeight:'700',color:'#aaa',marginBottom:8,textTransform:'uppercase',letterSpacing:.5},input:{backgroundColor:'#2a2a35',borderRadius:10,padding:14,color:'white',fontSize:15,borderWidth:1,borderColor:'#333'},optRow:{flexDirection:'row',flexWrap:'wrap',gap:8},optBtn:{paddingHorizontal:12,paddingVertical:9,borderRadius:10,backgroundColor:'#2a2a35',borderWidth:1.5,borderColor:'#333'},optBtnActive:{backgroundColor:'rgba(94,234,212,0.12)',borderColor:'#5eead4'},optText:{fontSize:12,color:'#888',fontWeight:'600'},optTextActive:{color:'#5eead4'},diasRow:{flexDirection:'row',flexWrap:'wrap',gap:8},diaBtn:{paddingHorizontal:14,paddingVertical:9,borderRadius:10,backgroundColor:'#2a2a35',borderWidth:1.5,borderColor:'transparent'},diaBtnActive:{backgroundColor:'rgba(124,111,205,0.2)',borderColor:'#7c6fcd'},diaBtnText:{fontSize:13,color:'#888',fontWeight:'500'},diaBtnTextActive:{color:'white',fontWeight:'700'},hint:{fontSize:11,color:'#555',marginTop:6},previewCard:{backgroundColor:'#2a2a35',borderRadius:12,padding:14,marginBottom:16,borderWidth:1,borderColor:'#333',flexDirection:'row',alignItems:'center',gap:8},tagsRow:{flexDirection:'row',flexWrap:'wrap',gap:6,flex:1},tag:{backgroundColor:'rgba(124,111,205,0.2)',borderRadius:20,paddingHorizontal:8,paddingVertical:3,borderWidth:1,borderColor:'rgba(124,111,205,0.4)'},tagText:{fontSize:10,fontWeight:'700',color:'#7c6fcd'},previewCount:{fontSize:11,color:'#888'},infoBox:{backgroundColor:'rgba(94,234,212,0.07)',borderWidth:1,borderColor:'rgba(94,234,212,0.25)',borderRadius:12,padding:14,flexDirection:'row',gap:10,alignItems:'flex-start',marginBottom:20},infoIcon:{fontSize:16},infoText:{flex:1,fontSize:12,color:'#aaa',lineHeight:18},btnPrimary:{backgroundColor:'#7c6fcd',borderRadius:12,padding:16,alignItems:'center'},btnDisabled:{opacity:.45},btnPrimaryText:{color:'white',fontWeight:'700',fontSize:15}
});
