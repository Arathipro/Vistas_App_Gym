import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppSession } from '../../../context/AppSessionContext';

const QUICK_PROMPTS = [
  { id: 'entreno', icon: '🏋️', title: 'Entrenamiento', text: '¿Qué tipo de entrenamiento me recomiendas para mi objetivo?' },
  { id: 'calorias', icon: '🧮', title: 'Calorías', text: 'Calcula mis calorías de mantenimiento y dame una explicación sencilla.' },
  { id: 'tecnica', icon: '🎯', title: 'Técnica', text: 'Explícame cómo mejorar mi técnica y progresar sin lesionarme.' },
  { id: 'nutricion', icon: '🥗', title: 'Alimentación', text: 'Dame consejos generales de alimentación y macronutrientes.' },
  { id: 'conceptos', icon: '📚', title: 'Conceptos', text: 'Explícame qué es la sobrecarga progresiva con un ejemplo.' },
];

const SUGERENCIAS = [
  '¿Qué ejercicios puedo hacer para espalda?',
  '¿Qué es hipertrofia?',
  '¿Cuánto descanso entre series?',
  '¿Cómo sé si estoy progresando?',
];

function perfilDemo(perfil) {
  return {
    nombre: perfil?.nombre || 'Arath',
    objetivo: perfil?.objetivo || 'Ganar músculo',
    nivel: perfil?.nivel || 'Principiante',
    diasSemana: perfil?.diasSemana || '3 – 4 días',
    equipo: perfil?.equipo || perfil?.lugar || 'Gimnasio equipado',
    lesion: perfil?.lesion || 'No, ninguna',
    edad: Number(perfil?.edad) || 18,
    peso: Number(perfil?.peso) || 70,
    altura: Number(perfil?.altura) || 1.72,
    genero: perfil?.genero || 'Hombre',
    actividad: perfil?.actividad || 'Moderado',
  };
}

function calcularCalorias(p) {
  const alturaCm = p.altura > 3 ? p.altura : p.altura * 100;
  const base = p.genero === 'Mujer'
    ? (10 * p.peso) + (6.25 * alturaCm) - (5 * p.edad) - 161
    : (10 * p.peso) + (6.25 * alturaCm) - (5 * p.edad) + 5;
  const actividad = String(p.actividad).toLowerCase();
  const factor = actividad.includes('muy') ? 1.725 : actividad.includes('moderado') ? 1.55 : actividad.includes('sedentario') ? 1.2 : 1.375;
  const tmb = Math.round(base);
  const tdee = Math.round(tmb * factor);
  const objetivo = String(p.objetivo).toLowerCase();
  const meta = objetivo.includes('perder') ? tdee - 350 : objetivo.includes('ganar') ? tdee + 250 : tdee;
  return { tmb, tdee, meta: Math.max(1200, Math.round(meta)) };
}

function respuestaSimulada(texto, p, cal) {
  const q = texto.toLowerCase();
  const intro = `Tomando en cuenta tu perfil (${p.objetivo}, nivel ${p.nivel}, ${p.diasSemana} por semana), `;

  if (q.includes('calor') || q.includes('tmb') || q.includes('tdee')) {
    return `${intro}tu estimación aproximada es: TMB ${cal.tmb} kcal, mantenimiento ${cal.tdee} kcal y objetivo sugerido ${cal.meta} kcal/día. Úsalo como punto de partida, revisando tu progreso cada 2–3 semanas.`;
  }
  if (q.includes('espalda')) {
    return `${intro}puedes priorizar jalón al pecho, remo con polea, remo con mancuerna y face pull. Empieza con 3–4 series de 8–12 repeticiones, descansando 90–120 segundos y cuidando la técnica.`;
  }
  if (q.includes('aliment') || q.includes('macro') || q.includes('nutric')) {
    return `${intro}te conviene organizar tus comidas alrededor de proteína suficiente, carbohidratos para rendir y grasas saludables. No es una dieta médica: piensa en hábitos sostenibles, porciones razonables y constancia.`;
  }
  if (q.includes('sobrecarga') || q.includes('progres')) {
    return `${intro}la sobrecarga progresiva significa mejorar poco a poco: más repeticiones, mejor técnica, más control, más series o un poco más de peso. No necesitas subir peso cada sesión; primero domina el movimiento.`;
  }
  if (q.includes('técnica') || q.includes('tecnica') || q.includes('lesion')) {
    return `${intro}prioriza rango de movimiento controlado, calentamiento, peso manejable y descanso suficiente. Si aparece dolor persistente o molestia fuerte, lo más seguro es detenerte y consultarlo con un profesional.`;
  }
  if (q.includes('hipertrofia') || q.includes('fuerza') || q.includes('resistencia') || q.includes('entrenamiento')) {
    return `${intro}una rutina enfocada en fuerza e hipertrofia puede usar ejercicios multiarticulares al inicio y accesorios después. Para tu nivel, una progresión simple con 3–4 días por semana es mejor que una rutina demasiado compleja.`;
  }
  return `${intro}puedo orientarte con entrenamiento, técnica, alimentación general, calorías y conceptos fitness. Mi respuesta es educativa y no sustituye la guía de un entrenador, médico o nutriólogo.`;
}

