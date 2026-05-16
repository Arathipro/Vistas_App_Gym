import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ── Módulo 1: Auth (100% funcional offline) ──────────────────────────────────
import SplashScreen       from '../../modules/auth/screens/SplashScreen';
import RegisterScreen     from '../../modules/auth/screens/RegisterScreen';
import LoginScreen        from '../../modules/auth/screens/LoginScreen';
import SurveyScreen       from '../../modules/auth/screens/SurveyScreen';
import HomeScreen         from '../../modules/auth/screens/HomeScreen';
import ProfileScreen      from '../../modules/auth/screens/ProfileScreen';
import EditProfileScreen  from '../../modules/auth/screens/EditProfileScreen';
import ForgotPasswordScreen from '../../modules/auth/screens/ForgotPasswordScreen';
import ChangeEmailScreen  from '../../modules/auth/screens/ChangeEmailScreen';

// ── Módulos 2–9: Placeholders visuales ───────────────────────────────────────
import {
  // Módulo 2: Medidas
  MedidasScreen,
  MedidasRegScreen,
  MedidasHistScreen,
  // Módulo 3: Entrenamiento
  RutinasScreen,
  CrearRutinaScreen,
  RutinaDetalleScreen,
  EditarRutinaScreen,
  EjerciciosScreen,
  EjercicioDetScreen,
  // Módulo 4: Sesión activa
  PreSesionScreen,
  SesionActivaScreen,
  // Módulo 5: Asistente IA
  ChatScreen,
  // Módulo 6: Escáner Gym
  ScannerGymScreen,
  ScannerResultGymScreen,
  // Módulo 7: Escáner Alimentos
  ScannerFoodScreen,
  ScannerResultFoodScreen,
  HistorialFoodScreen,
  // Módulo 8: Progreso
  ProgresoScreen,
  HistorialSesionesScreen,
  // Módulo 9: Social
  SocialScreen,
  AmigosScreen,
  GruposScreen,
  NotificacionesScreen,
  RankingScreen,
  PrivacidadScreen,
} from '../../modules/placeholders/PlaceholderScreens';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* ── MÓDULO 1: Auth — funcional offline ── */}
        <Stack.Screen name="Splash"          component={SplashScreen} />
        <Stack.Screen name="Register"        component={RegisterScreen} />
        <Stack.Screen name="Login"           component={LoginScreen} />
        <Stack.Screen name="Survey"          component={SurveyScreen} />
        <Stack.Screen name="Home"            component={HomeScreen} />
        <Stack.Screen name="Profile"         component={ProfileScreen} />
        <Stack.Screen name="EditProfile"     component={EditProfileScreen} />
        <Stack.Screen name="ForgotPassword"  component={ForgotPasswordScreen} />
        <Stack.Screen name="ChangeEmail"     component={ChangeEmailScreen} />

        {/* ── MÓDULO 2: Medidas corporales ── */}
        <Stack.Screen name="Medidas"         component={MedidasScreen} />
        <Stack.Screen name="MedidasReg"      component={MedidasRegScreen} />
        <Stack.Screen name="MedidasHist"     component={MedidasHistScreen} />

        {/* ── MÓDULO 3: Entrenamiento ── */}
        <Stack.Screen name="Rutinas"         component={RutinasScreen} />
        <Stack.Screen name="CrearRutina"     component={CrearRutinaScreen} />
        <Stack.Screen name="RutinaDetalle"   component={RutinaDetalleScreen} />
        <Stack.Screen name="EditarRutina"    component={EditarRutinaScreen} />
        <Stack.Screen name="Ejercicios"      component={EjerciciosScreen} />
        <Stack.Screen name="EjercicioDet"    component={EjercicioDetScreen} />

        {/* ── MÓDULO 4: Sesión activa ── */}
        <Stack.Screen name="PreSesion"       component={PreSesionScreen} />
        <Stack.Screen name="SesionActiva"    component={SesionActivaScreen} />

        {/* ── MÓDULO 5: Asistente IA ── */}
        <Stack.Screen name="Chat"            component={ChatScreen} />

        {/* ── MÓDULO 6: Escáner Gym ── */}
        <Stack.Screen name="ScannerGym"      component={ScannerGymScreen} />
        <Stack.Screen name="ScannerResultGym" component={ScannerResultGymScreen} />

        {/* ── MÓDULO 7: Escáner Alimentos ── */}
        <Stack.Screen name="ScannerFood"     component={ScannerFoodScreen} />
        <Stack.Screen name="ScannerResultFood" component={ScannerResultFoodScreen} />
        <Stack.Screen name="HistorialFood"   component={HistorialFoodScreen} />

        {/* ── MÓDULO 8: Progreso ── */}
        <Stack.Screen name="Progreso"        component={ProgresoScreen} />
        <Stack.Screen name="HistorialSesiones" component={HistorialSesionesScreen} />

        {/* ── MÓDULO 9: Social ── */}
        <Stack.Screen name="Social"          component={SocialScreen} />
        <Stack.Screen name="Amigos"          component={AmigosScreen} />
        <Stack.Screen name="Grupos"          component={GruposScreen} />
        <Stack.Screen name="Notificaciones"  component={NotificacionesScreen} />
        <Stack.Screen name="Ranking"         component={RankingScreen} />
        <Stack.Screen name="Privacidad"      component={PrivacidadScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
