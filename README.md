# TecnoFarma - Gestión de Inventario para Farmacias

Este es el proyecto TecnoFarma, una aplicación web construida con Next.js y ShadCN para la gestión de inventarios.

## Primeros Pasos (Instalación y Configuración)

Para configurar y ejecutar el proyecto en tu máquina local, sigue estos pasos al pie de la letra.

### 1. Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

### 2. Configurar las Variables de Entorno (¡Paso CRUCIAL!)

El sistema necesita un archivo de configuración llamado `.env` para guardar claves secretas y la conexión a la base de datos. Este archivo **no se sube a GitHub por seguridad**. Por eso, cada vez que clones el proyecto en una máquina nueva, debes crearlo.

a. Busca el archivo llamado `.env.example`. Este es tu plantilla.

b. **Copia y renombra** ese archivo a `.env`.

c. Abre el nuevo archivo `.env` y **revisa que los datos de tu base de datos sean correctos**. Por lo general, si usas XAMPP, los valores por defecto son:

```
# Clave secreta para la sesión (puedes dejar la que está)
SESSION_SECRET=a5b3c7d9e1f2a8b5c4d6e8f1a2b3c4d5e7f8a9b0c1d2e3f4

# Datos de tu base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=  <-- ¡Importante! Déjalo vacío si no tienes contraseña en 'root'.
DB_DATABASE=tecnofarmadb
```

**Importante:** Si el usuario o contraseña de tu base de datos son diferentes, debes actualizarlos en este archivo. Sin este paso, la aplicación no podrá conectarse a la base de datos y fallará.

### 3. Crear la Base de Datos

Antes de arrancar la aplicación, necesitas crear la base de datos y sus tablas.

a. Abre **phpMyAdmin**.
b. Crea una nueva base de datos llamada `tecnofarmadb`.
c. Selecciona la base de datos que acabas de crear.
d. Ve a la pestaña **"SQL"**.
e. Copia **todo** el contenido del archivo `docs/database-schema.sql` que está en el proyecto.
f. Pega el contenido en el campo de texto de la pestaña SQL y haz clic en **"Go"** o **"Continuar"**.

Esto creará todas las tablas necesarias. Si las tablas ya existen, el script las borrará y las creará de nuevo para asegurar una instalación limpia.

### 4. Ejecutar el Servidor de Desarrollo

Una vez configurado todo, ejecuta el servidor:

```bash
npm run dev
```

Abre [http://localhost:9002](http://localhost:9002) en tu navegador para ver la aplicación.

### 5. Ejecutar las Pruebas

El proyecto está configurado con Jest y React Testing Library para garantizar la calidad del código. Para ejecutar las pruebas, usa el siguiente comando:

```bash
npm test
```

Esto iniciará Jest en modo "watch", que ejecuta automáticamente las pruebas cada vez que guardas un cambio en un archivo.

---

## Flujo de Trabajo con Git

### Configuración de Git por Primera Vez (en un PC nuevo)

Si estás en una máquina nueva, es crucial que le digas a Git quién eres. De lo contrario, no podrás "firmar" y subir tus cambios. Abre una terminal y ejecuta estos dos comandos, reemplazando los datos de ejemplo con los tuyos:

```bash
git config --global user.name "Tu Nombre Completo"
git config --global user.email "tu-email-de-github@ejemplo.com"
```

Esto solo necesitas hacerlo una vez por cada máquina que uses.

### ¿Error `[rejected] main -> main (fetch first)` al hacer `git push`?

Este es un error muy común y significa que el repositorio remoto (en GitHub) tiene cambios que tú no tienes en tu máquina local. Git te protege para que no sobrescribas accidentalmente el trabajo de otros.

**Solución (siempre antes de un `push`):**

1.  **Descarga los cambios remotos:**
    ```bash
    git pull
    ```
    Este comando traerá los cambios de GitHub y los fusionará con tu trabajo local.

2.  **Sube tus cambios ahora sí combinados:**
    ```bash
    git push
    ```

**Flujo recomendado:**
Antes de empezar a trabajar o antes de subir tus cambios, siempre es una buena práctica ejecutar `git pull` para asegurarte de que tienes la última versión del proyecto.
