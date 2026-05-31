import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useScannerDemo } from '../../../context/ScannerDemoContext';

export default function CatalogoGymScreen({ navigation }) {
  const { machineCatalog } = useScannerDemo();
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.navigate('ScannerGym')}><Text style={s.backText}>←</Text></TouchableOpacity>
        <View style={s.headerCenter}><Text style={s.headerTitle}>Catálogo Gym</Text><Text style={s.headerSub}>RF44 · Ejercicios guardados</Text></View>
        <View style={s.badge}><Text style={s.badgeText}>📚</Text></View>
      </View>
      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <Text style={s.heroIcon}>🏗️</Text>
          <View style={{flex:1}}>
            <Text style={s.heroTitle}>{machineCatalog.length} máquina{machineCatalog.length === 1 ? '' : 's'} guardada{machineCatalog.length === 1 ? '' : 's'}</Text>
            <Text style={s.heroSub}>Resultados conservados desde el escáner para usarlos como referencia.</Text>
          </View>
        </View>
        {machineCatalog.length === 0 ? (
          <View style={s.empty}><Text style={s.emptyIcon}>📷</Text><Text style={s.emptyTitle}>Sin máquinas guardadas</Text><Text style={s.emptySub}>Escanea una máquina y guarda el resultado para verlo aquí.</Text></View>
        ) : machineCatalog.map((m, i) => (
          <View key={`${m.id}-${i}`} style={s.card}>
            <View style={s.top}><Text style={s.icon}>{m.icon || '🏗️'}</Text><View style={{flex:1}}><Text style={s.name}>{m.nombre}</Text><Text style={s.sub}>{m.grupo} · {m.confianza || 80}% confianza · {m.savedAt || 'Hoy'}</Text></View></View>
            <Text style={s.desc}>{m.musculos}</Text>
            <Text style={s.small}>{m.descripcion}</Text>
          </View>
        ))}
        <TouchableOpacity style={s.primaryBtn} onPress={() => navigation.navigate('ScannerGym')}><Text style={s.primaryText}>📷 Escanear otra máquina</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#1a1a22'}, header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'}, backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'}, backText:{color:'white',fontSize:18,fontWeight:'900'}, headerCenter:{flex:1,alignItems:'center',marginHorizontal:10}, headerTitle:{color:'white',fontSize:18,fontWeight:'900'}, headerSub:{color:'#777',fontSize:11,marginTop:2}, badge:{width:36,height:36,borderRadius:12,backgroundColor:'rgba(124,111,205,0.15)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(124,111,205,0.35)'}, badgeText:{fontSize:18}, body:{padding:16,paddingBottom:36}, hero:{flexDirection:'row',alignItems:'center',gap:14,backgroundColor:'rgba(124,111,205,0.14)',borderRadius:20,padding:16,borderWidth:1,borderColor:'rgba(124,111,205,0.35)',marginBottom:14}, heroIcon:{fontSize:34}, heroTitle:{color:'white',fontSize:17,fontWeight:'900'}, heroSub:{color:'#aaa',fontSize:12,lineHeight:17,marginTop:3}, empty:{alignItems:'center',backgroundColor:'#2a2a35',borderRadius:18,padding:28,borderWidth:1,borderColor:'#333',marginBottom:14}, emptyIcon:{fontSize:42}, emptyTitle:{color:'white',fontSize:16,fontWeight:'900',marginTop:8}, emptySub:{color:'#888',fontSize:12,textAlign:'center',lineHeight:17,marginTop:4}, card:{backgroundColor:'#2a2a35',borderRadius:16,padding:14,borderWidth:1,borderColor:'#333',marginBottom:10}, top:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:10}, icon:{fontSize:28}, name:{color:'white',fontSize:15,fontWeight:'900'}, sub:{color:'#5eead4',fontSize:11,fontWeight:'800',marginTop:3}, desc:{color:'#ddd',fontSize:12,fontWeight:'800',marginBottom:5}, small:{color:'#aaa',fontSize:12,lineHeight:17}, primaryBtn:{backgroundColor:'#7c6fcd',borderRadius:14,padding:14,alignItems:'center',marginTop:8}, primaryText:{color:'white',fontSize:14,fontWeight:'900'}
});
