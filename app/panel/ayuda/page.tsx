'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpenCheck } from "lucide-react";

export default function PaginaAyuda() {
  return (
    <Card>
        <CardHeader>
            <div className="flex items-center gap-4">
                <BookOpenCheck className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>Centro de Ayuda y Tutoriales</CardTitle>
                    <CardDescription>
                        Encuentra respuestas a preguntas frecuentes y aprende a usar el sistema.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>¿Cómo registrar, editar o eliminar un producto?</AccordionTrigger>
                    <AccordionContent>
                        Para gestionar productos, ve a la pestaña <strong>"Productos"</strong> en el panel principal.
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Registrar:</strong> Haz clic en el botón "Registrar Producto". Se abrirá un formulario donde deberás llenar todos los detalles del producto, como nombre, categoría, precio, cantidad, fecha de vencimiento y lote.</li>
                            <li><strong>Editar:</strong> En la tabla de productos, haz clic en el menú de los tres puntos al final de la fila del producto que deseas modificar y selecciona "Editar". Se abrirá el mismo formulario con los datos cargados para que los actualices.</li>
                            <li><strong>Eliminar:</strong> En el mismo menú de acciones, selecciona "Eliminar". Se te pedirá una confirmación antes de borrar el producto permanentemente.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>¿Cómo importar o exportar datos desde CSV?</AccordionTrigger>
                    <AccordionContent>
                        En la pestaña <strong>"Productos"</strong>, encontrarás los botones de "Importar" y "Exportar".
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Importar:</strong> Al hacer clic, se abrirá un diálogo para que selecciones un archivo CSV. El archivo debe contener las columnas: <code>nombre, categoria, costo, precio, cantidad, fechaVencimiento (YYYY-MM-DD), numeroLote, proveedorNombre</code>. El sistema procesará el archivo y agregará los productos a tu inventario.</li>
                            <li><strong>Exportar:</strong> Al hacer clic, se generará y descargará automáticamente un archivo CSV con todo tu inventario actual, ideal para hacer respaldos o análisis en otras herramientas.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>¿Qué información me muestra el Panel de Control?</AccordionTrigger>
                    <AccordionContent>
                        El Panel de Control es tu vista principal del estado de la farmacia. Te muestra:
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Indicadores Clave:</strong> Tarjetas con el valor total del inventario, el número total de unidades, la cantidad de productos con stock bajo y los que están próximos a vencer.</li>
                            <li><strong>Distribución por Categoría:</strong> Un gráfico de pastel que te ayuda a visualizar qué categorías de productos son las más predominantes en tu inventario.</li>
                            <li><strong>Actividad Reciente:</strong> Una lista de los últimos movimientos o productos añadidos al sistema.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>¿Cómo funcionan las Alertas?</AccordionTrigger>
                    <AccordionContent>
                        La pestaña <strong>"Alertas"</strong> te ayuda a anticiparte a problemas de inventario.
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Puedes configurar los umbrales para "Stock Bajo", "Vencimiento" y "Lento Movimiento".</li>
                            <li>Debajo de la configuración, verás las listas de productos que actualmente cumplen con esas condiciones de alerta.</li>
                            <li>En las alertas de Stock Bajo, puedes crear un pedido de reposición directamente con un solo clic.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-5">
                    <AccordionTrigger>¿Para qué sirven las páginas de Categorías y Proveedores?</AccordionTrigger>
                    <AccordionContent>
                        Estas secciones te permiten organizar mejor tu inventario:
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Categorías:</strong> Aquí puedes crear o eliminar las categorías que usarás para clasificar tus productos (ej. Analgésicos, Antibióticos, Vitaminas). Estas categorías aparecerán en el formulario de registro de productos para que puedas asignarlas.</li>
                            <li><strong>Proveedores:</strong> Te permite mantener una lista de tus proveedores con su información de contacto. Al registrar un producto, puedes asociarlo a uno de estos proveedores para un mejor seguimiento y para poder crear pedidos de reposición.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger>¿Cómo gestiono las Recetas Médicas?</AccordionTrigger>
                    <AccordionContent>
                        En la sección de <strong>"Recetas"</strong>, puedes manejar todo el ciclo de prescripciones.
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Registrar:</strong> Haz clic en "Registrar Receta", llena los datos del paciente y el doctor, y luego añade los medicamentos con las cantidades prescritas.</li>
                            <li><strong>Dispensar:</strong> En el menú de acciones de una receta pendiente, selecciona "Dispensar Receta". Esta acción es crucial, ya que descuenta automáticamente el stock de cada medicamento del inventario. La receta cambiará su estado a "Dispensada".</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                    <AccordionTrigger>¿Cómo funcionan los Pedidos a Proveedores?</AccordionTrigger>
                    <AccordionContent>
                        La sección de <strong>"Pedidos"</strong> te ayuda a reabastecer tu stock.
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Crear Pedido:</strong> Ve a "Pedidos", haz clic en "Nuevo Pedido", selecciona un proveedor y añade los productos y cantidades que necesitas. También puedes poner una fecha de entrega estimada para seguirla en el Calendario.</li>
                            <li><strong>Seguimiento de Estado:</strong> Un pedido tiene un flujo: <code>Pendiente</code> → <code>Enviado</code> → <code>Completado</code>. Puedes cambiar el estado desde el menú de acciones.</li>
                            <li><strong>Recepción de Mercancía:</strong> Al marcar un pedido como <strong>"Completado"</strong>, el sistema incrementará automáticamente el stock de los productos recibidos en tu inventario.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                    <AccordionTrigger>¿Qué son los Kits y cómo se usan?</AccordionTrigger>
                    <AccordionContent>
                        Los <strong>Kits</strong> te permiten agrupar varios productos para venderlos como un solo paquete a un precio definido.
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Crear Kit:</strong> En "Kits y Paquetes", define un nombre, un precio de venta para el kit, y selecciona los productos que lo componen y sus cantidades.</li>
                            <li><strong>Stock de Kits:</strong> El "Stock Disponible" de un kit no se guarda por separado; se calcula en tiempo real basándose en el stock de sus componentes. Por ejemplo, si un kit necesita 2 unidades del Producto A (tienes 10) y 1 del Producto B (tienes 3), solo podrás vender 3 kits.</li>
                            <li><strong>Vender Kit:</strong> Al vender un kit, el sistema descuenta automáticamente del inventario las cantidades correspondientes de cada uno de sus productos componentes.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-9">
                    <AccordionTrigger>¿Cómo gestiono los Empleados y sus roles? (Solo Admins)</AccordionTrigger>
                    <AccordionContent>
                        Si eres Administrador, en la sección de <strong>"Empleados"</strong> puedes gestionar quién accede al sistema.
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Roles:</strong> Hay dos tipos de roles: <code>Administrador</code>, que tiene acceso a todas las funciones, incluyendo gestión de empleados, categorías y reportes financieros; y <code>Empleado</code>, que tiene acceso a las funciones operativas del día a día como gestionar productos, recetas y pedidos.</li>
                            <li><strong>Gestión:</strong> Puedes crear nuevas cuentas, editar la información y el rol de los usuarios existentes, o eliminar cuentas que ya no necesites (excepto las cuentas de administrador principal).</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-10">
                    <AccordionTrigger>¿Para qué sirve la Trazabilidad de Lotes?</AccordionTrigger>
                    <AccordionContent>
                        La página de <strong>"Trazabilidad"</strong> es una herramienta poderosa para el cumplimiento normativo y el control de calidad.
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Ingresa un número de lote específico en el buscador.</li>
                            <li>El sistema te mostrará el historial completo de ese lote: cuándo y cómo entró al inventario (creación, pedido), todas las salidas (ventas, dispensaciones, devoluciones) y cualquier ajuste que haya tenido.</li>
                            <li>Esto te permite rastrear cada unidad desde su origen hasta su destino final.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-11">
                    <AccordionTrigger>¿Qué información encuentro en la página de Análisis? (Solo Admins)</AccordionTrigger>
                    <AccordionContent>
                        La sección de <strong>"Análisis"</strong> te ofrece una visión financiera de la rentabilidad de tu negocio.
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>KPIs Principales:</strong> Verás tarjetas con la Ganancia Bruta Total, Ventas Totales y el Costo de los Bienes Vendidos (COGS).</li>
                            <li><strong>Rentabilidad por Producto:</strong> Una tabla que clasifica tus productos de mayor a menor rentabilidad, mostrándote cuántas unidades has vendido, el margen que te deja cada una y la ganancia total que ha generado.</li>
                            <li><strong>Ganancia por Categoría:</strong> Un gráfico de barras que te muestra qué categorías de productos son las más rentables para tu farmacia.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
  )
}
