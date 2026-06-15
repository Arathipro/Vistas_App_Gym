import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PRIVACY_OPTIONS } from '../data/socialMock';
import { useSocial } from '../context/SocialContext';
import { C, s } from '../styles/socialStyles';

export default function PrivacidadScreen({ navigation }) {
  const { permisos, togglePermiso } = useSocial();
  const [audiencia, setAudiencia] = useState('Amigos');
  const [guardado, setGuardado] = useState(false);
  const activos = Object.values(permisos).filter(Boolean).length;

  function guardar() {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 1800);
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Social')} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Privacidad</Text>
        <TouchableOpacity onPress={guardar} style={s.headerAction}>
          <Text style={s.headerActionText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={[s.heroBadge, { color: C.red }]}>RF67 · RF68</Text>
              <Text style={s.heroTitle}>Tú controlas tus datos</Text>
              <Text style={s.heroSub}>Define qué información puede utilizarse en comparativas, actividad social y rankings.</Text>
            </View>
            <View style={[s.heroIcon, { backgroundColor: 'rgba(248,113,113,0.10)', borderColor: 'rgba(248,113,113,0.32)' }]}>
              <Text style={{ fontSize: 30 }}>🔒</Text>
            </View>
          </View>
        </View>

        {guardado ? (
          <View style={[s.card, { backgroundColor: 'rgba(52,211,153,0.10)', borderColor: 'rgba(52,211,153,0.32)' }]}>
            <Text style={{ color: C.green, fontSize: 12, fontWeight: '900' }}>✓ Preferencias guardadas en la demo</Text>
            <Text style={{ color: C.sub, fontSize: 10, marginTop: 4 }}>Los cambios se reflejan visualmente durante esta sesión.</Text>
          </View>
        ) : null}

        <View style={[s.card, s.privacySummary]}>
          <View style={[s.row, { justifyContent: 'space-between' }]}>
            <View>
              <Text style={{ color: C.text, fontSize: 27, fontWeight: '900' }}>{activos}/{PRIVACY_OPTIONS.length}</Text>
              <Text style={{ color: C.teal, fontSize: 11, fontWeight: '900', marginTop: 2 }}>PERMISOS ACTIVOS</Text>
            </View>
            <View style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 7, borderColor: C.purple, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: C.text, fontSize: 15, fontWeight: '900' }}>{Math.round((activos / PRIVACY_OPTIONS.length) * 100)}%</Text>
            </View>
          </View>
          <Text style={{ color: C.sub, fontSize: 10, lineHeight: 16, marginTop: 12 }}>Estos permisos afectan la visualización de progreso, las comparativas con amigos y tu participación en rankings.</Text>
        </View>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Audiencia predeterminada</Text>
        </View>
        <View style={s.chips}>
          {['Amigos', 'Grupos', 'Solo yo'].map(item => (
            <TouchableOpacity key={item} onPress={() => setAudiencia(item)} style={[s.chip, audiencia === item && s.chipOn]}>
              <Text style={[s.chipText, audiencia === item && s.chipTextOn]}>{item === 'Amigos' ? '🤝 ' : item === 'Grupos' ? '👥 ' : '🔐 '}{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ color: C.muted, fontSize: 10, lineHeight: 15, marginBottom: 14 }}>
          {audiencia === 'Amigos'
            ? 'Tus métricas permitidas serán visibles para amistades aceptadas.'
            : audiencia === 'Grupos'
              ? 'Las métricas permitidas podrán aparecer dentro de tus grupos.'
              : 'Tu progreso permanecerá visible únicamente para ti.'}
        </Text>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Información compartida</Text>
          <Text style={s.sectionLabel}>TOCA PARA CAMBIAR</Text>
        </View>

        {PRIVACY_OPTIONS.map(option => {
          const active = permisos[option.key];
          return (
            <TouchableOpacity
              key={option.key}
              style={[s.optionCard, option.locked && s.locked]}
              onPress={() => togglePermiso(option.key)}
              activeOpacity={option.locked ? 1 : 0.76}
            >
              <View style={[s.iconBox, { width: 42, height: 42 }]}>
                <Text style={{ fontSize: 20 }}>{option.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.optionTitle}>{option.titulo}</Text>
                <Text style={s.optionSub}>{option.detalle}</Text>
                {option.locked ? <Text style={{ color: C.red, fontSize: 9, fontWeight: '900', marginTop: 5 }}>BLOQUEADO POR PRIVACIDAD</Text> : null}
              </View>
              <View style={[s.switchTrack, active && s.switchTrackOn, option.locked && { backgroundColor: C.surface }]}>
                <View style={[s.switchKnob, active && s.switchKnobOn]} />
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={[s.card, s.warning]}>
          <Text style={s.warningTitle}>🔒 Las notas siempre son privadas</Text>
          <Text style={s.warningText}>Las notas de sesión, ejercicio o serie solo aparecen en tu historial personal. No se muestran a amigos, grupos ni rankings, aunque compartas tu progreso.</Text>
        </View>

        <View style={s.card}>
          <Text style={s.sectionTitle}>Qué pueden ver tus amigos</Text>
          <View style={{ marginTop: 10 }}>
            {PRIVACY_OPTIONS.filter(option => permisos[option.key]).map(option => (
              <View key={option.key} style={[s.row, { gap: 8, paddingVertical: 6 }]}>
                <Text style={{ color: C.green, fontWeight: '900' }}>✓</Text>
                <Text style={{ color: C.sub, fontSize: 10 }}>{option.titulo}</Text>
              </View>
            ))}
            {activos === 0 ? <Text style={{ color: C.muted, fontSize: 10 }}>No compartes ninguna métrica social.</Text> : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
