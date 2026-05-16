# DPUAS Fitness App

Aplicación móvil de fitness desarrollada con **Expo + React Native**.

## Estado del proyecto

| Módulo | Estado | Pantallas |
|--------|--------|-----------|
| **M1 — Gestión de Usuarios** | ✅ Funcional offline (SQLite) | Splash, Login, Register, Survey, Home, Profile, EditProfile, ForgotPassword, ChangeEmail |
| M2 — Medidas corporales | 🔲 Placeholder visual | Medidas, MedidasReg, MedidasHist |
| M3 — Entrenamiento | 🔲 Placeholder visual | Rutinas, CrearRutina, RutinaDetalle, EditarRutina, Ejercicios, EjercicioDet |
| M4 — Sesión activa | 🔲 Placeholder visual | PreSesion, SesionActiva |
| M5 — Asistente IA | 🔲 Placeholder visual | Chat |
| M6 — Escáner Gym | 🔲 Placeholder visual | ScannerGym, ScannerResultGym |
| M7 — Escáner Alimentos | 🔲 Placeholder visual | ScannerFood, ScannerResultFood, HistorialFood |
| M8 — Progreso | 🔲 Placeholder visual | Progreso, HistorialSesiones |
| M9 — Social | 🔲 Placeholder visual | Social, Amigos, Grupos, Notificaciones, Ranking, Privacidad |

## Instalación

```bash
npm install
npx expo start
```

## Estructura

```
src/
├── modules/
│   ├── auth/           ← Módulo 1 funcional (SQLite offline)
│   │   ├── db/
│   │   └── screens/
│   └── placeholders/   ← Pantallas visuales módulos 2–9
└── shared/
    └── navigation/
        └── AppNavigator.js
```

## Tecnologías

- Expo SDK 54
- React Native 0.81
- expo-sqlite (base de datos local)
- expo-secure-store (tokens de sesión)
- expo-crypto (hash de contraseñas SHA-256)
- @react-navigation/native-stack
