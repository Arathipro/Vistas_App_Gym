import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useScannerDemo } from '../../../context/ScannerDemoContext';

const OBJETIVO = 2000;

export default function HistorialFoodScreen({ navigation }) {
  const { foodDaily, foodSaved, dailyTotals } = useScannerDemo();
  const pct = Math.round((dailyTotals.kcal / OBJETIVO) * 100);
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.navigate('ScannerFood')}><Text style={s.backText}>←</Text></TouchableOpacity>
        <View style={s.headerCenter}><Text style={s.headerTitle}>Historial Alimentos</Text><Text style={s.headerSub}>RF49-RF51</Text></View>
        <View style={s.badge}><Text style={s.badgeText}>🥗</Text></View>
      </View>
      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>Registro diario</Text>
          <Text style={s.summaryValue}>{dailyTotals.kcal}<Text style={s.summaryUnit}> / {OBJETIVO} kcal</Text></Text>
          <View style={s.track}><View style={[s.fill, { width: `${Math.min(100, pct)}%` }]} /></View>
          <Text style={s.summarySub}>{pct}% del objetivo diario aproximado</Text>
        </View>
        <View style={s.macroRow}><Mini label="Proteina" value={`${dailyTotals.prot}g`} /><Mini label="Carbos" value={`${dailyTotals.carbs}g`} /><Mini label="Grasas" value={`${dailyTotals.grasas}g`} /></View>
        <Text style={s.section}>Alimentos de hoy</Text>
        {foodDaily.map((x, i) => <FoodRow key={`${x.id}-${i}`} {...x} />)}
        <View style={s.notice}><Text style={s.noticeText}>⚠️ Los valores son aproximados y pueden variar por porcion o preparacion.</Text></View>
        <Text style={s.section}>Historial guardado por escaneo</Text>
        {foodSaved.length === 0 ? <Text style={s.empty}>Aun no agregas alimentos desde el escaner.</Text> : foodSaved.map((x, i) => <FoodRow key={`${x.id}-saved-${i}`} {...x} />)}
        <TouchableOpacity style={s.primaryBtn} onPress={() => navigation.navigate('ScannerFood')}><Text style={s.primaryText}>📷 Escanear otro alimento</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}
function Mini({ label, value }) { return <View style={s.mini}><Text style={s.miniValue}>{value}</Text><Text style={s.miniLabel}>{label}</Text></View>; }
function FoodRow({ icon, nombre, kcal, prot, carbs, grasas }) { return <View style={s.foodRow}><Text style={s.foodIcon}>{icon}</Text><View style={{flex:1}}><Text style={s.foodName}>{nombre}</Text><Text style={s.foodSub}>{prot}g prot · {carbs}g carb · {grasas}g grasa</Text></View><Text style={s.foodKcal}>{kcal} kcal</Text></View>; }

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#1a1a22'}, header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'}, backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'}, backText:{color:'white',fontSize:18,fontWeight:'900'}, headerCenter:{flex:1,alignItems:'center',marginHorizontal:10}, headerTitle:{color:'white',fontSize:18,fontWeight:'900'}, headerSub:{color:'#777',fontSize:11,marginTop:2}, badge:{width:36,height:36,borderRadius:12,backgroundColor:'rgba(94,234,212,0.12)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(94,234,212,0.3)'}, badgeText:{fontSize:18}, body:{padding:16,paddingBottom:36}, summaryCard:{backgroundColor:'rgba(124,111,205,0.14)',borderRadius:22,padding:16,borderWidth:1,borderColor:'rgba(124,111,205,0.35)',marginBottom:10}, summaryTitle:{color:'#aaa',fontSize:12,fontWeight:'800'}, summaryValue:{color:'white',fontSize:34,fontWeight:'900',marginTop:4}, summaryUnit:{fontSize:13,color:'#aaa'}, track:{height:9,borderRadius:8,backgroundColor:'#2a2a35',overflow:'hidden',marginTop:12}, fill:{height:'100%',backgroundColor:'#7c6fcd'}, summarySub:{color:'#bbb',fontSize:12,marginTop:8,fontWeight:'700'}, macroRow:{flexDirection:'row',gap:8,marginBottom:14}, mini:{flex:1,backgroundColor:'#2a2a35',borderRadius:12,padding:9,alignItems:'center',borderWidth:1,borderColor:'#333'}, miniValue:{color:'white',fontSize:14,fontWeight:'900'}, miniLabel:{color:'#888',fontSize:10,marginTop:2}, section:{color:'#777',fontSize:11,fontWeight:'900',textTransform:'uppercase',letterSpacing:.6,marginBottom:10,marginTop:4}, foodRow:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:'#2a2a35',borderRadius:15,padding:13,borderWidth:1,borderColor:'#333',marginBottom:9}, foodIcon:{fontSize:24}, foodName:{color:'white',fontSize:14,fontWeight:'900'}, foodSub:{color:'#888',fontSize:11,marginTop:3}, foodKcal:{color:'#5eead4',fontSize:12,fontWeight:'900'}, notice:{backgroundColor:'rgba(250,204,21,0.08)',borderWidth:1,borderColor:'rgba(250,204,21,0.24)',borderRadius:14,padding:12,marginVertical:8}, noticeText:{color:'#e8d98a',fontSize:12,lineHeight:17,fontWeight:'700'}, empty:{color:'#888',fontSize:12,textAlign:'center',backgroundColor:'#2a2a35',borderRadius:14,padding:18,marginBottom:10}, primaryBtn:{backgroundColor:'#7c6fcd',borderRadius:14,padding:14,alignItems:'center',marginTop:8}, primaryText:{color:'white',fontSize:14,fontWeight:'900'}
});
