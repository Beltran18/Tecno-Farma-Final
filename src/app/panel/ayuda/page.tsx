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
                            <li><strong>Importar:</strong> Al hacer clic, se abrirá un diálogo para que selecciones un archivo CSV. El archivo debe contener las columnas: <code>nombre, categoria, precio, cantidad, fechaVencimiento (YYYY-MM-DD), numeroLote, proveedorNombre</code>. El sistema procesará el archivo y agregará los productos a tu inventario.</li>
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
                            <li><strong>Productos Recientes:</strong> Una lista de los últimos productos que se han añadido al sistema.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>¿Cómo funcionan las Alertas?</AccordionTrigger>
                    <AccordionContent>
                        La pestaña <strong>"Alertas"</strong> te ayuda a anticiparte a problemas de inventario.
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Puedes configurar los umbrales para "Stock Bajo" (ej. alertar si quedan 10 unidades o menos) y "Vencimiento" (ej. alertar si un producto vence en los próximos 30 días).</li>
                            <li>Debajo de la configuración, verás las listas de productos que actualmente cumplen con esas condiciones de alerta.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-5">
                    <AccordionTrigger>¿Para qué sirven las páginas de Categorías y Proveedores?</AccordionTrigger>
                    <AccordionContent>
                        Estas secciones te permiten organizar mejor tu inventario:
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><strong>Categorías:</strong> Aquí puedes crear o eliminar las categorías que usarás para clasificar tus productos (ej. Analgésicos, Antibióticos, Vitaminas). Estas categorías aparecerán en el formulario de registro de productos para que puedas asignarlas.</li>
                            <li><strong>Proveedores:</strong> Te permite mantener una lista de tus proveedores con su información de contacto. Al registrar un producto, puedes asociarlo a uno de estos proveedores para un mejor seguimiento.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
  )
}
