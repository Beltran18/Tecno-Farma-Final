# Cómo subir tu proyecto TecnoFarma a GitHub

¡Añañai, bro! Aquí tienes los pasos y los comandos exactos para que subas todo tu proyecto al repositorio de GitHub que creaste. He actualizado las instrucciones para que sean a prueba de fallos.

---

### Paso 0: Si ya intentaste antes (Opcional pero recomendado)

Si ya ejecutaste `git init`, es mejor empezar de cero para evitar conflictos. Abre una terminal en la carpeta raíz de tu proyecto y ejecuta el comando según tu sistema operativo:

- **En Mac o Linux:**
  ```bash
  rm -rf .git
  ```
- **En Windows:**
  ```bash
  rd /s /q .git
  ```
Si te da un error, no te preocupes, solo significa que no había nada que borrar. ¡Sigue al siguiente paso!

---

### Paso 1: Configura tu identidad en Git (¡Solo se hace una vez!)

Antes de poder guardar cambios, Git necesita saber quién eres. **Esto solo lo tienes que hacer una vez en tu computador.**

```bash
git config --global user.name "Tu Nombre Completo"
git config --global user.email "tu_correo@ejemplo.com"
```
**Importante:** Reemplaza `"Tu Nombre Completo"` y `"tu_correo@ejemplo.com"` con tus datos reales (los mismos que usas en GitHub es una buena idea).

---

### Paso 2: Ahora sí, los comandos del proyecto

Ejecuta estos comandos uno por uno, en orden.

1.  **Inicializar el repositorio Git** (crea la rama principal como `main`).
    ```bash
    git init -b main
    ```

2.  **Agregar todos los archivos** (prepara todo para subirlo).
    ```bash
    git add .
    ```

3.  **Crear el primer "commit"** (guarda la primera "foto" de tu código).
    ```bash
    git commit -m "Commit inicial del proyecto TecnoFarma"
    ```

4.  **Conectar tu repositorio local con GitHub**.
    ```bash
    git remote add origin https://github.com/juandi286/tecnofarmaprobar.git
    ```

5.  **¡Subir tu código!** (envía todo a GitHub).
    ```bash
    git push -u origin main
    ```

---

¡Y listo, bro! Después de ejecutar esos comandos, tu proyecto TecnoFarma estará seguro y visible en tu repositorio de GitHub. ¡Esta vez sí o sí!