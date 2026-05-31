import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ScannerGymScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const scan = (demo) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ScannerResultGym', { demo });
    }, 700);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.navigate('Home')}><Text style={s.backText}>←</Text></TouchableOpacity>
        <View style={s.headerCenter}><Text style={s.headerTitle}>Escáner Gym</Text><Text style={s.headerSub}>Módulo 6 · RF40-RF44</Text></View>
        <View style={s.badge}><Text style={s.badgeText}>📷</Text></View>
      </View>
      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.cameraCard}>
          <View style={s.cameraBox}>
            <Text style={s.bigIcon}>{loading ? '🤖' : '🏋️'}</Text>
            <Text style={s.cameraTitle}>{loading ? 'Analizando equipo...' : 'Enfoca una máquina'}</Text>
            <Text style={s.cameraSub}>La foto se usa solo para obtener el resultado.</Text>
          </View>
          <Text style={s.tip}>Buena luz, equipo completo y enfoque claro para mejorar la identificación.</Text>
        </View>
        <Text style={s.section}>Demo de reconocimiento</Text>
        <TouchableOpacity style={[s.option, s.ok]} disabled={loading} onPress={() => scan('reliable')}>
          <Text style={s.optionIcon}>✅</Text><View style={s.optionText}><Text style={s.optionTitle}>Resultado confiable</Text><Text style={s.optionSub}>Alta confianza, músculos, recomendaciones y guardar en catálogo.</Text></View><Text style={s.go}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.option, s.warn]} disabled={loading} onPress={() => scan('unreliable')}>
          <Text style={s.optionIcon}>⚠️</Text><View style={s.optionText}><Text style={s.optionTitle}>Resultado no confiable</Text><Text style={s.optionSub}>Baja confianza, reintentar o selección manual.</Text></View><Text style={s.go}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#1a1a22'}, header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'},
  backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'}, backText:{color:'white',fontSize:18,fontWeight:'900'}, headerCenter:{flex:1,alignItems:'center',marginHorizontal:10}, headerTitle:{color:'white',fontSize:18,fontWeight:'900'}, headerSub:{color:'#777',fontSize:11,marginTop:2}, badge:{width:36,height:36,borderRadius:12,backgroundColor:'rgba(124,111,205,0.15)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(124,111,205,0.35)'}, badgeText:{fontSize:18}, body:{padding:16,paddingBottom:36}, cameraCard:{backgroundColor:'#20202a',borderRadius:22,padding:16,borderWidth:1,borderColor:'#333',marginBottom:16}, cameraBox:{height:280,borderRadius:20,backgroundColor:'#12121a',borderWidth:1,borderColor:'rgba(124,111,205,0.45)',alignItems:'center',justifyContent:'center'}, bigIcon:{fontSize:56,marginBottom:10}, cameraTitle:{color:'white',fontSize:20,fontWeight:'900'}, cameraSub:{color:'#888',fontSize:12,marginTop:6}, tip:{color:'#c7f9f2',fontSize:12,lineHeight:17,fontWeight:'700',backgroundColor:'rgba(94,234,212,0.08)',borderWidth:1,borderColor:'rgba(94,234,212,0.22)',padding:12,borderRadius:14,marginTop:14}, section:{color:'#777',fontSize:11,fontWeight:'900',textTransform:'uppercase',letterSpacing:.6,marginBottom:10}, option:{flexDirection:'row',alignItems:'center',gap:12,borderRadius:16,padding:14,marginBottom:10,borderWidth:1}, ok:{backgroundColor:'rgba(52,211,153,0.08)',borderColor:'rgba(52,211,153,0.26)'}, warn:{backgroundColor:'rgba(250,204,21,0.08)',borderColor:'rgba(250,204,21,0.28)'}, optionIcon:{fontSize:24}, optionText:{flex:1}, optionTitle:{color:'white',fontSize:14,fontWeight:'900'}, optionSub:{color:'#aaa',fontSize:12,lineHeight:17,marginTop:3}, go:{color:'#777',fontSize:24}
});
