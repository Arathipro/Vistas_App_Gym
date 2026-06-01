# backend-correo-demo

Backend local temporal para enviar codigos reales por correo durante la demostracion del Modulo 1.

No reemplaza SQLite ni forma parte de la arquitectura final. Solo sirve para que Expo Go pueda pedir a la PC que envie un correo real.

## 1. Instalar dependencias

cd backend-correo-demo
npm install

## 2. Crear archivo .env

Copia .env.example como .env y llena tus datos:

PORT=3000
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_contrasena_de_aplicacion

Para Gmail se recomienda usar una contrasena de aplicacion, no tu contrasena normal.

## 3. Ejecutar backend

npm start

Debe aparecer: backend-correo-demo activo en puerto 3000

## 4. Configurar la app Expo

Edita src/config/emailDemo.js y cambia EMAIL_DEMO_API_URL por la direccion local de tu PC.

Ejemplo:

export const EMAIL_DEMO_API_URL = 'http://192.168.X.X:3000';

La IP se obtiene en Windows con ipconfig. Busca Direccion IPv4 en la red WiFi o hotspot que estes usando.

## Importante

La PC y el celular/emulador deben estar en la misma red. Para enviar correo real, esa red debe tener internet.

Si cambias de red o usas otro hotspot, la IPv4 puede cambiar y debes actualizar src/config/emailDemo.js.

## Para quitarlo despues de la presentacion

- Cambiar EMAIL_DEMO_ENABLED a false en src/config/emailDemo.js, o
- Eliminar backend-correo-demo, src/config/emailDemo.js y src/modules/auth/services/emailCodeDemoService.js.
- En ForgotPasswordScreen.js y ChangeEmailScreen.js, quitar las llamadas a enviarCodigoEmailDemo y volver al flujo definitivo que se implemente con backend real.
