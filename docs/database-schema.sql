-- #####################################################################
-- ##                    ESQUEMA DE BASE DE DATOS                     ##
-- ##                         TecnoFarma                              ##
-- #####################################################################
--
-- Este archivo contiene el esquema SQL para la base de datos MySQL
-- del sistema de gestión de inventarios TecnoFarma.
--
-- IMPORTANTE: Ejecuta este script en la base de datos que creaste
-- (ej. 'tecnofarmadb') desde phpMyAdmin o tu cliente SQL preferido.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
--
-- Tabla `categorias`
-- Almacena las categorías de los productos.
--
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
--
-- Tabla `proveedores`
-- Almacena la información de los proveedores.
--
CREATE TABLE IF NOT EXISTS `proveedores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `contacto` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
--
-- Tabla `productos`
-- Tabla principal del inventario.
--
CREATE TABLE IF NOT EXISTS `productos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `categoria` VARCHAR(255) NOT NULL,
  `costo` DECIMAL(10,2) DEFAULT 0.00,
  `precio` DECIMAL(10,2) NOT NULL,
  `cantidad` INT NOT NULL,
  `fechaVencimiento` DATE NOT NULL,
  `numeroLote` VARCHAR(100) NOT NULL,
  `proveedorId` INT DEFAULT NULL,
  `proveedorNombre` VARCHAR(255) DEFAULT NULL,
  `descuento` DECIMAL(5,2) DEFAULT 0.00,
  `fechaInicioGarantia` DATE DEFAULT NULL,
  `fechaFinGarantia` DATE DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `proveedorId_idx` (`proveedorId`),
  CONSTRAINT `fk_producto_proveedor` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
--
-- Tabla `empleados`
-- Almacena los usuarios del sistema.
--
CREATE TABLE IF NOT EXISTS `empleados` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `rol` ENUM('Administrador','Empleado') NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Datos iniciales para `empleados`
--
INSERT INTO `empleados` (`id`, `nombre`, `email`, `rol`, `password`) VALUES
(1, 'Admin Principal', 'admin@tecnofarma.com', 'Administrador', '$2a$10$f.w9.3Xz.1J/QO9p2.j/L.x/.C3sM2Vp8b./L6.Y1d8j.z.a5W1yG'), -- pass: admin123
(2, 'Usuario de Prueba', 'usuario@ejemplo.com', 'Empleado', '$2a$10$wT3A4h5b5i9.i.3D6J8n/e.Z2t8Y7w5f.u1i4O3p9v.b9S/g4I0Ea'); -- pass: empleado123

ALTER TABLE `empleados` AUTO_INCREMENT = 3;

-- --------------------------------------------------------
--
-- Tabla `movimientos_inventario`
-- Historial de todos los cambios en el stock.
--
CREATE TABLE IF NOT EXISTS `movimientos_inventario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `productoId` INT NOT NULL,
  `productoNombre` VARCHAR(255) NOT NULL,
  `numeroLote` VARCHAR(100) NOT NULL,
  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo` VARCHAR(100) NOT NULL,
  `cantidadMovida` INT NOT NULL,
  `stockAnterior` INT NOT NULL,
  `stockNuevo` INT NOT NULL,
  `notas` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `productoId_idx` (`productoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
--
-- Tabla `recetas`
-- Almacena las recetas médicas. Los medicamentos se guardan como JSON.
--
CREATE TABLE IF NOT EXISTS `recetas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pacienteNombre` VARCHAR(255) NOT NULL,
  `doctorNombre` VARCHAR(255) NOT NULL,
  `fechaPrescripcion` DATE NOT NULL,
  `medicamentos` JSON NOT NULL,
  `estado` ENUM('Pendiente','Dispensada','Cancelada') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
--
-- Tabla `pedidos`
-- Pedidos de reposición a proveedores. Los productos se guardan como JSON.
--
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fechaPedido` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaEntregaEstimada` DATE DEFAULT NULL,
  `proveedorId` INT NOT NULL,
  `proveedorNombre` VARCHAR(255) NOT NULL,
  `productos` JSON NOT NULL,
  `estado` ENUM('Pendiente','Enviado','Completado','Cancelado') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `proveedorId_idx_pedidos` (`proveedorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
--
-- Tabla `devoluciones`
-- Devoluciones de productos a proveedores.
--
CREATE TABLE IF NOT EXISTS `devoluciones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `productoId` INT NOT NULL,
  `productoNombre` VARCHAR(255) NOT NULL,
  `proveedorId` INT NOT NULL,
  `proveedorNombre` VARCHAR(255) NOT NULL,
  `cantidadDevuelta` INT NOT NULL,
  `motivo` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productoId_idx_devoluciones` (`productoId`),
  KEY `proveedorId_idx_devoluciones` (`proveedorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
--
-- Tabla `kits`
-- Kits o paquetes de productos. Los componentes se guardan como JSON.
--
CREATE TABLE IF NOT EXISTS `kits` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `componentes` JSON NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_UNIQUE_kits` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
