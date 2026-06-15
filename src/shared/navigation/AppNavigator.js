import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppSessionProvider } from '../../context/AppSessionContext';
import { RutinasProvider } from '../../context/RutinasContext';
import { ScannerDemoProvider } from '../../context/ScannerDemoContext';
import { SocialProvider } from '../../modules/mod9_social/context/SocialContext';

// ── Módulo 1: Auth (100% funcional offline) ──────────────────────────────────
import SplashScreen          from '../../modules/auth/screens/SplashScreen';
import RegisterScreen        from '../../modules/auth/screens/RegisterScreen';
import LoginScreen           from '../../modules/auth/screens/LoginScreen';
import SurveyScreen          from '../../modules/auth/screens/SurveyScreen';
import HomeScreen            from '../../modules/auth/screens/HomeScreen';
import ProfileScreen         from '../../modules/auth/screens/ProfileScreen';
import EditProfileScreen     from '../../modules/auth/screens/EditProfileScreen';
import ForgotPasswordScreen  from '../../modules/auth/screens/ForgotPasswordScreen';
import ChangeEmailScreen     from '../../modules/auth/screens/ChangeEmailScreen';

// ── Módulo 2: Medidas corporales ──────────────────────────────────────────────
import MedidasScreen         from '../../modules/mod2_medidas/screens/MedidasScreen';
import MedidasRegScreen      from '../../modules/mod2_medidas/screens/MedidasRegScreen';
import MedidasHistScreen     from '../../modules/mod2_medidas/screens/MedidasHistScreen';

// ── Módulo 3: Entrenamientos / Rutinas ────────────────────────────────────────
import RutinasScreen         from '../../modules/mod3_rutinas/screens/RutinasScreen';
import CrearRutinaScreen     from '../../modules/mod3_rutinas/screens/CrearRutinaScreen';
import RutinaDetalleScreen   from '../../modules/mod3_rutinas/screens/RutinaDetalleScreen';
import EditarRutinaScreen    from '../../modules/mod3_rutinas/screens/EditarRutinaScreen';
import DiaRutinaScreen       from '../../modules/mod3_rutinas/screens/DiaRutinaScreen';
import EjerciciosScreen      from '../../modules/mod3_rutinas/screens/EjerciciosScreen';
import EjercicioDetScreen    from '../../modules/mod3_rutinas/screens/EjercicioDetScreen';

// ── Módulo 4: Sesión activa ───────────────────────────────────────────────────
import PreSesionScreen       from '../../modules/mod4_sesion/screens/PreSesionScreen';
import SesionActivaScreen    from '../../modules/mod4_sesion/screens/SesionActivaScreen';

// ── Módulo 5: Asistente IA ────────────────────────────────────────────────────
import ChatScreen            from '../../modules/mod5_ia/screens/ChatScreen';

// ── Módulo 6: Escáner Gym ─────────────────────────────────────────────────────
import ScannerGymScreen      from '../../modules/mod6_scanner_gym/screens/ScannerGymScreen';
import ScannerResultGymScreen from '../../modules/mod6_scanner_gym/screens/ScannerResultGymScreen';
import CatalogoGymScreen     from '../../modules/mod6_scanner_gym/screens/CatalogoGymScreen';

// ── Módulo 7: Escáner Alimentos ───────────────────────────────────────────────
import ScannerFoodScreen     from '../../modules/mod7_scanner_food/screens/ScannerFoodScreen';
import ScannerResultFoodScreen from '../../modules/mod7_scanner_food/screens/ScannerResultFoodScreen';
import HistorialFoodScreen   from '../../modules/mod7_scanner_food/screens/HistorialFoodScreen';

// ── Módulo 8: Progreso ────────────────────────────────────────────────────────
import ProgresoScreen        from '../../modules/mod8_progreso/screens/ProgresoScreen';
import HistorialSesionesScreen from '../../modules/mod8_progreso/screens/HistorialSesionesScreen';

// ── Módulo 9: Social ──────────────────────────────────────────────────────────
import SocialScreen          from '../../modules/mod9_social/screens/SocialScreen';
import BuscarAmigosScreen    from '../../modules/mod9_social/screens/BuscarAmigosScreen';
import AmigosScreen          from '../../modules/mod9_social/screens/AmigosScreen';
import GruposScreen          from '../../modules/mod9_social/screens/GruposScreen';
import NotificacionesScreen  from '../../modules/mod9_social/screens/NotificacionesScreen';
import RankingScreen         from '../../modules/mod9_social/screens/RankingScreen';
import PrivacidadScreen      from '../../modules/mod9_social/screens/PrivacidadScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <AppSessionProvider>
      <RutinasProvider>
        <ScannerDemoProvider>
          <SocialProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Survey" component={SurveyScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="ChangeEmail" component={ChangeEmailScreen} />

                <Stack.Screen name="Medidas" component={MedidasScreen} />
                <Stack.Screen name="MedidasReg" component={MedidasRegScreen} />
                <Stack.Screen name="MedidasHist" component={MedidasHistScreen} />

                <Stack.Screen name="Rutinas" component={RutinasScreen} />
                <Stack.Screen name="CrearRutina" component={CrearRutinaScreen} />
                <Stack.Screen name="RutinaDetalle" component={RutinaDetalleScreen} />
                <Stack.Screen name="EditarRutina" component={EditarRutinaScreen} />
                <Stack.Screen name="DiaRutina" component={DiaRutinaScreen} />
                <Stack.Screen name="Ejercicios" component={EjerciciosScreen} />
                <Stack.Screen name="EjercicioDet" component={EjercicioDetScreen} />

                <Stack.Screen name="PreSesion" component={PreSesionScreen} />
                <Stack.Screen name="SesionActiva" component={SesionActivaScreen} />

                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="ScannerGym" component={ScannerGymScreen} />
                <Stack.Screen name="ScannerResultGym" component={ScannerResultGymScreen} />
                <Stack.Screen name="CatalogoGym" component={CatalogoGymScreen} />
                <Stack.Screen name="ScannerFood" component={ScannerFoodScreen} />
                <Stack.Screen name="ScannerResultFood" component={ScannerResultFoodScreen} />
                <Stack.Screen name="HistorialFood" component={HistorialFoodScreen} />
                <Stack.Screen name="Progreso" component={ProgresoScreen} />
                <Stack.Screen name="HistorialSesiones" component={HistorialSesionesScreen} />
                <Stack.Screen name="Social" component={SocialScreen} />
                <Stack.Screen name="BuscarAmigos" component={BuscarAmigosScreen} />
                <Stack.Screen name="Amigos" component={AmigosScreen} />
                <Stack.Screen name="Grupos" component={GruposScreen} />
                <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
                <Stack.Screen name="Ranking" component={RankingScreen} />
                <Stack.Screen name="Privacidad" component={PrivacidadScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </SocialProvider>
        </ScannerDemoProvider>
      </RutinasProvider>
    </AppSessionProvider>
  );
}