export default function ChatScreen({ navigation }) {
  const { perfil } = useAppSession();
  const p = useMemo(() => perfilDemo(perfil), [perfil]);
  const cal = useMemo(() => calcularCalorias(p), [p]);
  const scrollRef = useRef(null);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const [mensajes, setMensajes] = useState([
    { id: 'm1', rol: 'ia', texto: `Hola ${p.nombre}. Soy tu asistente fitness. Puedo ayudarte con entrenamiento, técnica, alimentación general, calorías y conceptos de progreso usando tu perfil como referencia.` },
    { id: 'm2', rol: 'ia', tipo: 'perfil' },
  ]);

  function enviar(valor = texto) {
    const limpio = valor.trim();
    if (!limpio || pensando) return;
    const userMsg = { id: `u-${Date.now()}`, rol: 'user', texto: limpio };
    setMensajes(prev => [...prev, userMsg]);
    setTexto('');
    setPensando(true);
    setTimeout(() => {
      const iaMsg = { id: `ia-${Date.now()}`, rol: 'ia', texto: respuestaSimulada(limpio, p, cal) };
      setMensajes(prev => [...prev, iaMsg]);
      setPensando(false);
      setTimeout(() => scrollRef.current?.scrollToEnd?.({ animated: true }), 80);
    }, 650);
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.navigate('Home')}><Text style={s.backText}>←</Text></TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Asistente IA</Text>
          <Text style={s.headerSub}>Módulo 5 · RF33–RF39</Text>
        </View>
        <View style={s.botBadge}><Text style={s.botBadgeText}>🤖</Text></View>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={s.body} showsVerticalScrollIndicator={false} onContentSizeChange={() => scrollRef.current?.scrollToEnd?.({ animated: true })}>
        <View style={s.heroCard}>
          <View style={s.heroTop}>
            <View style={s.heroIcon}><Text style={s.heroIconText}>🤖</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.heroTitle}>Tu coach virtual</Text>
              <Text style={s.heroSub}>Respuestas educativas, personalizadas y seguras.</Text>
            </View>
          </View>
          <Text style={s.disclaimer}>Orientación general: no sustituye diagnóstico médico, nutricional ni entrenador certificado.</Text>
        </View>

        <Text style={s.sectionLabel}>Preguntas rápidas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.quickRow}>
          {QUICK_PROMPTS.map(q => (
            <TouchableOpacity key={q.id} style={s.quickCard} onPress={() => enviar(q.text)}>
              <Text style={s.quickIcon}>{q.icon}</Text>
              <Text style={s.quickTitle}>{q.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {mensajes.map(m => {
          if (m.tipo === 'perfil') return <PerfilCard key={m.id} perfil={p} cal={cal} />;
          const ia = m.rol === 'ia';
          return <View key={m.id} style={[s.msgRow, ia ? s.msgLeft : s.msgRight]}><View style={[s.bubble, ia ? s.bubbleIa : s.bubbleUser]}><Text style={ia ? s.bubbleIaText : s.bubbleUserText}>{m.texto}</Text></View></View>;
        })}

        {pensando && <View style={[s.msgRow, s.msgLeft]}><View style={[s.bubble, s.bubbleIa]}><Text style={s.typing}>Pensando respuesta segura...</Text></View></View>}

        <Text style={s.sectionLabel}>También puedes preguntar</Text>
        <View style={s.suggestionBox}>{SUGERENCIAS.map(x => <TouchableOpacity key={x} style={s.suggestion} onPress={() => enviar(x)}><Text style={s.suggestionText}>{x}</Text></TouchableOpacity>)}</View>
      </ScrollView>

      <View style={s.inputBar}>
        <TextInput style={s.input} placeholder="Pregunta sobre entrenamiento, calorías o técnica..." placeholderTextColor="#777" value={texto} onChangeText={setTexto} multiline maxLength={500} />
        <TouchableOpacity style={[s.sendBtn, (!texto.trim() || pensando) && s.sendDisabled]} onPress={() => enviar()}><Text style={s.sendText}>➤</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function PerfilCard({ perfil, cal }) {
  return <View style={s.profileCard}>
    <Text style={s.profileTitle}>Perfil usado para personalizar</Text>
    <View style={s.profileGrid}>
      <Mini label="Objetivo" value={perfil.objetivo} />
      <Mini label="Nivel" value={perfil.nivel} />
      <Mini label="Frecuencia" value={perfil.diasSemana} />
      <Mini label="Equipo" value={perfil.equipo} />
    </View>
    <View style={s.calRow}>
      <View style={s.calBox}><Text style={s.calValue}>{cal.tmb}</Text><Text style={s.calLabel}>TMB</Text></View>
      <View style={s.calBox}><Text style={s.calValue}>{cal.tdee}</Text><Text style={s.calLabel}>TDEE</Text></View>
      <View style={s.calBox}><Text style={s.calValue}>{cal.meta}</Text><Text style={s.calLabel}>meta kcal</Text></View>
    </View>
  </View>;
}

function Mini({ label, value }) {
  return <View style={s.mini}><Text style={s.miniLabel}>{label}</Text><Text style={s.miniValue} numberOfLines={1}>{value}</Text></View>;
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#1a1a22'},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:52,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#2a2a35'},
  backBtn:{width:36,height:36,borderRadius:10,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'},
  backText:{color:'white',fontSize:18,fontWeight:'900'},
  headerCenter:{flex:1,alignItems:'center',marginHorizontal:10},
  headerTitle:{color:'white',fontSize:18,fontWeight:'900'},
  headerSub:{color:'#777',fontSize:11,marginTop:2},
  botBadge:{width:36,height:36,borderRadius:12,backgroundColor:'rgba(94,234,212,0.12)',borderWidth:1,borderColor:'rgba(94,234,212,0.35)',alignItems:'center',justifyContent:'center'},
  botBadgeText:{fontSize:18},
  body:{padding:16,paddingBottom:20},
  heroCard:{backgroundColor:'rgba(124,111,205,0.14)',borderWidth:1,borderColor:'rgba(124,111,205,0.35)',borderRadius:18,padding:16,marginBottom:14},
  heroTop:{flexDirection:'row',alignItems:'center',gap:12},
  heroIcon:{width:48,height:48,borderRadius:16,backgroundColor:'#2a2a35',alignItems:'center',justifyContent:'center'},
  heroIconText:{fontSize:26},
  heroTitle:{color:'white',fontSize:18,fontWeight:'900'},
  heroSub:{color:'#aaa',fontSize:12,marginTop:3},
  disclaimer:{color:'#facc15',fontSize:11,lineHeight:16,marginTop:12,fontWeight:'700'},
  sectionLabel:{color:'#777',fontSize:11,fontWeight:'900',textTransform:'uppercase',letterSpacing:.6,marginTop:4,marginBottom:10},
  quickRow:{gap:8,paddingRight:10,marginBottom:14},
  quickCard:{width:112,backgroundColor:'#2a2a35',borderRadius:14,padding:12,borderWidth:1,borderColor:'#333'},
  quickIcon:{fontSize:24,marginBottom:8},
  quickTitle:{color:'white',fontSize:12,fontWeight:'900'},
  msgRow:{width:'100%',marginBottom:10,flexDirection:'row'},
  msgLeft:{justifyContent:'flex-start'},
  msgRight:{justifyContent:'flex-end'},
  bubble:{maxWidth:'84%',borderRadius:16,padding:13},
  bubbleIa:{backgroundColor:'#2a2a35',borderWidth:1,borderColor:'#333',borderTopLeftRadius:4},
  bubbleUser:{backgroundColor:'#7c6fcd',borderTopRightRadius:4},
  bubbleIaText:{color:'#ddd',fontSize:13,lineHeight:19},
  bubbleUserText:{color:'white',fontSize:13,lineHeight:19,fontWeight:'700'},
  typing:{color:'#5eead4',fontSize:13,fontWeight:'800'},
  profileCard:{backgroundColor:'#20202b',borderRadius:16,padding:14,borderWidth:1,borderColor:'#333',marginBottom:12},
  profileTitle:{color:'#5eead4',fontSize:13,fontWeight:'900',marginBottom:10},
  profileGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  mini:{width:'48%',backgroundColor:'#2a2a35',borderRadius:10,padding:9,borderWidth:1,borderColor:'#363642'},
  miniLabel:{color:'#777',fontSize:10,fontWeight:'900',textTransform:'uppercase'},
  miniValue:{color:'white',fontSize:12,fontWeight:'800',marginTop:3},
  calRow:{flexDirection:'row',gap:8,marginTop:10},
  calBox:{flex:1,alignItems:'center',backgroundColor:'rgba(94,234,212,0.08)',borderWidth:1,borderColor:'rgba(94,234,212,0.25)',borderRadius:10,padding:9},
  calValue:{color:'#5eead4',fontSize:16,fontWeight:'900'},
  calLabel:{color:'#888',fontSize:10,marginTop:2,textTransform:'uppercase'},
  suggestionBox:{gap:8,marginBottom:8},
  suggestion:{backgroundColor:'#2a2a35',borderRadius:12,padding:12,borderWidth:1,borderColor:'#333'},
  suggestionText:{color:'#ddd',fontSize:13,fontWeight:'700'},
  inputBar:{flexDirection:'row',alignItems:'flex-end',gap:10,padding:12,paddingBottom:Platform.OS === 'ios' ? 28 : 12,borderTopWidth:1,borderTopColor:'#2a2a35',backgroundColor:'#1f1f29'},
  input:{flex:1,maxHeight:96,backgroundColor:'#2a2a35',borderWidth:1,borderColor:'#3a3a45',borderRadius:14,paddingHorizontal:13,paddingVertical:11,color:'white',fontSize:13},
  sendBtn:{width:44,height:44,borderRadius:14,backgroundColor:'#7c6fcd',alignItems:'center',justifyContent:'center'},
  sendDisabled:{opacity:.45},
  sendText:{color:'white',fontSize:18,fontWeight:'900'},
});
