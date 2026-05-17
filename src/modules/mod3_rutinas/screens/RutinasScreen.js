import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRutinas } from '../../../context/RutinasContext';

function totalEjercicios(rutina) {
  return Object.values(rutina.ejerciciosPorDia || {}).reduce((a, b) => a + b, 0);
}

function estimarMinutos(rutina) {
  const dias = Object.values(rutina.ejerciciosDetallePorDia || {}).filter(lista => lista.length > 0);
  if (!dias.length) return 0;
  const segundos = dias.map(lista => lista.reduce((t, e) => {
    const s = Number(e.series) || 3;
    const descanso = Number(e.descanso) || 90;
    return t + (s * 60) + Math.max(0, s - 1) * descanso;
  }, 0));
  return Math.round((segundos.reduce((a, b) => a + b, 0) / segundos.length) / 60);
}

export default function RutinasScreen({ navigation }) {
  const { rutinas, seleccionarRutina } = useRutinas();

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={s.backBtn}><Text style={s.backText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Entrenamientos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CrearRutina')} style={s.actionBtn}><Text style={s.actionText}>＋</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.badge}><Text style={s.badgeText}>Módulo 3 · RF12–RF19</Text></View>

        <View style={s.heroCard}>
          <Text style={s.heroIcon}>🏋️</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.heroTitle}>Personaliza tu entrenamiento</Text>
            <Text style={s.heroSub}>Crea rutinas, configura ejercicios y prepara tu sesión antes de entrenar.</Text>
          </View>
        </View>

        <Text style={s.sectionLabel}>Mis rutinas</Text>
        {rutinas.length === 0 ? (
          <View style={s.emptyCard}><Text style={s.emptyIcon}>🏋️</Text><Text style={s.emptyText}>Aún no tienes rutinas. Crea la primera.</Text></View>
        ) : rutinas.map(r => {
          const total = totalEjercicios(r);
          const mins = estimarMinutos(r);
          return (
            <TouchableOpacity key={r.id} style={s.rutinaCard} onPress={() => { seleccionarRutina(r); navigation.navigate('RutinaDetalle'); }}>
              <View style={s.rutinaTop}>
                <View style={s.rutinaIcon}><Text style={s.rutinaIconText}>🏋️</Text></View>
                <View style={s.rutinaInfo}>
                  <Text style={s.rutinaNombre}>{r.nombre}</Text>
                  <Text style={s.rutinaSub}>{r.diasHabilitados.length} días / semana · {total} ejercicios{mins ? ` · ~${mins} min` : ''}</Text>
                </View>
                <Text style={s.chevron}>›</Text>
              </View>
              <View style={s.tagsRow}>{r.diasHabilitados.map(d => <View key={d} style={s.tag}><Text style={s.tagText}>{d}</Text></View>)}</View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={s.btnPrimary} onPress={() => navigation.navigate('CrearRutina')}><Text style={s.btnPrimaryText}>+ Nueva rutina</Text></TouchableOpacity>
        <View style={s.divider} />
        <Text style={s.sectionLabel}>Catálogo de ejercicios</Text>
        <TouchableOpacity style={s.catalogCard} onPress={() => navigation.navigate('Ejercicios')}>
          <View style={s.catalogIcon}><Text style={s.catalogIconText}>📚</Text></View>
          <View style={s.catalogInfo}><Text style={s.catalogTitle}>Ver ejercicios</Text><Text style={s.catalogSub}>Catálogo de la app · ejercicios personalizados</Text></View>
          <Text style={s.chevron}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#1a1a22'}, header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'}, backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'}, backText:{color:'white',fontSize:18,fontWeight:'600'}, headerTitle:{fontSize:17,fontWeight:'800',color:'white'}, actionBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'}, actionText:{color:'#7c6fcd',fontSize:20,fontWeight:'700'}, body:{padding:16,paddingBottom:40}, badge:{alignSelf:'flex-start',backgroundColor:'rgba(249,115,22,0.12)',borderWidth:1,borderColor:'rgba(249,115,22,0.3)',borderRadius:20,paddingHorizontal:10,paddingVertical:3,marginBottom:16}, badgeText:{fontSize:10,fontWeight:'700',color:'#f97316'}, heroCard:{backgroundColor:'#7c6fcd',borderRadius:16,padding:18,flexDirection:'row',gap:14,alignItems:'center',marginBottom:20}, heroIcon:{fontSize:34}, heroTitle:{fontSize:17,fontWeight:'800',color:'white'}, heroSub:{fontSize:12,color:'rgba(255,255,255,0.75)',lineHeight:18,marginTop:4}, sectionLabel:{fontSize:12,fontWeight:'700',color:'#666',marginBottom:10,textTransform:'uppercase',letterSpacing:.5}, emptyCard:{backgroundColor:'#2a2a35',borderRadius:14,padding:28,alignItems:'center',marginBottom:12,borderWidth:1,borderColor:'#333'}, emptyIcon:{fontSize:36,marginBottom:8}, emptyText:{color:'#888',fontSize:14,textAlign:'center'}, rutinaCard:{backgroundColor:'#2a2a35',borderRadius:14,padding:14,marginBottom:10,borderWidth:1,borderColor:'#333'}, rutinaTop:{flexDirection:'row',alignItems:'center',gap:12}, rutinaIcon:{width:44,height:44,backgroundColor:'#1a1a22',borderRadius:12,alignItems:'center',justifyContent:'center'}, rutinaIconText:{fontSize:22}, rutinaInfo:{flex:1}, rutinaNombre:{fontSize:16,fontWeight:'800',color:'white',marginBottom:2}, rutinaSub:{fontSize:12,color:'#888'}, tagsRow:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:10}, tag:{backgroundColor:'rgba(124,111,205,0.2)',borderRadius:20,paddingHorizontal:8,paddingVertical:3,borderWidth:1,borderColor:'rgba(124,111,205,0.4)'}, tagText:{fontSize:10,fontWeight:'700',color:'#7c6fcd'}, chevron:{fontSize:22,color:'#555'}, btnPrimary:{backgroundColor:'#7c6fcd',borderRadius:12,padding:16,alignItems:'center',marginTop:4,marginBottom:16}, btnPrimaryText:{color:'white',fontWeight:'700',fontSize:15}, divider:{height:1,backgroundColor:'#2a2a35',marginVertical:8}, catalogCard:{backgroundColor:'#2a2a35',borderRadius:14,padding:16,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#333'}, catalogIcon:{width:44,height:44,backgroundColor:'rgba(94,234,212,0.1)',borderRadius:12,alignItems:'center',justifyContent:'center',marginRight:12,borderWidth:1,borderColor:'rgba(94,234,212,0.2)'}, catalogIconText:{fontSize:22}, catalogInfo:{flex:1}, catalogTitle:{fontSize:14,fontWeight:'700',color:'white'}, catalogSub:{fontSize:12,color:'#888',marginTop:2}
});
