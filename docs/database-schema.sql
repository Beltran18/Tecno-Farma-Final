-- #####################################################################
-- ##                    ESQUEMA DE BASE DE DATOS                     ##
-- ##                         TecnoFarma                              ##
-- #####################################################################
--
-- Este archivo contiene el esquema SQL para la base de datos MySQL
-- del sistema de gestión de inventarios TecnoFarma.
--
-- Todas las tablas y campos están en español.

-- -----------------------------------------------------
-- Tabla `roles`
-- Almacena los roles de los empleados (Ej: Administrador, Empleado).
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` INT NOT NULL AUTO_INCREMENT,
  `nombre_rol` VARCHAR(100) NOT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_rol`),
  UNIQUE INDEX `nombre_rol_UNIQUE` (`nombre_rol` ASC) VISIBLE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `empleados`
-- Almacena la información de los usuarios del sistema.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `empleados` (
  `id_empleado` VARCHAR(255) NOT NULL,
  `nombre_completo` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `contrasena_hash` VARCHAR(255) NOT NULL,
  `id_rol` INT NOT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_empleado`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_empleados_roles_idx` (`id_rol` ASC) VISIBLE,
  CONSTRAINT `fk_empleados_roles`
    FOREIGN KEY (`id_rol`)
    REFERENCES `roles` (`id_rol`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `categorias`
-- Almacena las categorías de los productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_categoria`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC) VISIBLE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `proveedores`
-- Almacena la información de los proveedores de productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `proveedores` (
  `id_proveedor` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `nombre_contacto` VARCHAR(255) NULL,
  `telefono_contacto` VARCHAR(50) NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_proveedor`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC) VISIBLE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `productos`
-- Tabla principal que almacena todos los productos del inventario.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `id_categoria` VARCHAR(255) NOT NULL,
  `id_proveedor` VARCHAR(255) NULL,
  `costo` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `precio` DECIMAL(10,2) NOT NULL,
  `cantidad_stock` INT NOT NULL DEFAULT 0,
  `descuento_porcentaje` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `fecha_vencimiento` DATE NOT NULL,
  `numero_lote` VARCHAR(100) NOT NULL,
  `fecha_inicio_garantia` DATE NULL,
  `fecha_fin_garantia` DATE NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_producto`),
  INDEX `fk_productos_categorias_idx` (`id_categoria` ASC) VISIBLE,
  INDEX `fk_productos_proveedores_idx` (`id_proveedor` ASC) VISIBLE,
  CONSTRAINT `fk_productos_categorias`
    FOREIGN KEY (`id_categoria`)
    REFERENCES `categorias` (`id_categoria`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_productos_proveedores`
    FOREIGN KEY (`id_proveedor`)
    REFERENCES `proveedores` (`id_proveedor`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `movimientos_inventario`
-- Registra cada entrada y salida de stock para trazabilidad.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movimientos_inventario` (
  `id_movimiento` VARCHAR(255) NOT NULL,
  `id_producto` VARCHAR(255) NOT NULL,
  `fecha_movimiento` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_movimiento` VARCHAR(100) NOT NULL,
  `cantidad_movida` INT NOT NULL,
  `stock_anterior` INT NOT NULL,
  `stock_nuevo` INT NOT NULL,
  `notas` TEXT NULL,
  PRIMARY KEY (`id_movimiento`),
  INDEX `fk_movimientos_productos_idx` (`id_producto` ASC) VISIBLE,
  CONSTRAINT `fk_movimientos_productos`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `recetas`
-- Almacena la información de las recetas médicas.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recetas` (
  `id_receta` VARCHAR(255) NOT NULL,
  `nombre_paciente` VARCHAR(255) NOT NULL,
  `nombre_doctor` VARCHAR(255) NOT NULL,
  `fecha_prescripcion` DATE NOT NULL,
  `estado` ENUM('Pendiente', 'Dispensada', 'Cancelada') NOT NULL DEFAULT 'Pendiente',
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_receta`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `recetas_medicamentos`
-- Tabla de unión entre recetas y productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recetas_medicamentos` (
  `id_receta_medicamento` INT NOT NULL AUTO_INCREMENT,
  `id_receta` VARCHAR(255) NOT NULL,
  `id_producto` VARCHAR(255) NOT NULL,
  `cantidad_prescrita` INT NOT NULL,
  PRIMARY KEY (`id_receta_medicamento`),
  INDEX `fk_recmed_recetas_idx` (`id_receta` ASC) VISIBLE,
  INDEX `fk_recmed_productos_idx` (`id_producto` ASC) VISIBLE,
  CONSTRAINT `fk_recmed_recetas`
    FOREIGN KEY (`id_receta`)
    REFERENCES `recetas` (`id_receta`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_recmed_productos`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `kits`
-- Almacena los kits o paquetes de productos.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kits` (
  `id_kit` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `precio_venta` DECIMAL(10,2) NOT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_kit`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `kits_componentes`
-- Tabla de unión entre kits y los productos que los componen.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kits_componentes` (
  `id_kit_componente` INT NOT NULL AUTO_INCREMENT,
  `id_kit` VARCHAR(255) NOT NULL,
  `id_producto_componente` VARCHAR(255) NOT NULL,
  `cantidad` INT NOT NULL,
  PRIMARY KEY (`id_kit_componente`),
  INDEX `fk_kitcomp_kits_idx` (`id_kit` ASC) VISIBLE,
  INDEX `fk_kitcomp_productos_idx` (`id_producto_componente` ASC) VISIBLE,
  CONSTRAINT `fk_kitcomp_kits`
    FOREIGN KEY (`id_kit`)
    REFERENCES `kits` (`id_kit`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_kitcomp_productos`
    FOREIGN KEY (`id_producto_componente`)
    REFERENCES `productos` (`id_producto`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `pedidos`
-- Almacena los pedidos de reposición a proveedores.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id_pedido` VARCHAR(255) NOT NULL,
  `id_proveedor` VARCHAR(255) NOT NULL,
  `fecha_pedido` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega_estimada` DATE NULL,
  `estado` ENUM('Pendiente', 'Enviado', 'Completado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pedido`),
  INDEX `fk_pedidos_proveedores_idx` (`id_proveedor` ASC) VISIBLE,
  CONSTRAINT `fk_pedidos_proveedores`
    FOREIGN KEY (`id_proveedor`)
    REFERENCES `proveedores` (`id_proveedor`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `pedidos_productos`
-- Tabla de unión entre pedidos y los productos solicitados.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedidos_productos` (
  `id_pedido_producto` INT NOT NULL AUTO_INCREMENT,
  `id_pedido` VARCHAR(255) NOT NULL,
  `id_producto` VARCHAR(255) NOT NULL,
  `cantidad_pedida` INT NOT NULL,
  PRIMARY KEY (`id_pedido_producto`),
  INDEX `fk_pedprod_pedidos_idx` (`id_pedido` ASC) VISIBLE,
  INDEX `fk_pedprod_productos_idx` (`id_producto` ASC) VISIBLE,
  CONSTRAINT `fk_pedprod_pedidos`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `pedidos` (`id_pedido`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_pedprod_productos`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `devoluciones`
-- Almacena las devoluciones de productos a proveedores.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devoluciones` (
  `id_devolucion` VARCHAR(255) NOT NULL,
  `id_producto` VARCHAR(255) NOT NULL,
  `fecha_devolucion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cantidad_devuelta` INT NOT NULL,
  `motivo` TEXT NOT NULL,
  PRIMARY KEY (`id_devolucion`),
  INDEX `fk_devoluciones_productos_idx` (`id_producto` ASC) VISIBLE,
  CONSTRAINT `fk_devoluciones_productos`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Inserción de datos iniciales
-- -----------------------------------------------------
INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES (1, 'Administrador'), (2, 'Empleado') ON DUPLICATE KEY UPDATE nombre_rol=VALUES(nombre_rol);
