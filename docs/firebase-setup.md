# Guía de Configuración de Firebase para TecnoFarma

Esta guía te ayudará a configurar un proyecto de Firebase y obtener las credenciales necesarias para habilitar la autenticación de usuarios en la aplicación.

## Paso 1: Crear un Proyecto en Firebase

1.  **Ve a la Consola de Firebase**: Abre [console.firebase.google.com](https://console.firebase.google.com) en tu navegador e inicia sesión con tu cuenta de Google.
2.  **Crea un nuevo proyecto**: Haz clic en "Crear un proyecto".
3.  **Dale un nombre**: Escribe un nombre para tu proyecto (por ejemplo, "TecnoFarma") y haz clic en "Continuar".
4.  **Google Analytics**: Puedes dejar habilitado Google Analytics o deshabilitarlo para este proyecto. Haz clic en "Continuar".
5.  **Finaliza**: Acepta los términos y haz clic en "Crear proyecto". Espera a que Firebase termine de configurarlo.

## Paso 2: Agregar tu Aplicación Web al Proyecto

1.  **Desde el panel de tu proyecto**, busca los íconos para agregar una aplicación. Haz clic en el ícono de la web (`</>`).
2.  **Registra la app**:
    *   Dale un "Apodo de la app" (ej. "TecnoFarma Web").
    *   No marques la opción de Firebase Hosting.
    *   Haz clic en "Registrar app".
3.  **Obtén tus credenciales**: Firebase te mostrará un objeto `firebaseConfig` con todas tus credenciales. **¡Esto es lo que necesitamos!** Manten esta página abierta.

    ```javascript
    // Ejemplo de cómo se verán tus credenciales:
    const firebaseConfig = {
      apiKey: "AIzaSy...",
      authDomain: "tu-proyecto.firebaseapp.com",
      projectId: "tu-proyecto",
      storageBucket: "tu-proyecto.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcdef..."
    };
    ```

## Paso 3: Habilitar el Método de Autenticación

Para que los usuarios puedan registrarse con correo y contraseña, debes habilitar este método:

1.  En el menú de la izquierda de la consola de Firebase, ve a la sección **Authentication**.
2.  Haz clic en el botón **"Comenzar"**.
3.  Ve a la pestaña **"Sign-in method"** (Método de inicio de sesión).
4.  En la lista de proveedores, busca **"Correo electrónico/Contraseña"** y haz clic para editarlo.
5.  **Habilítalo** y haz clic en "Guardar".

## Paso 4: Añadir las Credenciales a tu Proyecto

Ahora, vamos a conectar tu aplicación TecnoFarma con tu proyecto de Firebase.

1.  En la raíz de tu proyecto TecnoFarma, busca el archivo `.env.example`.
2.  **Crea una copia** de este archivo y renómbrala a **`.env`**.
3.  Abre el archivo `.env` que acabas de crear.
4.  **Copia y pega** cada uno de los valores del objeto `firebaseConfig` (del Paso 2) en las variables correspondientes de tu archivo `.env`.

    Tu archivo `.env` debería verse así, pero con **tus propios valores**:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu-proyecto"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
    NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef..."
    ```

5.  **Reinicia tu servidor de desarrollo**: Si lo tenías corriendo, detenlo (con `Ctrl + C`) y vuelve a iniciarlo con `npm run dev` para que cargue las nuevas variables de entorno.

¡Y listo! Con esto, tu aplicación TecnoFarma ya está conectada a tu proyecto de Firebase, y las funciones de registro, inicio de sesión y recuperación de contraseña funcionarán perfectamente.
