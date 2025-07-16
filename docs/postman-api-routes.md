# Guía de Rutas de API para Postman - TecnoFarma

Esta guía documenta todas las rutas de la API disponibles en el proyecto TecnoFarma, diseñada para ser utilizada con herramientas como Postman.

## Configuración Inicial

- **URL Base**: `http://localhost:9002/api`
- **Autenticación**: La mayoría de las rutas del panel están protegidas por sesión. Para probarlas, primero debes hacer una petición `POST` a la ruta `/auth/login`. Postman guardará automáticamente la cookie de sesión (`tecnofarma-session`) y la enviará en las siguientes peticiones que hagas, autenticándote correctamente.

---

## 1. Autenticación (`/auth`)

### Iniciar Sesión
- **Método**: `POST`
- **Ruta**: `/auth/login`
- **Body (raw, JSON)**:
  ```json
  {
      "email": "admin@tecnofarma.dev",
      "password": "password123"
  }
  ```

### Registrar Nuevo Usuario (Empleado por defecto)
- **Método**: `POST`
- **Ruta**: `/auth/register`
- **Body (raw, JSON)**:
  ```json
  {
      "nombre": "Nuevo Usuario de Prueba",
      "email": "test@ejemplo.com",
      "password": "password123"
  }
  ```

### Cerrar Sesión
- **Método**: `POST`
- **Ruta**: `/auth/logout`
- **Body**: Ninguno

### Obtener Usuario Actual
- **Método**: `GET`
- **Ruta**: `/auth/user`
- **Descripción**: Devuelve los datos del usuario logueado.

---

## 2. Productos (`/productos`)

### Obtener todos los productos
- **Método**: `GET`
- **Ruta**: `/productos`

### Obtener un producto por ID
- **Método**: `GET`
- **Ruta**: `/productos/{id}` (ej. `/productos/1`)

### Crear un nuevo producto
- **Método**: `POST`
- **Ruta**: `/productos`
- **Body (raw, JSON)**:
  ```json
  {
    "nombre": "Ibuprofeno 800mg",
    "categoria": "Analgésicos",
    "costo": 500,
    "precio": 1200,
    "cantidad": 150,
    "fechaVencimiento": "2026-12-31",
    "numeroLote": "LOTE-IBU-800",
    "proveedorId": "1",
    "descuento": 10
  }
  ```

### Actualizar un producto
- **Método**: `PUT`
- **Ruta**: `/productos/{id}` (ej. `/productos/1`)
- **Body (raw, JSON)** (solo envía los campos a cambiar):
  ```json
  {
    "precio": 1300,
    "cantidad": 200
  }
  ```

### Eliminar un producto
- **Método**: `DELETE`
- **Ruta**: `/productos/{id}` (ej. `/productos/1`)

### Registrar salida de producto
- **Método**: `POST`
- **Ruta**: `/productos/{id}/salida` (ej. `/productos/1/salida`)
- **Body (raw, JSON)**:
  ```json
  {
    "cantidad": 5,
    "notas": "Venta directa en mostrador"
  }
  ```

---

## 3. Categorías (`/categorias`)

### Obtener todas las categorías
- **Método**: `GET`
- **Ruta**: `/categorias`

### Crear una nueva categoría
- **Método**: `POST`
- **Ruta**: `/categorias`
- **Body (raw, JSON)**:
  ```json
  {
    "nombre": "Antibióticos"
  }
  ```

### Eliminar una categoría
- **Método**: `DELETE`
- **Ruta**: `/categorias/{id}` (ej. `/categorias/1`)

---

## 4. Proveedores (`/proveedores`)

### Obtener todos los proveedores
- **Método**: `GET`
- **Ruta**: `/proveedores`

### Crear un nuevo proveedor
- **Método**: `POST`
- **Ruta**: `/proveedores`
- **Body (raw, JSON)**:
  ```json
  {
    "nombre": "Genfar",
    "contacto": "Ana Giraldo",
    "telefono": "3334445566"
  }
  ```

### Actualizar un proveedor
- **Método**: `PUT`
- **Ruta**: `/proveedores/{id}` (ej. `/proveedores/1`)
- **Body (raw, JSON)**:
  ```json
  {
    "telefono": "3334449999"
  }
  ```

### Eliminar un proveedor
- **Método**: `DELETE`
- **Ruta**: `/proveedores/{id}` (ej. `/proveedores/1`)

---

## 5. Empleados (`/empleados`)

### Obtener todos los empleados
- **Método**: `GET`
- **Ruta**: `/empleados`

### Crear un nuevo empleado
- **Método**: `POST`
- **Ruta**: `/empleados`
- **Body (raw, JSON)**:
  ```json
  {
    "nombre": "Carlos Valdes",
    "email": "carlos@tecnofarma.dev",
    "rol": "Empleado",
    "password": "securepassword"
  }
  ```

### Actualizar un empleado
- **Método**: `PUT`
- **Ruta**: `/empleados/{id}` (ej. `/empleados/3`)
- **Body (raw, JSON)**:
  ```json
  {
    "rol": "Administrador"
  }
  ```

### Eliminar un empleado
- **Método**: `DELETE`
- **Ruta**: `/empleados/{id}` (ej. `/empleados/3`)

---

## 6. Pedidos a Proveedores (`/pedidos`)

### Obtener todos los pedidos
- **Método**: `GET`
- **Ruta**: `/pedidos`

### Crear un nuevo pedido
- **Método**: `POST`
- **Ruta**: `/pedidos`
- **Body (raw, JSON)**:
  ```json
  {
    "proveedorId": "1",
    "fechaEntregaEstimada": "2024-08-15",
    "productos": [
      { "productoId": "1", "cantidadPedida": 50 },
      { "productoId": "2", "cantidadPedida": 100 }
    ]
  }
  ```

### Actualizar estado de un pedido
- **Método**: `PUT`
- **Ruta**: `/pedidos/{id}` (ej. `/pedidos/1`)
- **Body (raw, JSON)**:
  ```json
  {
    "estado": "Enviado"
  }
  ```
  *Posibles estados: `Pendiente`, `Enviado`, `Completado`, `Cancelado`*

### Eliminar un pedido
- **Método**: `DELETE`
- **Ruta**: `/pedidos/{id}` (ej. `/pedidos/1`)

---

## 7. Recetas Médicas (`/recetas`)

### Obtener todas las recetas
- **Método**: `GET`
- **Ruta**: `/recetas`

### Crear una nueva receta
- **Método**: `POST`
- **Ruta**: `/recetas`
- **Body (raw, JSON)**:
  ```json
  {
    "pacienteNombre": "Mariana Pajón",
    "doctorNombre": "Dr. House",
    "fechaPrescripcion": "2024-07-25",
    "medicamentos": [
      { "productoId": "3", "cantidadPrescrita": 1 },
      { "productoId": "5", "cantidadPrescrita": 2 }
    ]
  }
  ```

### Dispensar una receta
- **Método**: `POST`
- **Ruta**: `/recetas/{id}/dispensar` (ej. `/recetas/1/dispensar`)
- **Body**: Ninguno

### Eliminar una receta
- **Método**: `DELETE`
- **Ruta**: `/recetas/{id}` (ej. `/recetas/1`)
