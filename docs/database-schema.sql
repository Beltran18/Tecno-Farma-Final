-- #####################################################################
-- ##                  TECNOLOGICO DE ANTIOQUIA                         ##
-- ##      PROYECTO DE ANALISIS Y DISEÑO DE SISTEMAS Y PROGRAMACION     ##
-- ##                TECNOLOGIA EN SISTEMAS DE INFORMACION              ##
-- ##                        SEMESTRE 2024-1                            ##
-- #####################################################################

-- Base de datos: `tecnofarmadb`
-- Este script se encarga de eliminar la base de datos si ya existe,
-- crearla de nuevo, y configurar todas las tablas necesarias.
-- Se puede ejecutar de forma segura varias veces.

DROP DATABASE IF EXISTS `tecnofarmadb`;
CREATE DATABASE `tecnofarmadb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tecnofarmadb`;

--
-- Estructura de tabla para la tabla `categorias`
--
CREATE TABLE `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_unico` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Estructura de tabla para la tabla `proveedores`
--
CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `contacto` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_unico` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Estructura de tabla para la tabla `productos`
--
CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `costo` decimal(10,2) NOT NULL DEFAULT 0.00,
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
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Estructura de tabla para la tabla `movimientos_inventario`
--
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
  KEY `productoId` (`productoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Estructura de tabla para la tabla `empleados`
--
CREATE TABLE `empleados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rol` enum('Administrador','Empleado') NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_unico` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Estructura de tabla para la tabla `recetas`
--
CREATE TABLE `recetas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pacienteNombre` varchar(255) NOT NULL,
  `doctorNombre` varchar(255) NOT NULL,
  `fechaPrescripcion` date NOT NULL,
  `medicamentos` json NOT NULL,
  `estado` enum('Pendiente','Dispensada','Cancelada') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Estructura de tabla para la tabla `pedidos`
--
CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fechaPedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `fechaEntregaEstimada` date DEFAULT NULL,
  `proveedorId` int(11) NOT NULL,
  `proveedorNombre` varchar(255) NOT NULL,
  `productos` json NOT NULL,
  `estado` enum('Pendiente','Enviado','Completado','Cancelado') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `proveedorId` (`proveedorId`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Estructura de tabla para la tabla `devoluciones`
--
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
  CONSTRAINT `devoluciones_ibfk_1` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `devoluciones_ibfk_2` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Estructura de tabla para la tabla `kits`
--
CREATE TABLE `kits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `componentes` json NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_unico` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- DATOS INICIALES
--
-- Se crean dos usuarios por defecto: un administrador y un empleado de prueba.
-- Contraseña para admin@tecnofarma.com: admin123
-- Contraseña para usuario@ejemplo.com: user123
--
INSERT INTO `empleados` (`id`, `nombre`, `email`, `rol`, `password`) VALUES
(1, 'Admin Principal', 'admin@tecnofarma.com', 'Administrador', '$2a$10$f.w9.3Xz.1J/QO9p2.j/L.x/.C3sM2Vp8b./L6.Y1d8j.z.a5W1yG'),
(2, 'Usuario de Prueba', 'usuario@ejemplo.com', 'Empleado', '$2a$10$wT3A4h5b5i9.i.3D6J8n/e.Z2t8Y7w5f.u1i4O3p9v.b9S/g4I0Ea');

--
-- AUTO_INCREMENT de las tablas
--
ALTER TABLE `empleados` AUTO_INCREMENT = 3;
