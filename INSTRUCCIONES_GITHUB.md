# Cómo subir tu proyecto TecnoFarma a GitHub

¡Añañai, bro! Aquí tienes los pasos y los comandos exactos para que subas todo tu proyecto al repositorio de GitHub que creaste.

Solo tienes que abrir una terminal en la carpeta raíz de tu proyecto y ejecutar estos comandos en orden.

---

### Paso 1: Inicializar el repositorio Git

Este comando crea un repositorio local en tu carpeta y nombra la rama principal como `main`.

```bash
git init -b main
```

### Paso 2: Agregar todos los archivos

Este comando prepara todos los archivos de tu proyecto para subirlos. He creado un archivo `.gitignore` para que se ignoren automáticamente las carpetas y archivos innecesarios como `node_modules`.

```bash
git add .
```

### Paso 3: Crear el primer "commit"

Un "commit" es como una foto o una versión guardada de tu código. Este comando guarda la primera versión.

```bash
git commit -m "Commit inicial del proyecto TecnoFarma"
```

### Paso 4: Conectar tu repositorio local con GitHub

Este comando le dice a tu repositorio local dónde está el repositorio remoto en GitHub. Asegúrate de que la URL sea la correcta.

```bash
git remote add origin https://github.com/juandi286/tecnofarmaprobar.git
```

### Paso 5: Subir tu código

¡El paso final! Este comando envía todo tu código a GitHub.

```bash
git push -u origin main
```

---

¡Y listo, bro! Después de ejecutar esos comandos, tu proyecto TecnoFarma estará seguro y visible en tu repositorio de GitHub. ¡Un paso más hacia la cima!
