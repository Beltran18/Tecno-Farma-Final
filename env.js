// Carga las variables de entorno desde el archivo .env
// Este es el método recomendado para asegurar que estén disponibles en next.config.js y en todo el proyecto.
const {-readonly loadEnvConfig} = require('@next/env');
const projectDir = process.cwd();
loadEnvConfig(projectDir);

module.exports = {};
