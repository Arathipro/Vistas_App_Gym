/**
 * PlaceholderScreens.js
 * Pantallas placeholder para módulos 2–9.
 * Mismo lenguaje visual del módulo 1: fondo #13132a / #1a1a22,
 * acentos #7c6fcd y #5eead4, cards #2a2a35.
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// ─── Componente base reutilizable ────────────────────────────────────────────
function PlaceholderScreen({ navigation, icon, title, badge, items = [], backScreen, backLabel = '← Inicio' }) {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => backScreen ? navigation.navigate(backScreen) : navigation.goBack()}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{title}</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.heroCard}>
          <Text style={s.heroIcon}>{icon}</Text>
          <Text style={s.heroTitle}>{title}</Text>
          <View style={s.badge}><Text style={s.badgeText}>{badge}</Text></View>
          <Text style={s.heroSub}>Esta sección estará disponible próximamente. El módulo 1 ya funciona al 100%.</Text>
        </View>
        {items.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={s.itemCard}
            onPress={item.screen ? () => navigation.navigate(item.screen) : undefined}
          >
            <Text style={s.itemIcon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.itemTitle}>{item.title}</Text>
              {item.sub ? <Text style={s.itemSub}>{item.sub}</Text> : null}
            </View>
            {item.screen && <Text style={s.itemArrow}>›</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── MÓDULO 2: Medidas corporales ────────────────────────────────────────────
export function MedidasScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="📏" title="Medidas corporales" badge="Módulo 2 · RF09–RF11"
      backScreen="Home"
      items={[
        { icon: '➕', title: 'Nueva medición',       sub: 'Registrar brazos, cintura, piernas…', screen: 'MedidasReg' },
        { icon: '📈', title: 'Historial de medidas', sub: 'Ver evolución y gráficas',            screen: 'MedidasHist' },
      ]}
    />
  );
}

export function MedidasRegScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="➕" title="Nueva medición" badge="RF09"
      items={[
        { icon: '⚖️',  title: 'Peso (kg)',          sub: 'Placeholder — sin lógica aún' },
        { icon: '📐', title: 'Brazos (cm)',          sub: 'Placeholder — sin lógica aún' },
        { icon: '📐', title: 'Cintura (cm)',         sub: 'Placeholder — sin lógica aún' },
        { icon: '📐', title: 'Cadera (cm)',          sub: 'Placeholder — sin lógica aún' },
        { icon: '📐', title: 'Pecho (cm)',           sub: 'Placeholder — sin lógica aún' },
        { icon: '📐', title: 'Muslos (cm)',          sub: 'Placeholder — sin lógica aún' },
      ]}
    />
  );
}

export function MedidasHistScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="📈" title="Historial de medidas" badge="RF10–RF11"
      items={[
        { icon: '📅', title: '10 Mar 2026', sub: '74.2 kg · 88/72/96 cm' },
        { icon: '📅', title: '25 Feb 2026', sub: '75.0 kg · 89/73/97 cm' },
        { icon: '📅', title: '10 Feb 2026', sub: '75.8 kg · 90/74/98 cm' },
      ]}
    />
  );
}

// ─── MÓDULO 3: Entrenamientos / Rutinas ──────────────────────────────────────
export function RutinasScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🏋️" title="Entrenamientos" badge="Módulo 3 · RF12–RF19"
      backScreen="Home"
      items={[
        { icon: '🗂️', title: 'Crear rutina',      sub: 'Arma tu rutina personalizada',   screen: 'CrearRutina' },
        { icon: '📚', title: 'Catálogo ejercicios', sub: 'Explora más de 50 ejercicios', screen: 'Ejercicios' },
        { icon: '📅', title: 'Rutina Full Body',   sub: '5 ejercicios · ~45 min',         screen: 'RutinaDetalle' },
        { icon: '📅', title: 'Rutina Push',        sub: '6 ejercicios · ~50 min',         screen: 'RutinaDetalle' },
      ]}
    />
  );
}

export function CrearRutinaScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🗂️" title="Crear rutina" badge="RF17"
      items={[
        { icon: '✏️', title: 'Nombre de la rutina',    sub: 'Placeholder — sin lógica aún' },
        { icon: '➕', title: 'Agregar ejercicios',      sub: 'Placeholder — sin lógica aún', screen: 'Ejercicios' },
        { icon: '⏱️', title: 'Tiempo estimado',        sub: 'Se calculará automáticamente' },
      ]}
    />
  );
}

export function RutinaDetalleScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="📅" title="Detalle de rutina" badge="RF19"
      items={[
        { icon: '▶️', title: 'Iniciar sesión',     sub: 'Comenzar entrenamiento',  screen: 'PreSesion' },
        { icon: '✏️', title: 'Editar rutina',      sub: 'Modificar ejercicios',    screen: 'EditarRutina' },
        { icon: '🏋️', title: 'Press de banca',    sub: '4 series · 70 kg · 90s descanso' },
        { icon: '🏋️', title: 'Sentadilla',        sub: '4 series · 80 kg · 150s descanso' },
        { icon: '🏋️', title: 'Jalón al pecho',   sub: '3 series · 55 kg · 90s descanso' },
      ]}
    />
  );
}

export function EditarRutinaScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="✏️" title="Editar rutina" badge="RF18"
      items={[
        { icon: '🔃', title: 'Reordenar ejercicios', sub: 'Placeholder — sin lógica aún' },
        { icon: '➕', title: 'Agregar ejercicio',     sub: 'Placeholder — sin lógica aún', screen: 'Ejercicios' },
        { icon: '🗑️', title: 'Eliminar ejercicio',   sub: 'Placeholder — sin lógica aún' },
      ]}
    />
  );
}

export function EjerciciosScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="📚" title="Catálogo de ejercicios" badge="RF12–RF15"
      items={[
        { icon: '💪', title: 'Press de banca',     sub: 'Pecho · Multiarticular',    screen: 'EjercicioDet' },
        { icon: '💪', title: 'Sentadilla',         sub: 'Piernas · Multiarticular',  screen: 'EjercicioDet' },
        { icon: '💪', title: 'Peso muerto',        sub: 'Espalda · Multiarticular',  screen: 'EjercicioDet' },
        { icon: '💪', title: 'Curl de bíceps',     sub: 'Brazos · Monoarticular',    screen: 'EjercicioDet' },
        { icon: '💪', title: 'Extensión tríceps',  sub: 'Brazos · Monoarticular',    screen: 'EjercicioDet' },
        { icon: '💪', title: 'Jalón al pecho',     sub: 'Espalda · Multiarticular',  screen: 'EjercicioDet' },
        { icon: '➕', title: 'Crear ejercicio personalizado', sub: 'RF14',            screen: 'EjercicioDet' },
      ]}
    />
  );
}

export function EjercicioDetScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🔍" title="Detalle de ejercicio" badge="RF12–RF13"
      items={[
        { icon: '🎥', title: 'Video demostrativo',  sub: 'Disponible en módulo real' },
        { icon: '💪', title: 'Grupo muscular',      sub: 'Pecho principal · Tríceps secundario' },
        { icon: '⏱️', title: 'Tiempos recomendados', sub: 'Serie: 60s · Descanso: 120s' },
        { icon: '🔗', title: 'Tipo',                sub: 'Multiarticular bilateral' },
      ]}
    />
  );
}

// ─── MÓDULO 4: Sesión activa ──────────────────────────────────────────────────
export function PreSesionScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="▶️" title="Pre-Sesión" badge="Módulo 4 · RF20"
      items={[
        { icon: '⏱️', title: 'Tiempo estimado: 45 min', sub: 'Basado en series y descansos configurados' },
        { icon: '🏋️', title: 'Press de banca',          sub: '4 series · 70 kg · 90s descanso' },
        { icon: '🏋️', title: 'Sentadilla',              sub: '4 series · 80 kg · 150s descanso' },
        { icon: '▶️', title: 'Iniciar entrenamiento',   sub: 'Placeholder — sin lógica aún', screen: 'SesionActiva' },
      ]}
    />
  );
}

export function SesionActivaScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="⏱️" title="Sesión activa" badge="RF20–RF32"
      items={[
        { icon: '🔢', title: 'Serie 1 de 4',          sub: 'Press de banca · 70 kg' },
        { icon: '⏱️', title: 'Contador preparación',  sub: '3 seg → inicio automático' },
        { icon: '⏸️', title: 'Cronómetro serie',       sub: 'Se detiene manualmente' },
        { icon: '😴', title: 'Descanso: 90s',         sub: 'Formulario registro simultáneo' },
        { icon: '📝', title: 'Nota de serie',         sub: 'Hasta 500 caracteres opcionales' },
      ]}
    />
  );
}

// ─── MÓDULO 5: Asistente IA ───────────────────────────────────────────────────
export function ChatScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🤖" title="Asistente IA" badge="Módulo 5 · RF33–RF39"
      backScreen="Home"
      items={[
        { icon: '💬', title: '¿Cuántas calorías necesito?',      sub: 'Consulta de ejemplo' },
        { icon: '💬', title: '¿Qué ejercicios para espalda?',    sub: 'Consulta de ejemplo' },
        { icon: '💬', title: 'Explícame la sobrecarga progresiva', sub: 'Consulta de ejemplo' },
        { icon: '🧮', title: 'Cálculo TMB / TDEE',              sub: 'RF37 — basado en tu perfil' },
      ]}
    />
  );
}

// ─── MÓDULO 6: Escáner Gym ────────────────────────────────────────────────────
export function ScannerGymScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="📷" title="Escáner Gym" badge="Módulo 6 · RF40–RF44"
      backScreen="Home"
      items={[
        { icon: '📸', title: 'Capturar foto de máquina',  sub: 'Identifica equipos con IA' },
        { icon: '🏗️', title: 'Resultado identificación',  sub: 'Nombre · músculos · recomendaciones', screen: 'ScannerResultGym' },
      ]}
    />
  );
}

export function ScannerResultGymScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🏗️" title="Resultado Gym" badge="RF42–RF44"
      items={[
        { icon: '🏗️', title: 'Press de pecho en máquina', sub: 'Confianza: 94%' },
        { icon: '💪', title: 'Músculos',                  sub: 'Pectoral mayor · Tríceps · Deltoides anterior' },
        { icon: '🎥', title: 'Video demostrativo',        sub: 'Disponible en módulo real' },
        { icon: '💾', title: 'Guardar en catálogo',       sub: 'RF44' },
      ]}
    />
  );
}

// ─── MÓDULO 7: Escáner Alimentos ─────────────────────────────────────────────
export function ScannerFoodScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🥗" title="Escáner Alimentos" badge="Módulo 7 · RF45–RF49"
      backScreen="Home"
      items={[
        { icon: '📸', title: 'Capturar foto de alimento',  sub: 'Identifica calorías con IA' },
        { icon: '🍎', title: 'Ver resultado',              sub: 'Calorías + macronutrientes', screen: 'ScannerResultFood' },
        { icon: '🗃️', title: 'Historial alimentos',       sub: 'Escaneos anteriores',        screen: 'HistorialFood' },
      ]}
    />
  );
}

export function ScannerResultFoodScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🍎" title="Resultado Alimento" badge="RF47–RF48"
      items={[
        { icon: '🍎', title: 'Manzana mediana',          sub: 'Identificado con 89% confianza' },
        { icon: '🔥', title: '95 kcal aprox.',           sub: '⚠️ Margen de error ±20-30% (RF48)' },
        { icon: '🥩', title: 'Proteínas: 0.5g',         sub: 'Macronutriente' },
        { icon: '🌾', title: 'Carbohidratos: 25g',      sub: 'Macronutriente' },
        { icon: '🧈', title: 'Grasas: 0.3g',            sub: 'Macronutriente' },
      ]}
    />
  );
}

export function HistorialFoodScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🗃️" title="Historial Alimentos" badge="RF49"
      items={[
        { icon: '🍎', title: 'Manzana · hoy',          sub: '95 kcal' },
        { icon: '🍗', title: 'Pollo a la plancha · ayer', sub: '165 kcal' },
        { icon: '🥑', title: 'Aguacate · hace 2 días', sub: '234 kcal' },
      ]}
    />
  );
}

// ─── MÓDULO 8: Progreso ───────────────────────────────────────────────────────
export function ProgresoScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="📊" title="Progreso" badge="Módulo 8 · RF50–RF57"
      backScreen="Home"
      items={[
        { icon: '📈', title: 'Gráfica evolución peso',       sub: 'Últimos 3 meses' },
        { icon: '💪', title: 'Progreso por ejercicio',       sub: 'Press banca: 60kg → 75kg', screen: 'HistorialSesiones' },
        { icon: '📋', title: 'Historial sesiones',          sub: 'Ver entrenamientos pasados', screen: 'HistorialSesiones' },
        { icon: '🔥', title: 'Racha actual: 14 días',       sub: 'Adherencia semanal: 92%' },
        { icon: '📤', title: 'Exportar datos',              sub: 'CSV o PDF (RF57)' },
      ]}
    />
  );
}

export function HistorialSesionesScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="📋" title="Historial Sesiones" badge="RF26 · RF56"
      items={[
        { icon: '🏋️', title: 'Full Body · Hoy',         sub: '45 min · 3 ejercicios completados' },
        { icon: '🏋️', title: 'Push · Ayer',            sub: '52 min · 4 ejercicios completados' },
        { icon: '🏋️', title: 'Pull · Hace 3 días',     sub: '41 min · 3 ejercicios completados' },
      ]}
    />
  );
}

// ─── MÓDULO 9: Social ─────────────────────────────────────────────────────────
export function SocialScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="👥" title="Comunidad" badge="Módulo 9 · RF58–RF72"
      backScreen="Home"
      items={[
        { icon: '🤝', title: 'Mis amigos',           sub: '3 conexiones activas',       screen: 'Amigos' },
        { icon: '👥', title: 'Grupos',               sub: '1 grupo activo',             screen: 'Grupos' },
        { icon: '🏆', title: 'Rankings',             sub: 'Comparar métricas',          screen: 'Ranking' },
        { icon: '🔔', title: 'Notificaciones',       sub: '2 solicitudes pendientes',   screen: 'Notificaciones' },
      ]}
    />
  );
}

export function AmigosScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🤝" title="Amigos" badge="RF58–RF66"
      items={[
        { icon: '👤', title: 'María García',    sub: 'Amiga · entrena hoy' },
        { icon: '👤', title: 'Luis Torres',    sub: 'Amigo · racha 8 días' },
        { icon: '🔍', title: 'Buscar usuarios', sub: 'Por nombre o código (RF58)' },
      ]}
    />
  );
}

export function GruposScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="👥" title="Grupos" badge="RF71–RF72"
      items={[
        { icon: '👥', title: 'Grupo Gym DPUAS', sub: '5 miembros · Activo' },
        { icon: '➕', title: 'Crear grupo',      sub: 'Placeholder — sin lógica aún' },
      ]}
    />
  );
}

export function NotificacionesScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🔔" title="Notificaciones" badge="RF72"
      items={[
        { icon: '🤝', title: 'Solicitud de amistad',   sub: 'Juan Pérez quiere conectar' },
        { icon: '🏋️', title: 'María comenzó entreno', sub: 'Hace 10 minutos' },
      ]}
    />
  );
}

export function RankingScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🏆" title="Rankings" badge="RF70"
      backScreen="Home"
      items={[
        { icon: '🥇', title: 'Luis Torres',   sub: '28 sesiones este mes' },
        { icon: '🥈', title: 'María García',  sub: '24 sesiones este mes' },
        { icon: '🥉', title: 'Tú',            sub: '20 sesiones este mes' },
      ]}
    />
  );
}

export function PrivacidadScreen({ navigation }) {
  return (
    <PlaceholderScreen
      navigation={navigation}
      icon="🔒" title="Privacidad" badge="RF67"
      items={[
        { icon: '📊', title: 'Compartir progreso',    sub: 'Desactivado' },
        { icon: '📏', title: 'Compartir medidas',     sub: 'Desactivado' },
        { icon: '🏋️', title: 'Compartir entrenamientos', sub: 'Activado' },
      ]}
    />
  );
}

// ─── Estilos compartidos ─────────────────────────────────────────────────────
const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#1a1a22' },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#2a2a35' },
  back:        { fontSize: 24, color: 'white' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: 'white' },
  content:     { padding: 20, paddingBottom: 40 },
  heroCard:    { backgroundColor: '#2a2a35', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, gap: 8 },
  heroIcon:    { fontSize: 48, marginBottom: 4 },
  heroTitle:   { fontSize: 20, fontWeight: '800', color: 'white' },
  badge:       { backgroundColor: 'rgba(124,111,205,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(124,111,205,0.4)' },
  badgeText:   { fontSize: 11, color: '#7c6fcd', fontWeight: '600' },
  heroSub:     { fontSize: 12, color: '#666', textAlign: 'center', lineHeight: 18 },
  itemCard:    { backgroundColor: '#2a2a35', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  itemIcon:    { fontSize: 22, marginRight: 12 },
  itemTitle:   { fontSize: 14, fontWeight: '600', color: 'white' },
  itemSub:     { fontSize: 12, color: '#666', marginTop: 2 },
  itemArrow:   { fontSize: 22, color: '#555' },
});
