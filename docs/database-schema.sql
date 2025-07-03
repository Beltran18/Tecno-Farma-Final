-- #####################################################################
-- ##                    ESQUEMA DE BASE DE DATOS                     ##
-- ##                         TecnoFarma                              ##
-- #####################################################################
--
-- Este archivo contiene el esquema SQL para la base de datos MySQL
-- del sistema de gestión de inventarios TecnoFarma.
--
-- Todas las tablas y campos están en español.

SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Tabla `categorias`
-- Almacena las categorías de los productos (Ej: Analgésicos, Antibióticos).
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `fechaCreacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `proveedores`
-- Almacena la información de los proveedores de productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proveedores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `contacto` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(50) NOT NULL,
  `fechaCreacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `productos`
-- Tabla principal que almacena el inventario de productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `productos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `categoria` VARCHAR(100) NOT NULL,
  `costo` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `precio` DECIMAL(10,2) NOT NULL,
  `descuento` DECIMAL(5,2) NULL DEFAULT 0.00,
  `cantidad` INT NOT NULL DEFAULT 0,
  `fechaVencimiento` DATE NOT NULL,
  `numeroLote` VARCHAR(100) NOT NULL,
  `proveedorId` INT NULL,
  `proveedorNombre` VARCHAR(255) NULL,
  `fechaInicioGarantia` DATE NULL,
  `fechaFinGarantia` DATE NULL,
  `fechaCreacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_productos_proveedores_idx` (`proveedorId` ASC),
  CONSTRAINT `fk_productos_proveedores`
    FOREIGN KEY (`proveedorId`)
    REFERENCES `proveedores` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `movimientos_inventario`
-- Registra cada entrada y salida de stock para trazabilidad.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movimientos_inventario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `productoId` INT NOT NULL,
  `productoNombre` VARCHAR(255) NOT NULL,
  `numeroLote` VARCHAR(100) NOT NULL,
  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo` ENUM('Creación Inicial', 'Salida Manual', 'Ajuste Positivo', 'Ajuste Negativo', 'Importación CSV', 'Dispensado por Receta', 'Entrada por Pedido', 'Devolución a Proveedor', 'Venta de Kit') NOT NULL,
  `cantidadMovida` INT NOT NULL,
  `stockAnterior` INT NOT NULL,
  `stockNuevo` INT NOT NULL,
  `notas` TEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_movimientos_producto_idx` (`productoId` ASC),
  CONSTRAINT `fk_movimientos_producto`
    FOREIGN KEY (`productoId`)
    REFERENCES `productos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `empleados`
-- Almacena los usuarios del sistema.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `empleados` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `rol` ENUM('Administrador', 'Empleado') NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `fechaCreacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `recetas`
-- Almacena las recetas médicas.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recetas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pacienteNombre` VARCHAR(255) NOT NULL,
  `doctorNombre` VARCHAR(255) NOT NULL,
  `fechaPrescripcion` DATE NOT NULL,
  `medicamentos` JSON NOT NULL,
  `estado` ENUM('Pendiente', 'Dispensada', 'Cancelada') NOT NULL DEFAULT 'Pendiente',
  `fechaCreacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `pedidos`
-- Almacena los pedidos de reposición a proveedores.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fechaPedido` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaEntregaEstimada` DATE NULL,
  `proveedorId` INT NOT NULL,
  `proveedorNombre` VARCHAR(255) NOT NULL,
  `productos` JSON NOT NULL,
  `estado` ENUM('Pendiente', 'Enviado', 'Completado', 'Cancelado') NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_pedidos_proveedor_idx` (`proveedorId` ASC),
  CONSTRAINT `fk_pedidos_proveedor`
    FOREIGN KEY (`proveedorId`)
    REFERENCES `proveedores` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `devoluciones`
-- Almacena las devoluciones de productos a proveedores.
-- -----------------------------------------------------
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
  INDEX `fk_devoluciones_producto_idx` (`productoId` ASC),
  CONSTRAINT `fk_devoluciones_producto`
    FOREIGN KEY (`productoId`)
    REFERENCES `productos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `kits`
-- Almacena los kits o paquetes de productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kits` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `componentes` JSON NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- #####################################################################
-- ##                       DATOS INICIALES                           ##
-- #####################################################################

--
-- Datos iniciales para `empleados`
-- Se crean dos usuarios por defecto: un administrador y un empleado de prueba.
-- Contraseña para admin@tecnofarma.com: admin123
-- Contraseña para usuario@ejemplo.com: user123
--
INSERT INTO `empleados` (`id`, `nombre`, `email`, `rol`, `password`) VALUES
(1, 'Admin Principal', 'admin@tecnofarma.com', 'Administrador', '$2a$10$f.w9.3Xz.1J/QO9p2.j/L.x/.C3sM2Vp8b./L6.Y1d8j.z.a5W1yG'),
(2, 'Usuario de Prueba', 'usuario@ejemplo.com', 'Empleado', '$2a$10$wT3A4h5b5i9.i.3D6J8n/e.Z2t8Y7w5f.u1i4O3p9v.b9S/g4I0Ea');

--
-- Datos iniciales para `categorias`
--
INSERT INTO `categorias` (`nombre`) VALUES
('Analgésicos'),
('Antibióticos'),
('Vitaminas'),
('Cuidado Personal'),
('Primeros Auxilios');

--
-- Datos iniciales para `proveedores`
--
INSERT INTO `proveedores` (`nombre`, `contacto`, `telefono`) VALUES
('Farma S.A.', 'Carlos Pérez', '3001234567'),
('DistriSalud', 'Ana Gómez', '3109876543'),
('Medilab Colombia', 'Sofia Castro', '3205551212');
