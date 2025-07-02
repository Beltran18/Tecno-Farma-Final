import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// La configuración de Firebase de tu aplicación web
// Para obtener esta información, ve a la consola de Firebase,
// a la configuración de tu proyecto y busca la sección "Tus apps".
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

// Solo inicializamos Firebase si la API key está presente.
// Esto evita que la aplicación se bloquee si las variables de entorno no están configuradas.
if (firebaseConfig.apiKey) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error) {
    console.error("Error al inicializar Firebase. Revisa tus credenciales.", error);
  }
} else {
    // En el servidor, durante la compilación o SSR, esto advertirá en la consola.
    // Los componentes del cliente también deben manejar el caso de `auth` indefinido.
    console.warn("ADVERTENCIA: Las credenciales de Firebase no están configuradas en el archivo .env. La autenticación estará deshabilitada.");
}

export { app, auth };
