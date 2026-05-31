import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRutinas } from '../../../context/RutinasContext';
import { useScannerDemo, MACHINE_RESULTS } from '../../../context/ScannerDemoContext';

const FALLBACK = { id:'gym-duda', nombre:'Equipo no identificado con seguridad', confianza:56, grupo:'Pecho / Hombros', icon:'❓', musculos:'Pendiente de confirmar', descripcion:'La imagen no fue suficientemente clara para identificar el equipo.', recomendaciones:[] };

export default function ScannerResultGymScreen({ navigation, route }) {
  const demo = route?.params?.demo || 'reliable';
  const fiable = demo !== 'unreliable';
  const initial = fiable ? MACHINE_RESULTS[0] : FALLBACK;
  const [data, setData] = useState(initial);
  const [guardado, setGuardado] = useState(false);
  const { crearEjercicioPersonalizado } = useRutinas();
  const { saveMachine } = useScannerDemo();

  function guardar() {
    if (guardado || !data || data.id === 'gym-duda') return;
    crearEjercicioPersonalizado({ nombre: data.nombre, categoria: data.grupo, icon: data.icon || '🏗️', series: 3, repsMin: '10', repsMax: '12', descanso: 90, articulacion: 'Multiarticular', lateralidad: 'Bilateral', unidad: 'kg', descripcion: data.descripcion });
    saveMachine(data);
    setGuardado(true);
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.navigate('ScannerGym')}><Text style={s.backText}>←</Text></TouchableOpacity>
        <View style={s.headerCenter}><Text style={s.headerTitle}>Resultado Gym</Text><Text style={s.headerSub}>RF41-RF44 · RNF21</Text></View>
        <View style={[s.scoreBadge, data.confianza >= 70 ? s.scoreOk : s.scoreWarn]}><Text style={s.scoreText}>{data.confianza}%</Text></View>
      </View>
      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={[s.resultCard, data.confianza >= 70 ? s.borderOk : s.borderWarn]}>
          <Text style={s.resultIcon}>{data.icon}</Text>
          <Text style={s.resultTitle}>{data.nombre}</Text>
          <Text style={s.resultSub}>{data.confianza >= 70 ? 'Identificacion confiable' : 'Confianza baja en el reconocimiento'}</Text>
          <View style={s.progressTrack}><View style={[s.progressFill, data.confianza >= 70 ? s.fillOk : s.fillWarn, { width: `${data.confianza}%` }]} /></View>
          {data.confianza < 70 && <Text style={s.warning}>Selecciona una opcion posible o repite la captura antes de guardar.</Text>}
        </View>

        {data.confianza < 70 && <View style={s.card}><Text style={s.cardTitle}>Opciones sugeridas</Text>{MACHINE_RESULTS.map(x => <TouchableOpacity key={x.id} style={[s.manualItem, data.id === x.id && s.manualSelected]} onPress={() => { setData({ ...x, confianza: 76 }); setGuardado(false); }}><Text style={s.manualText}>{x.icon} {x.nombre}</Text><Text style={s.manualArrow}>{data.id === x.id ? '✓' : '›'}</Text></TouchableOpacity>)}</View>}

        {data.id !== 'gym-duda' && <>
          <InfoCard icon="💪" title="Musculos involucrados" text={data.musculos} />
          <InfoCard icon="📘" title="Descripcion" text={data.descripcion} />
          <View style={s.card}><Text style={s.cardTitle}>Recomendaciones de uso</Text>{data.recomendaciones.map((r, i) => <View key={i} style={s.bulletRow}><Text style={s.bullet}>•</Text><Text style={s.bulletText}>{r}</Text></View>)}</View>
          <View style={s.videoCard}><Text style={s.videoIcon}>▶</Text><View><Text style={s.videoTitle}>Video demostrativo</Text><Text style={s.videoSub}>Disponible cuando el ejercicio tenga video asociado.</Text></View></View>
          <TouchableOpacity style={[s.primaryBtn, guardado && s.savedBtn]} onPress={guardado ? () => navigation.navigate('CatalogoGym') : guardar}><Text style={s.primaryText}>{guardado ? '📚 Ver catalogo' : '💾 Guardar ejercicio en catalogo'}</Text></TouchableOpacity>
        </>}

        <TouchableOpacity style={s.secondaryBtn} onPress={() => navigation.navigate('ScannerGym')}><Text style={s.secondaryText}>Salir</Text></TouchableOpacity>
        {data.confianza < 70 && <TouchableOpacity style={s.retryBtn} onPress={() => navigation.navigate('ScannerGym')}><Text style={s.retryText}>📷 Reintentar captura</Text></TouchableOpacity>}
      </ScrollView>
    </View>
  );
}
function InfoCard({ icon, title, text }) { return <View style={s.card}><Text style={s.cardTitle}>{icon} {title}</Text><Text style={s.cardText}>{text}</Text></View>; }

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#1a1a22'}, header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'}, backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'}, backText:{color:'white',fontSize:18,fontWeight:'900'}, headerCenter:{flex:1,alignItems:'center',marginHorizontal:10}, headerTitle:{color:'white',fontSize:18,fontWeight:'900'}, headerSub:{color:'#777',fontSize:11,marginTop:2}, scoreBadge:{minWidth:44,height:34,borderRadius:12,alignItems:'center',justifyContent:'center',borderWidth:1}, scoreOk:{backgroundColor:'rgba(52,211,153,0.12)',borderColor:'rgba(52,211,153,0.35)'}, scoreWarn:{backgroundColor:'rgba(250,204,21,0.12)',borderColor:'rgba(250,204,21,0.35)'}, scoreText:{color:'white',fontSize:12,fontWeight:'900'}, body:{padding:16,paddingBottom:36}, resultCard:{borderRadius:22,padding:18,alignItems:'center',backgroundColor:'#20202a',borderWidth:1,marginBottom:12}, borderOk:{borderColor:'rgba(52,211,153,0.35)'}, borderWarn:{borderColor:'rgba(250,204,21,0.4)'}, resultIcon:{fontSize:52,marginBottom:8}, resultTitle:{color:'white',fontSize:20,fontWeight:'900',textAlign:'center'}, resultSub:{color:'#aaa',fontSize:12,marginTop:4}, progressTrack:{width:'100%',height:8,borderRadius:8,backgroundColor:'#2a2a35',marginTop:14,overflow:'hidden'}, progressFill:{height:'100%',borderRadius:8}, fillOk:{backgroundColor:'#34d399'}, fillWarn:{backgroundColor:'#facc15'}, warning:{color:'#facc15',fontSize:12,lineHeight:17,textAlign:'center',fontWeight:'700',marginTop:12}, card:{backgroundColor:'#2a2a35',borderRadius:16,padding:14,borderWidth:1,borderColor:'#333',marginBottom:10}, cardTitle:{color:'white',fontSize:14,fontWeight:'900',marginBottom:8}, cardText:{color:'#bbb',fontSize:13,lineHeight:19}, bulletRow:{flexDirection:'row',gap:8,marginBottom:7}, bullet:{color:'#7c6fcd',fontWeight:'900'}, bulletText:{flex:1,color:'#bbb',fontSize:12,lineHeight:18}, videoCard:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:'rgba(124,111,205,0.12)',borderWidth:1,borderColor:'rgba(124,111,205,0.28)',borderRadius:16,padding:14,marginBottom:12}, videoIcon:{fontSize:24,color:'white'}, videoTitle:{color:'white',fontSize:13,fontWeight:'900'}, videoSub:{color:'#aaa',fontSize:11,marginTop:2}, primaryBtn:{backgroundColor:'#7c6fcd',borderRadius:14,padding:14,alignItems:'center',marginBottom:10}, savedBtn:{backgroundColor:'#34d399'}, primaryText:{color:'white',fontSize:14,fontWeight:'900'}, secondaryBtn:{borderWidth:1,borderColor:'#3a3a45',borderRadius:14,padding:13,alignItems:'center',marginBottom:10}, secondaryText:{color:'#ddd',fontSize:13,fontWeight:'800'}, retryBtn:{backgroundColor:'#7c6fcd',borderRadius:14,padding:14,alignItems:'center'}, retryText:{color:'white',fontSize:14,fontWeight:'900'}, manualItem:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#20202a',borderRadius:12,padding:12,marginBottom:8,borderWidth:1,borderColor:'transparent'}, manualSelected:{borderColor:'#34d399',backgroundColor:'rgba(52,211,153,0.08)'}, manualText:{color:'#ddd',fontSize:13,fontWeight:'800'}, manualArrow:{color:'#777',fontSize:20}
});
