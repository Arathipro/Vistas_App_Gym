import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const FOOD_OK = { nombre: 'Bowl de pollo con arroz', confianza: 88, kcal: 620, prot: 42, carbs: 68, grasas: 18, porcion: '1 plato mediano' };
const FOOD_DUDA = { nombre: 'Alimento no identificado con seguridad', confianza: 54, kcal: 0, prot: 0, carbs: 0, grasas: 0, porcion: 'Porción desconocida' };

export default function ScannerResultFoodScreen({ navigation, route }) {
  const fiable = (route?.params?.demo || 'reliable') !== 'unreliable';
  const data = fiable ? FOOD_OK : FOOD_DUDA;
  const [added, setAdded] = useState(false);
  const total = added ? 1860 : 1240;
  const objetivo = 2000;
  const pct = Math.min(100, Math.round((total / objetivo) * 100));

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.navigate('ScannerFood')}><Text style={s.backText}>←</Text></TouchableOpacity>
        <View style={s.headerCenter}><Text style={s.headerTitle}>Resultado Alimento</Text><Text style={s.headerSub}>RF47-RF51 · RNF22</Text></View>
        <View style={[s.scoreBadge, fiable ? s.scoreOk : s.scoreWarn]}><Text style={s.scoreText}>{data.confianza}%</Text></View>
      </View>
      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={[s.resultCard, fiable ? s.borderOk : s.borderWarn]}>
          <Text style={s.resultIcon}>{fiable ? '🍱' : '❓'}</Text>
          <Text style={s.resultTitle}>{data.nombre}</Text>
          <Text style={s.resultSub}>{fiable ? data.porcion : 'Confianza baja en el reconocimiento'}</Text>
          <View style={s.progressTrack}><View style={[s.progressFill, fiable ? s.fillOk : s.fillWarn, { width: `${data.confianza}%` }]} /></View>
          {!fiable && <Text style={s.warning}>La imagen no permite estimar macros con seguridad. Repite la captura o selecciona manualmente.</Text>}
        </View>

        {fiable ? <>
          <View style={s.nutritionGrid}>
            <Nutrient icon="🔥" label="Calorías" value={`${data.kcal}`} unit="kcal" />
            <Nutrient icon="🥩" label="Proteína" value={`${data.prot}`} unit="g" />
            <Nutrient icon="🌾" label="Carbos" value={`${data.carbs}`} unit="g" />
            <Nutrient icon="🥑" label="Grasas" value={`${data.grasas}`} unit="g" />
          </View>
          <View style={s.disclaimer}><Text style={s.disclaimerTitle}>⚠️ Estimación aproximada</Text><Text style={s.disclaimerText}>Los valores pueden variar ±20-30% por porción, preparación e ingredientes. Es información orientativa.</Text></View>
          <View style={s.dailyCard}>
            <View style={s.dailyTop}><Text style={s.dailyIcon}>🎯</Text><View style={{flex:1}}><Text style={s.dailyTitle}>Avance del día</Text><Text style={s.dailySub}>{total} / {objetivo} kcal · {pct}% del objetivo</Text></View></View>
            <View style={s.dayTrack}><View style={[s.dayFill, { width: `${pct}%` }]} /></View>
            <Text style={s.remaining}>{objetivo - total >= 0 ? `${objetivo - total} kcal restantes aprox.` : `${total - objetivo} kcal sobre el objetivo aprox.`}</Text>
          </View>
          <TouchableOpacity style={[s.primaryBtn, added && s.savedBtn]} onPress={() => setAdded(true)}><Text style={s.primaryText}>{added ? '✓ Agregado al registro diario' : '➕ Agregar al consumo de hoy'}</Text></TouchableOpacity>
          <TouchableOpacity style={s.secondaryBtn} onPress={() => navigation.navigate('HistorialFood')}><Text style={s.secondaryText}>Ver historial de alimentos</Text></TouchableOpacity>
        </> : <>
          <View style={s.card}><Text style={s.cardTitle}>Selección manual sugerida</Text>{['Pollo con arroz', 'Ensalada con pollo', 'Bowl mixto'].map(x => <TouchableOpacity key={x} style={s.manualItem}><Text style={s.manualText}>{x}</Text><Text style={s.manualArrow}>›</Text></TouchableOpacity>)}</View>
          <TouchableOpacity style={s.primaryBtn} onPress={() => navigation.navigate('ScannerFood')}><Text style={s.primaryText}>📷 Reintentar captura</Text></TouchableOpacity>
        </>}
      </ScrollView>
    </View>
  );
}
function Nutrient({ icon, label, value, unit }) { return <View style={s.nutrient}><Text style={s.nutrientIcon}>{icon}</Text><Text style={s.nutrientValue}>{value}<Text style={s.nutrientUnit}>{unit}</Text></Text><Text style={s.nutrientLabel}>{label}</Text></View>; }

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#1a1a22'}, header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'}, backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'}, backText:{color:'white',fontSize:18,fontWeight:'900'}, headerCenter:{flex:1,alignItems:'center',marginHorizontal:10}, headerTitle:{color:'white',fontSize:18,fontWeight:'900'}, headerSub:{color:'#777',fontSize:11,marginTop:2}, scoreBadge:{minWidth:44,height:34,borderRadius:12,alignItems:'center',justifyContent:'center',borderWidth:1}, scoreOk:{backgroundColor:'rgba(52,211,153,0.12)',borderColor:'rgba(52,211,153,0.35)'}, scoreWarn:{backgroundColor:'rgba(250,204,21,0.12)',borderColor:'rgba(250,204,21,0.35)'}, scoreText:{color:'white',fontSize:12,fontWeight:'900'}, body:{padding:16,paddingBottom:36}, resultCard:{borderRadius:22,padding:18,alignItems:'center',backgroundColor:'#20202a',borderWidth:1,marginBottom:12}, borderOk:{borderColor:'rgba(52,211,153,0.35)'}, borderWarn:{borderColor:'rgba(250,204,21,0.4)'}, resultIcon:{fontSize:52,marginBottom:8}, resultTitle:{color:'white',fontSize:20,fontWeight:'900',textAlign:'center'}, resultSub:{color:'#aaa',fontSize:12,marginTop:4}, progressTrack:{width:'100%',height:8,borderRadius:8,backgroundColor:'#2a2a35',marginTop:14,overflow:'hidden'}, progressFill:{height:'100%',borderRadius:8}, fillOk:{backgroundColor:'#34d399'}, fillWarn:{backgroundColor:'#facc15'}, warning:{color:'#facc15',fontSize:12,lineHeight:17,textAlign:'center',fontWeight:'700',marginTop:12}, nutritionGrid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:10}, nutrient:{width:'47.8%',backgroundColor:'#2a2a35',borderRadius:16,padding:14,borderWidth:1,borderColor:'#333',alignItems:'center'}, nutrientIcon:{fontSize:24}, nutrientValue:{color:'white',fontSize:22,fontWeight:'900',marginTop:5}, nutrientUnit:{fontSize:11,color:'#888'}, nutrientLabel:{color:'#888',fontSize:11,marginTop:3}, disclaimer:{backgroundColor:'rgba(250,204,21,0.08)',borderWidth:1,borderColor:'rgba(250,204,21,0.25)',borderRadius:16,padding:14,marginBottom:10}, disclaimerTitle:{color:'#facc15',fontSize:13,fontWeight:'900',marginBottom:5}, disclaimerText:{color:'#e8d98a',fontSize:12,lineHeight:17}, dailyCard:{backgroundColor:'rgba(124,111,205,0.14)',borderRadius:18,padding:14,borderWidth:1,borderColor:'rgba(124,111,205,0.35)',marginBottom:12}, dailyTop:{flexDirection:'row',alignItems:'center',gap:12}, dailyIcon:{fontSize:28}, dailyTitle:{color:'white',fontSize:15,fontWeight:'900'}, dailySub:{color:'#aaa',fontSize:12,marginTop:3}, dayTrack:{height:9,borderRadius:8,backgroundColor:'#2a2a35',overflow:'hidden',marginTop:12}, dayFill:{height:'100%',backgroundColor:'#7c6fcd'}, remaining:{color:'#bbb',fontSize:12,marginTop:8,fontWeight:'700'}, primaryBtn:{backgroundColor:'#7c6fcd',borderRadius:14,padding:14,alignItems:'center',marginBottom:10}, savedBtn:{backgroundColor:'#34d399'}, primaryText:{color:'white',fontSize:14,fontWeight:'900'}, secondaryBtn:{borderWidth:1,borderColor:'#3a3a45',borderRadius:14,padding:13,alignItems:'center'}, secondaryText:{color:'#ddd',fontSize:13,fontWeight:'800'}, card:{backgroundColor:'#2a2a35',borderRadius:16,padding:14,borderWidth:1,borderColor:'#333',marginBottom:10}, cardTitle:{color:'white',fontSize:14,fontWeight:'900',marginBottom:8}, manualItem:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#20202a',borderRadius:12,padding:12,marginBottom:8}, manualText:{color:'#ddd',fontSize:13,fontWeight:'800'}, manualArrow:{color:'#777',fontSize:20}
});
