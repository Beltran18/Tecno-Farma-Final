# Estado de Requerimientos Funcionales - TecnoFarma

Este documento realiza un seguimiento del progreso de la implementación de los requerimientos funcionales del proyecto.

## Leyenda de Estados
- ✅ **Completado:** La funcionalidad está implementada y operativa (frontend y backend conectados).
- 🟡 **En Proceso:** La interfaz de usuario (UI) existe, pero la lógica de backend es parcial o inexistente.
- ❌ **Pendiente:** La funcionalidad aún no se ha iniciado.

---

| ID | Requerimiento | Estado | Notas |
|:---|:---|:---:|:---|
| **RF001** | El sistema debe permitir al administrador configurar descuentos por volumen o promociones en productos específicos. | ❌ **Pendiente** | |
| **RF002** | El sistema debe permitir al administrador realizar pedidos de reposición de stock directamente a través del sistema. | ❌ **Pendiente** | |
| **RF003** | El sistema debe permitir al usuario visualizar un dashboard con indicadores clave como rotación de inventario y margen de ganancia. | ✅ **Completado** | Se muestran indicadores dinámicos basados en los datos del inventario (Valor total y Unidades totales). Métricas más complejas como rotación o margen requieren datos adicionales (costos, ventas). |
| **RF004** | El sistema debe permitir al administrador configurar y automatizar el envío de reportes periódicos de inventario a una dirección de correo electrónico. | ❌ **Pendiente** | |
| **RF005** | El sistema debe permitir a los usuarios ingresar al soporte técnico en línea. | ❌ **Pendiente** | |
| **RF006** | El sistema debe permitir al administrador y a empleados operar en plataformas de escritorio. | ✅ **Completado** | La aplicación es una aplicación web, accesible desde escritorio. |
| **RF007** | El sistema debe permitir al administrador gestionar las recetas médicas, incluyendo verificación de stock de los medicamentos prescritos. | ❌ **Pendiente** | |
| **RF008** | El sistema debe permitir al administrador imprimir etiquetas para los productos, incluyendo información como precio y fecha de vencimiento. | ❌ **Pendiente** | |
| **RF009** | El sistema debe permitir al administrador acceder a una vista de calendario para seguimiento de fechas de vencimiento y pedidos programados. | ❌ **Pendiente** | |
| **RF010** | El sistema debe permitir al administrador realizar análisis de rentabilidad de producto o categoría. | ❌ **Pendiente** | |
| **RF011** | El sistema debe permitir al administrador realizar la gestión de garantías de productos dentro del inventario, registrando fechas de inicio y fin de la garantía. | ❌ **Pendiente** | |
| **RF012** | El sistema debe permitir a los usuarios ingresar a una herramienta de ayuda y tutoriales para facilitar el aprendizaje de las funcionalidades del sistema. | ❌ **Pendiente** | |
| **RF013** | El sistema debe permitir al usuario registrar manualmente el estado de entrega de los pedidos en línea (pendiente, enviado, entregado). | ❌ **Pendiente** | |
| **RF014** | El sistema debe permitir al usuario recibir notificaciones sobre actualizaciones del sistema para acceder a nuevas funcionalidades. | ❌ **Pendiente** | |
| **RF015** | El sistema debe permitir al administrador registrar nuevos productos en el inventario con detalles como nombre, categoría, precio, cantidad, fecha de vencimiento y número de lote. | ✅ **Completado** | Funcionalidad CRUD completa implementada. Los datos se guardan en memoria y se pierden al recargar. |
| **RF016** | El sistema debe permitir al administrador actualizar la información de los productos existentes en el inventario. | ✅ **Completado** | Funcionalidad CRUD completa implementada. Los datos se guardan en memoria y se pierden al recargar. |
| **RF017** | El sistema debe permitir al administrador eliminar productos del inventario. | ✅ **Completado** | Funcionalidad CRUD completa implementada. Los datos se guardan en memoria y se pierden al recargar. |
| **RF018** | El sistema debe permitir a los usuarios buscar productos en el inventario por nombre, categoría o número de lote. | ✅ **Completado** | La barra de búsqueda filtra los resultados en el frontend. |
| **RF019** | El sistema debe permitir al usuario visualizar alertas de productos con bajo stock, según un umbral definido por el mismo usuario. | ✅ **Completado** | Las alertas se muestran en la pestaña "Alertas". El umbral está definido como una constante. |
| **RF020** | El sistema debe permitir a los usuarios generar alertas para productos próximos a vencer. | ✅ **Completado** | Las alertas se muestran en la pestaña "Alertas". El umbral de días está definido como una constante. |
| **RF021** | El sistema debe permitir a los usuarios realizar conteos físicos del inventario y ajustar las cantidades en el sistema. | ✅ **Completado** | El ajuste de cantidades se puede hacer a través de la edición de productos (RF016), que actualmente guarda en memoria. |
| **RF022** | El sistema debe permitir al administrador realizar la importación de datos de inventario desde archivos en formatos CSV o Excel. | ❌ **Pendiente** | |
| **RF023** | El sistema debe permitir al administrador realizar la exportación de datos de inventario a archivos en formatos CSV o Excel. | ❌ **Pendiente** | |
| **RF024** | El sistema debe permitir al usuario generar reportes de inventario actuales que incluyan el stock total, el valor del inventario y los productos próximos a vencer. | ❌ **Pendiente** | |
| **RF025** | El sistema debe permitir a los usuarios registrar las entradas de nuevos suministros al inventario. | ✅ **Completado** | Se logra a través del registro de nuevos productos (RF015), que actualmente guarda en memoria. |
| **RF026** | El sistema debe permitir a los usuarios registrar las salidas de productos del inventario. | ❌ **Pendiente** | No hay un registro explícito de "salidas", solo edición o eliminación. |
| **RF027** | El sistema debe permitir a los usuarios mantener un historial de todas las transacciones de inventario, incluyendo entradas y salidas. | ❌ **Pendiente** | |
| **RF028** | El sistema debe permitir al administrador gestionar proveedores, incluyendo registro, actualización y eliminación de proveedores. | ✅ **Completado** | Se ha creado una página para gestionar (crear/editar/eliminar) proveedores. Los datos se guardan en memoria. |
| **RF029** | El sistema debe permitir al administrador asociar productos a sus respectivos proveedores. | ✅ **Completado** | Se puede seleccionar un proveedor desde el formulario de producto. |
| **RF030** | El sistema debe permitir al administrador generar reportes de compras a proveedores, incluyendo cantidades, fechas y costos. | ❌ **Pendiente** | |
| **RF031** | El sistema debe permitir al administrador registrar y gestionar las devoluciones de productos a proveedores. | ❌ **Pendiente** | |
| **RF032** | El sistema debe permitir al administrador dar soporte a la configuración de múltiples empleados con diferentes niveles de acceso y permisos. | ❌ **Pendiente** | |
| **RF033** | El sistema debe permitir al administrador dar autenticación de usuario para acceder a cualquier funcionalidad de gestión de inventario. | 🟡 **En Proceso** | Las páginas de autenticación existen, pero falta la lógica de roles y permisos. |
| **RF034** | El sistema debe registrar y mostrar el historial de cambios de cada producto en el inventario. | ❌ **Pendiente** | |
| **RF035** | El sistema debe permitir al administrador gestionar categorías de productos para una organización eficiente del inventario. | ✅ **Completado** | Se ha creado una página para gestionar (crear/eliminar) categorías. El formulario de productos ahora usa estas categorías dinámicamente. |
| **RF036** | El sistema debe permitir al administrador configurar notificaciones automáticas por correo electrónico para alertas críticas de inventario. | ❌ **Pendiente** | |
| **RF037** | El sistema debe permitir al usuario consultar el historial de ventas de un producto específico. | ❌ **Pendiente** | |
| **RF038** | El sistema debe permitir al administrador registrar la trazabilidad completa de los lotes de medicamentos para cumplir con regulaciones sanitarias. | ❌ **Pendiente** | |
| **RF039** | El sistema debe permitir al administrador configurar las alertas para la revisión de productos no vendidos o de lento movimiento. | ❌ **Pendiente** | |
| **RF040** | El sistema debe sugerir reposiciones cuando un producto esté por debajo del stock mínimo definido. | ❌ **Pendiente** | |
| **RF041** | El sistema debe permitir al administrador realizar la creación de paquetes o kits de productos, gestionando su inventario como una unidad. | ❌ **Pendiente** | |
| **RF042** | El sistema debe permitir al administrador incluir medidas de seguridad para la protección de datos sensibles, incluyendo cifrado de datos y copias de seguridad automáticas. | ❌ **Pendiente** | |
| **RF043** | El sistema debe mostrar un resumen de costos y ventas basado en los movimientos del inventario. | ❌ **Pendiente** | |
| **RF044** | El sistema debe permitir a los usuarios registrarse proporcionando nombre, correo y contraseña. | 🟡 **En Proceso** | La página de registro existe, pero no hay lógica de backend. |
| **RF045** | El sistema debe permitir a los usuarios iniciar sesión utilizando su correo y contraseña. | 🟡 **En Proceso** | La página de inicio de sesión existe, pero no hay lógica de backend. |
| **RF046** | El sistema debe permitir a los usuarios validar credenciales y proteger el acceso a las funcionalidades mediante sesión. | ❌ **Pendiente** | |
| **RF047** | El sistema debe permitir a los usuarios la recuperación de contraseña por correo electrónico. | 🟡 **En Proceso** | La página de recuperación existe, pero no hay lógica de backend. |
| **RF048** | El sistema debe permitir a los usuarios mantener las sesiones activas hasta que los usuarios cierren sesión manualmente o expire el tiempo definido. | ❌ **Pendiente** | |
| **RF049** | El sistema debe mostrar a los usuarios mensajes de error amigables en caso de credenciales inválidas u otros errores de autenticación. | ✅ **Completado** | El sistema de notificaciones se usa para mostrar errores de las operaciones CRUD. |
| **RF050** | El sistema deberá permitir al administrador crear la cuenta administrador. | ❌ **Pendiente** | |
| **RF051** | El sistema deberá permitir al administrador crear cuentas de empleados. | ❌ **Pendiente** | |
