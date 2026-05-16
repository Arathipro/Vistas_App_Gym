import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { saveProfile } from '../db/database';

const STEPS = [
  { q: '¿Cuál es tu objetivo principal?', opts: ['Perder peso', 'Ganar músculo', 'Mantenerme', 'Mejorar resistencia', 'Tonificación'] },
  { q: '¿Cuántos años llevas entrenando?', opts: ['Soy principiante', 'Menos de 1 año', '1 – 2 años', 'Más de 2 años'] },
  { q: '¿Cuántos días puedes entrenar por semana?', opts: ['1 – 2 días', '3 – 4 días', '5 – 6 días', 'Todos los días'] },
  { q: '¿Dónde entrenas principalmente?', opts: ['Gimnasio equipado', 'Casa (equipo básico)', 'Casa (sin equipo)', 'Al aire libre'] },
  { q: '¿Qué equipamiento tienes disponible?', opts: ['Máquinas y pesas', 'Solo mancuernas', 'Bandas de resistencia', 'Solo peso corporal'] },
  { q: '¿Cuál es tu nivel de actividad diaria?', opts: ['Sedentario', 'Ligero', 'Moderado', 'Muy activo'] },
  { q: '¿Tienes alguna limitación física?', opts: ['No, ninguna', 'Espalda / columna', 'Rodillas / tobillos', 'Hombros / codos'] },
  { q: '¿Qué tan importante es la alimentación?', opts: ['Muy importante', 'Importante pero ya lo manejo', 'Prefiero solo entrenar'] },
  { q: '¿Qué esperas de la app?', opts: ['Seguimiento de progreso', 'Rutinas estructuradas', 'Asistente IA', 'Todo lo anterior'] },
];

export default function SurveyScreen({ navigation, route }) {
  const { nombre, email, userId } = route.params || {};
  const [step, setStep] = useState(0);
  const [respuestas, setResp] = useState({});
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [genero, setGenero] = useState('');
  const [loading, setLoading] = useState(false);

  const totalSteps = STEPS.length + 1;
  const esPasoFisico = step === STEPS.length;
  const puedeTerminar = edad && peso && altura && genero;

  function seleccionar(opt) {
    setResp(r => ({ ...r, [step]: opt }));
    setStep(s => s + 1);
  }

  async function terminar() {
    if (!puedeTerminar) return;
    setLoading(true);
    try {
      const nivel = respuestas[1] === 'Más de 2 años' ? 'Avanzado'
        : respuestas[1] === '1 – 2 años' ? 'Intermedio' : 'Principiante';

      await saveProfile(userId, {
        edad: parseInt(edad),
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        genero,
        objetivo: respuestas[0] || 'Ganar músculo',
        nivel,
        diasSemana: respuestas[2] || '3 – 4 días',
      });
      navigation.replace('Home', { user: { id: userId, nombre, email } });
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar tu perfil.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Encuesta inicial</Text>
      <Text style={styles.stepLabel}>{step + 1} / {totalSteps}</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((step + 1) / totalSteps) * 100}%` }]} />
      </View>

      {!esPasoFisico ? (
        <View style={styles.card}>
          <Text style={styles.question}>{STEPS[step].q}</Text>
          {STEPS[step].opts.map(opt => (
            <TouchableOpacity key={opt}
              style={[styles.option, respuestas[step] === opt && styles.optionSelected]}
              onPress={() => seleccionar(opt)}>
              <Text style={[styles.optionText, respuestas[step] === opt && styles.optionTextSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.question}>Cuéntanos sobre ti</Text>

          <Text style={styles.label}>Género</Text>
          <View style={styles.row}>
            {['Hombre', 'Mujer', 'Otro'].map(g => (
              <TouchableOpacity key={g} onPress={() => setGenero(g)}
                style={[styles.genderBtn, genero === g && styles.genderBtnSelected]}>
                <Text style={[styles.genderText, genero === g && styles.genderTextSelected]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            {[
              { label: 'Edad', val: edad, set: setEdad, ph: '25' },
              { label: 'Peso (kg)', val: peso, set: setPeso, ph: '70' },
              { label: 'Altura (m)', val: altura, set: setAltura, ph: '1.75' },
            ].map(f => (
              <View key={f.label} style={styles.inputGroup}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput style={styles.input} placeholder={f.ph}
                  placeholderTextColor="#666" value={f.val}
                  onChangeText={f.set} keyboardType="numeric" />
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.btn, { opacity: puedeTerminar && !loading ? 1 : 0.45 }]}
            onPress={terminar} disabled={!puedeTerminar || loading}>
            <Text style={styles.btnText}>{loading ? 'Guardando...' : 'Comenzar →'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {step > 0 && (
        <TouchableOpacity onPress={() => setStep(s => s - 1)}>
          <Text style={styles.back}>← Anterior</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a22' },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: '800', color: 'white', marginBottom: 4 },
  stepLabel: { fontSize: 12, color: '#7c6fcd', marginBottom: 10 },
  progressBar: { height: 4, backgroundColor: '#2a2a35', borderRadius: 2, marginBottom: 24 },
  progressFill: { height: 4, backgroundColor: '#7c6fcd', borderRadius: 2 },
  card: { backgroundColor: '#2a2a35', borderRadius: 16, padding: 20, marginBottom: 16 },
  question: { fontSize: 16, fontWeight: '700', color: 'white', marginBottom: 16 },
  option: { padding: 14, borderRadius: 10, borderWidth: 1.5, borderColor: 'transparent', backgroundColor: '#1a1a22', marginBottom: 8 },
  optionSelected: { borderColor: '#7c6fcd', backgroundColor: 'rgba(124,111,205,0.15)' },
  optionText: { color: '#aaa', fontSize: 14 },
  optionTextSelected: { color: 'white', fontWeight: '700' },
  label: { fontSize: 12, color: '#aaa', marginBottom: 6, marginTop: 10 },
  row: { flexDirection: 'row', gap: 8 },
  genderBtn: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#1a1a22', borderWidth: 1.5, borderColor: 'transparent', alignItems: 'center' },
  genderBtnSelected: { borderColor: '#7c6fcd', backgroundColor: 'rgba(124,111,205,0.15)' },
  genderText: { color: '#aaa', fontSize: 13 },
  genderTextSelected: { color: 'white', fontWeight: '700' },
  inputGroup: { flex: 1 },
  input: { backgroundColor: '#1a1a22', borderRadius: 10, padding: 12, color: 'white', fontSize: 14, borderWidth: 1, borderColor: '#333', textAlign: 'center' },
  btn: { backgroundColor: '#7c6fcd', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  back: { color: '#666', fontSize: 13, textAlign: 'center', marginTop: 8 },
});