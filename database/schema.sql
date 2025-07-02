-- Base de datos: tecnofarma_db (Ejemplo, puedes cambiar el nombre)
-- CREATE DATABASE IF NOT EXISTS tecnofarma_db;
-- USE tecnofarma_db;

-- Tabla para las categorías de productos
CREATE TABLE categorias (
    id VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    -- Timestamps para auditoría
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para los proveedores
CREATE TABLE proveedores (
    id VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    contacto VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL,
    -- Timestamps para auditoría
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla principal para los productos del inventario
CREATE TABLE productos (
    id VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    numero_lote VARCHAR(255) NOT NULL,
    
    -- Claves foráneas para las relaciones
    categoria_id VARCHAR(255) NOT NULL,
    proveedor_id VARCHAR(255),
    
    -- Timestamps para auditoría
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Definición de las relaciones
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
);

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_proveedor ON productos(proveedor_id);
