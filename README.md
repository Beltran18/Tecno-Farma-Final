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

c. Abre el nuevo archivo `.env` y **revisa que la cadena de conexión sea correcta**. La aplicación ahora utiliza PostgreSQL (por ejemplo el servicio Neon) mediante la variable `DATABASE_URL`.

```
# Clave secreta para la sesión (puedes dejar la que está)
SESSION_SECRET=a5b3c7d9e1f2a8b5c4d6e8f1a2b3c4d5e7f8a9b0c1d2e3f4

# Cadena de conexión para PostgreSQL / Neon
# formato: postgres://user:password@host:port/databasename
DATABASE_URL=postgres://usuario:contraseña@tuhost:5432/tecnofarmadb
```

**Importante:** Si el usuario o contraseña de tu base de datos son diferentes, debes actualizarlos en este archivo. Sin este paso, la aplicación no podrá conectarse a la base de datos y fallará.

### 3. Crear la Base de Datos

Antes de arrancar la aplicación, necesitas tener una base de datos PostgreSQL disponible (puede ser local, en Neon, o cualquier proveedor compatible). Una vez creada, ejecuta el script de esquema para generar las tablas.

*Si usas Neon*, copia la conexión generada por Neon en `DATABASE_URL` y luego abre la consola SQL del panel de Neon.

Si estás trabajando en tu máquina local con `psql`:

```bash
psql "$DATABASE_URL" -f docs/database-schema.sql
```

O, alternativamente, abre cualquier cliente SQL (pgAdmin, DBeaver, TablePlus, etc.), conéctate usando la cadena `DATABASE_URL` y ejecuta el contenido de `docs/database-schema.sql`.

El script está diseñado para limpiar y recrear las tablas cada vez, así que puede ejecutarse varias veces sin problemas.

### Ruta de prueba de conexión

Para verificar rápidamente que la aplicación se conecta correctamente a tu base de datos PostgreSQL, hay una ruta de ejemplo disponible:

```
GET /api/test-db
```

Devuelve `NOW()` del servidor de BD en JSON. Usa `curl` o abre en el navegador durante el desarrollo.

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

### Flujo recomendado para subir cambios

Antes de empezar a trabajar o antes de subir tus cambios, siempre es una buena práctica ejecutar `git pull` para asegurarte de que tienes la última versión del proyecto.

1.  **Asegúrate de estar en la carpeta del proyecto**: Antes de ejecutar cualquier comando de Git, tu terminal debe estar "dentro" de la carpeta del proyecto. Si no lo está, usa el comando `cd` para navegar hasta ella (ej: `cd ruta/a/tu/proyecto`).
2.  **Descarga los cambios remotos:**
    ```bash
    git pull
    ```
3.  **Sube tus cambios:**
    ```bash
    git push
    ```

---
## Solución de Problemas Comunes de Git

### Error: `fatal: not a git repository`

Este error significa que la carpeta en la que estás no está siendo reconocida por Git. Esto suele ocurrir si descargaste el proyecto como un ZIP en lugar de clonarlo. Para solucionarlo:

1.  **Asegúrate de estar en la carpeta correcta** del proyecto en tu terminal.
2.  **Inicializa un repositorio de Git:**
    ```bash
    git init
    ```
3.  **Conecta tu carpeta local con el repositorio remoto:**
    ```bash
    git remote add origin https://github.com/juandi286/tecnofarmaprobar.git
    ```
4.  **Descarga y fusiona el historial de cambios:**
    ```bash
    git pull origin main
    ```
5.  Ahora ya puedes usar `git pull` y `git push` normalmente.

### Error: `[rejected] main -> main (fetch first)` al hacer `git push`

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

### Error: `fatal: Need to specify how to reconcile divergent branches` al hacer `git pull`

Este error ocurre cuando tanto tú (en tu PC) como otro colaborador (o tú mismo desde otro PC) han hecho cambios sobre la misma base de código, creando dos "versiones" de la historia. Git no sabe cómo unirlas.

**Solución (solo necesitas hacer esto una vez por proyecto):**
1. **Configura la estrategia de unión (merge):** Dile a Git que quieres que combine las historias creando un "commit de unión". Es la estrategia más segura y recomendada.
    ```bash
    git config pull.rebase false
    ```
2. **Intenta el `pull` de nuevo:**
    ```bash
    git pull
    ```
    Es posible que se abra un editor de texto para que confirmes un mensaje para la unión. Simplemente guarda y cierra el editor.
3. **Ahora sí, haz el `push`:**
    ```bash
    git push
    ```
