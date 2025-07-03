-- #####################################################################
-- ##                  TECNOLOGICO DE ANTIOQUIA                         ##
-- ##      PROYECTO DE ANALISIS Y DISEÑO DE SISTEMAS Y PROGRAMACION     ##
-- ##                TECNOLOGIA EN SISTEMAS DE INFORMACION              ##
-- ##                        SEMESTRE 2024-1                            ##
-- #####################################################################

-- IMPORTANTE:
-- 1. Asegúrate de haber creado una base de datos (ej. `tecnofarmadb`) y de haberla seleccionado.
-- 2. Este script está diseñado para ser seguro y se puede ejecutar varias veces. 
--    Automáticamente eliminará las tablas existentes para asegurar una instalación limpia.
-- 3. Ve a la pestaña "SQL" de tu base de datos y pega todo el contenido de este archivo.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- ELIMINACIÓN DE TABLAS (SI EXISTEN)
-- Se eliminan en orden inverso a su creación para evitar problemas de dependencias.
--
DROP TABLE IF EXISTS `movimientos_inventario`;
DROP TABLE IF EXISTS `devoluciones`;
DROP TABLE IF EXISTS `pedidos`;
DROP TABLE IF EXISTS `recetas`;
DROP TABLE IF EXISTS `kits`;
DROP TABLE IF EXISTS `productos`;
DROP TABLE IF EXISTS `empleados`;
DROP TABLE IF EXISTS `proveedores`;
DROP TABLE IF EXISTS `categorias`;

--
-- ESTRUCTURA DE TABLAS
--

-- Tabla: categorias
CREATE TABLE `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla: proveedores
CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `contacto` varchar(255) NOT NULL,
  `telefono` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla: empleados
CREATE TABLE `empleados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rol` enum('Administrador','Empleado') NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla: productos
CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `costo` decimal(10,2) DEFAULT 0.00,
  `precio` decimal(10,2) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `fechaVencimiento` date NOT NULL,
  `numeroLote` varchar(100) NOT NULL,
  `proveedorId` int(11) DEFAULT NULL,
  `proveedorNombre` varchar(255) DEFAULT NULL,
  `descuento` decimal(5,2) DEFAULT 0.00,
  `fechaInicioGarantia` date DEFAULT NULL,
  `fechaFinGarantia` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `proveedorId` (`proveedorId`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla: kits
CREATE TABLE `kits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `componentes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`componentes`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla: recetas
CREATE TABLE `recetas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pacienteNombre` varchar(255) NOT NULL,
  `doctorNombre` varchar(255) NOT NULL,
  `fechaPrescripcion` date NOT NULL,
  `medicamentos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`medicamentos`)),
  `estado` enum('Pendiente','Dispensada','Cancelada') NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla: pedidos
CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fechaPedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `fechaEntregaEstimada` date DEFAULT NULL,
  `proveedorId` int(11) NOT NULL,
  `proveedorNombre` varchar(255) NOT NULL,
  `productos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`productos`)),
  `estado` enum('Pendiente','Enviado','Completado','Cancelado') NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `proveedorId` (`proveedorId`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla: devoluciones
CREATE TABLE `devoluciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `productoId` int(11) NOT NULL,
  `productoNombre` varchar(255) NOT NULL,
  `proveedorId` int(11) NOT NULL,
  `proveedorNombre` varchar(255) NOT NULL,
  `cantidadDevuelta` int(11) NOT NULL,
  `motivo` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productoId` (`productoId`),
  KEY `proveedorId` (`proveedorId`),
  CONSTRAINT `devoluciones_ibfk_1` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `devoluciones_ibfk_2` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla: movimientos_inventario
CREATE TABLE `movimientos_inventario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productoId` int(11) NOT NULL,
  `productoNombre` varchar(255) NOT NULL,
  `numeroLote` varchar(100) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo` enum('Creación Inicial','Salida Manual','Ajuste Positivo','Ajuste Negativo','Importación CSV','Dispensado por Receta','Entrada por Pedido','Devolución a Proveedor','Venta de Kit') NOT NULL,
  `cantidadMovida` int(11) NOT NULL,
  `stockAnterior` int(11) NOT NULL,
  `stockNuevo` int(11) NOT NULL,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `productoId` (`productoId`),
  CONSTRAINT `movimientos_inventario_ibfk_1` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- DATOS INICIALES
--
INSERT INTO `empleados` (`id`, `nombre`, `email`, `rol`, `password`) VALUES
(1, 'Admin Principal', 'admin@tecnofarma.com', 'Administrador', '$2a$10$f.w9.3Xz.1J/QO9p2.j/L.x/.C3sM2Vp8b./L6.Y1d8j.z.a5W1yG'), -- pass: admin123
(2, 'Usuario de Prueba', 'usuario@ejemplo.com', 'Empleado', '$2a$10$wT3A4h5b5i9.i.3D6J8n/e.Z2t8Y7w5f.u1i4O3p9v.b9S/g4I0Ea'); -- pass: user123

INSERT INTO `categorias` (`id`, `nombre`) VALUES
(1, 'Analgésicos'),
(2, 'Antibióticos'),
(3, 'Vitaminas'),
(4, 'Cuidado Personal');

INSERT INTO `proveedores` (`id`, `nombre`, `contacto`, `telefono`) VALUES
(1, 'Distrifarma S.A.', 'Carlos Pérez', '3001234567'),
(2, 'Medisuministros SAS', 'Ana Gómez', '3109876543');


--
-- AUTO_INCREMENT PARA TABLAS
--
ALTER TABLE `empleados` AUTO_INCREMENT = 3;
ALTER TABLE `categorias` AUTO_INCREMENT = 5;
ALTER TABLE `proveedores` AUTO_INCREMENT = 3;


COMMIT;
