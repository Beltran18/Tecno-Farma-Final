-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-07-2024 a las 18:30
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tecnofarmadb`
--
CREATE DATABASE IF NOT EXISTS `tecnofarmadb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tecnofarmadb`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devoluciones`
--

CREATE TABLE `devoluciones` (
  `id` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `productoId` int(11) NOT NULL,
  `productoNombre` varchar(255) NOT NULL,
  `proveedorId` int(11) NOT NULL,
  `proveedorNombre` varchar(255) NOT NULL,
  `cantidadDevuelta` int(11) NOT NULL,
  `motivo` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rol` enum('Administrador','Empleado') NOT NULL,
  `password` varchar(255) NOT NULL,
  `fechaCreacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--
-- Contraseña para admin@tecnofarma.com: admin123
-- Contraseña para usuario@ejemplo.com: user123
--
INSERT INTO `empleados` (`id`, `nombre`, `email`, `rol`, `password`) VALUES
(1, 'Admin Principal', 'admin@tecnofarma.com', 'Administrador', '$2a$10$f.w9.3Xz.1J/QO9p2.j/L.x/.C3sM2Vp8b./L6.Y1d8j.z.a5W1yG'),
(2, 'Usuario de Prueba', 'usuario@ejemplo.com', 'Empleado', '$2a$10$wT3A4h5b5i9.i.3D6J8n/e.Z2t8Y7w5f.u1i4O3p9v.b9S/g4I0Ea');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `kits`
--

CREATE TABLE `kits` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `componentes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`componentes`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_inventario`
--

CREATE TABLE `movimientos_inventario` (
  `id` int(11) NOT NULL,
  `productoId` int(11) NOT NULL,
  `productoNombre` varchar(255) NOT NULL,
  `numeroLote` varchar(255) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo` varchar(50) NOT NULL,
  `cantidadMovida` int(11) NOT NULL,
  `stockAnterior` int(11) NOT NULL,
  `stockNuevo` int(11) NOT NULL,
  `notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `contacto` varchar(255) NOT NULL,
  `telefono` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `fechaPedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `fechaEntregaEstimada` date DEFAULT NULL,
  `proveedorId` int(11) NOT NULL,
  `proveedorNombre` varchar(255) NOT NULL,
  `productos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`productos`)),
  `estado` enum('Pendiente','Enviado','Completado','Cancelado') NOT NULL DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
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
  `fechaFinGarantia` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recetas`
--

CREATE TABLE `recetas` (
  `id` int(11) NOT NULL,
  `pacienteNombre` varchar(255) NOT NULL,
  `doctorNombre` varchar(255) NOT NULL,
  `fechaPrescripcion` date NOT NULL,
  `medicamentos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`medicamentos`)),
  `estado` enum('Pendiente','Dispensada','Cancelada') NOT NULL DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productoId` (`productoId`),
  ADD KEY `proveedorId` (`proveedorId`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `kits`
--
ALTER TABLE `kits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productoId` (`productoId`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proveedorId` (`proveedorId`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proveedorId` (`proveedorId`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `kits`
--
ALTER TABLE `kits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `recetas`
--
ALTER TABLE `recetas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD CONSTRAINT `devoluciones_ibfk_1` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `devoluciones_ibfk_2` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD CONSTRAINT `movimientos_inventario_ibfk_1` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
