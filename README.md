# TecnoFarma - Gestión de Inventario para Farmacias

Este es el proyecto TecnoFarma, una aplicación web construida con Next.js y ShadCN para la gestión de inventarios.

## Primeros Pasos (Instalación y Configuración)

Para configurar y ejecutar el proyecto en tu máquina local, sigue estos pasos al pie de la letra.

### 1. Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

### 2. Configurar las Variables de Entorno (¡Paso Crucial!)

El sistema necesita un archivo de configuración llamado `.env` para guardar claves secretas. Este archivo **no se sube a GitHub por seguridad**. Por eso, cada vez que clones el proyecto en una máquina nueva, debes crearlo.

a. Busca el archivo llamado `.env.example`. Este es tu plantilla.

b. **Copia y renombra** ese archivo a `.env`.

c. Abre el nuevo archivo `.env` y asegúrate de que contenga una clave secreta. Puedes usar la que viene en el ejemplo para desarrollo local:

```
SESSION_SECRET=a5b3c7d9e1f2a8b5c4d6e8f1a2b3c4d5e7f8a9b0c1d2e3f4
```

**Importante:** Sin este paso, el inicio de sesión y el registro fallarán.

### 3. Ejecutar el Servidor de Desarrollo

Una vez configurado todo, ejecuta el servidor:

```bash
npm run dev
```

Abre [http://localhost:9002](http://localhost:9002) en tu navegador para ver la aplicación.
