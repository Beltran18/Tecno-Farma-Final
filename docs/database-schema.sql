-- #####################################################################
-- ##                    ESQUEMA DE BASE DE DATOS                     ##
-- ##                         TecnoFarma                              ##
-- #####################################################################

-- Este archivo contiene el esquema SQL para la base de datos MySQL
-- del sistema de gestión de inventarios TecnoFarma.

-- Todas las tablas y campos están en español.

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema tecnofarma_db
-- -----------------------------------------------------
-- DROP SCHEMA IF EXISTS `tecnofarma_db`;
-- CREATE SCHEMA IF NOT EXISTS `tecnofarma_db` DEFAULT CHARACTER SET utf8mb4 ;
-- USE `tecnofarma_db` ;

-- -----------------------------------------------------
-- Tabla `roles`
-- Almacena los roles de los empleados (Ej: Administrador, Empleado).
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` INT NOT NULL AUTO_INCREMENT,
  `nombre_rol` VARCHAR(100) NOT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_rol`),
  UNIQUE INDEX `nombre_rol_UNIQUE` (`nombre_rol` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `empleados`
-- Almacena la información de los usuarios del sistema.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `empleados` (
  `id_empleado` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `id_rol` INT NOT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_empleado`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  INDEX `fk_empleados_roles_idx` (`id_rol` ASC),
  CONSTRAINT `fk_empleados_roles`
    FOREIGN KEY (`id_rol`)
    REFERENCES `roles` (`id_rol`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `categorias`
-- Almacena las categorías de los productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `proveedores`
-- Almacena la información de los proveedores.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proveedores` (
  `id_proveedor` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `contacto` VARCHAR(255) NULL,
  `telefono` VARCHAR(45) NULL,
  PRIMARY KEY (`id_proveedor`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `productos`
-- Tabla principal que almacena todos los productos del inventario.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `id_categoria` VARCHAR(50) NOT NULL,
  `costo` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `precio` DECIMAL(10,2) NOT NULL,
  `cantidad_stock` INT NOT NULL DEFAULT 0,
  `fecha_vencimiento` DATE NOT NULL,
  `numero_lote` VARCHAR(100) NOT NULL,
  `id_proveedor` VARCHAR(50) NULL,
  `descuento_porcentaje` DECIMAL(5,2) NULL DEFAULT 0.00,
  `fecha_inicio_garantia` DATE NULL,
  `fecha_fin_garantia` DATE NULL,
  PRIMARY KEY (`id_producto`),
  INDEX `fk_productos_categorias_idx` (`id_categoria` ASC),
  INDEX `fk_productos_proveedores_idx` (`id_proveedor` ASC),
  INDEX `idx_nombre_producto` (`nombre` ASC),
  INDEX `idx_numero_lote` (`numero_lote` ASC),
  CONSTRAINT `fk_productos_categorias`
    FOREIGN KEY (`id_categoria`)
    REFERENCES `categorias` (`id_categoria`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_productos_proveedores`
    FOREIGN KEY (`id_proveedor`)
    REFERENCES `proveedores` (`id_proveedor`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `movimientos_inventario`
-- Registra todas las entradas y salidas de stock.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movimientos_inventario` (
  `id_movimiento` VARCHAR(50) NOT NULL,
  `id_producto` VARCHAR(50) NOT NULL,
  `numero_lote` VARCHAR(100) NOT NULL,
  `fecha_movimiento` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_movimiento` ENUM('Creación Inicial', 'Salida Manual', 'Ajuste Positivo', 'Ajuste Negativo', 'Importación CSV', 'Dispensado por Receta', 'Entrada por Pedido', 'Devolución a Proveedor', 'Venta de Kit') NOT NULL,
  `cantidad_movida` INT NOT NULL,
  `stock_anterior` INT NOT NULL,
  `stock_nuevo` INT NOT NULL,
  `notas` TEXT NULL,
  PRIMARY KEY (`id_movimiento`),
  INDEX `fk_movimientos_productos_idx` (`id_producto` ASC),
  CONSTRAINT `fk_movimientos_productos`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `recetas_medicas`
-- Almacena las recetas médicas registradas.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recetas_medicas` (
  `id_receta` VARCHAR(50) NOT NULL,
  `nombre_paciente` VARCHAR(255) NOT NULL,
  `nombre_doctor` VARCHAR(255) NOT NULL,
  `fecha_prescripcion` DATE NOT NULL,
  `estado` ENUM('Pendiente', 'Dispensada', 'Cancelada') NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`id_receta`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `recetas_productos`
-- Tabla intermedia para la relación N:M entre recetas y productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recetas_productos` (
  `id_receta_producto` INT NOT NULL AUTO_INCREMENT,
  `id_receta` VARCHAR(50) NOT NULL,
  `id_producto` VARCHAR(50) NOT NULL,
  `cantidad_prescrita` INT NOT NULL,
  `notas` VARCHAR(255) NULL,
  PRIMARY KEY (`id_receta_producto`),
  INDEX `fk_recetas_productos_recetas_idx` (`id_receta` ASC),
  INDEX `fk_recetas_productos_productos_idx` (`id_producto` ASC),
  CONSTRAINT `fk_recetas_productos_recetas`
    FOREIGN KEY (`id_receta`)
    REFERENCES `recetas_medicas` (`id_receta`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_recetas_productos_productos`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `kits`
-- Almacena los kits o paquetes de productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kits` (
  `id_kit` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id_kit`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `kits_productos`
-- Tabla intermedia para la relación N:M entre kits y productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kits_productos` (
  `id_kit_producto` INT NOT NULL AUTO_INCREMENT,
  `id_kit` VARCHAR(50) NOT NULL,
  `id_producto` VARCHAR(50) NOT NULL,
  `cantidad` INT NOT NULL,
  PRIMARY KEY (`id_kit_producto`),
  INDEX `fk_kits_productos_kits_idx` (`id_kit` ASC),
  INDEX `fk_kits_productos_productos_idx` (`id_producto` ASC),
  CONSTRAINT `fk_kits_productos_kits`
    FOREIGN KEY (`id_kit`)
    REFERENCES `kits` (`id_kit`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_kits_productos_productos`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `pedidos_reposicion`
-- Almacena los pedidos de reposición de stock a proveedores.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedidos_reposicion` (
  `id_pedido` VARCHAR(50) NOT NULL,
  `id_proveedor` VARCHAR(50) NOT NULL,
  `fecha_pedido` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega_estimada` DATE NULL,
  `estado` ENUM('Pendiente', 'Enviado', 'Completado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`id_pedido`),
  INDEX `fk_pedidos_proveedores_idx` (`id_proveedor` ASC),
  CONSTRAINT `fk_pedidos_proveedores`
    FOREIGN KEY (`id_proveedor`)
    REFERENCES `proveedores` (`id_proveedor`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `pedidos_productos`
-- Tabla intermedia para la relación N:M entre pedidos y productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedidos_productos` (
  `id_pedido_producto` INT NOT NULL AUTO_INCREMENT,
  `id_pedido` VARCHAR(50) NOT NULL,
  `id_producto` VARCHAR(50) NOT NULL,
  `cantidad_pedida` INT NOT NULL,
  PRIMARY KEY (`id_pedido_producto`),
  INDEX `fk_pedidos_productos_pedidos_idx` (`id_pedido` ASC),
  INDEX `fk_pedidos_productos_productos_idx` (`id_producto` ASC),
  CONSTRAINT `fk_pedidos_productos_pedidos`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `pedidos_reposicion` (`id_pedido`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_pedidos_productos_productos`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla `devoluciones_proveedor`
-- Almacena las devoluciones de productos a los proveedores.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devoluciones_proveedor` (
  `id_devolucion` VARCHAR(50) NOT NULL,
  `id_producto` VARCHAR(50) NOT NULL,
  `id_proveedor` VARCHAR(50) NOT NULL,
  `fecha_devolucion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cantidad_devuelta` INT NOT NULL,
  `motivo` TEXT NOT NULL,
  PRIMARY KEY (`id_devolucion`),
  INDEX `fk_devoluciones_productos_idx` (`id_producto` ASC),
  INDEX `fk_devoluciones_proveedores_idx` (`id_proveedor` ASC),
  CONSTRAINT `fk_devoluciones_productos`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_devoluciones_proveedores`
    FOREIGN KEY (`id_proveedor`)
    REFERENCES `proveedores` (`id_proveedor`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- DATOS INICIALES
-- -----------------------------------------------------
INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES (1, 'Administrador'), (2, 'Empleado') ON DUPLICATE KEY UPDATE nombre_rol=VALUES(nombre_rol);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
