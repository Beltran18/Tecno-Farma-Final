import { type Producto, TipoMovimiento } from '@/lib/types';
import { logMovement } from './movement-service';

// --- Almacenamiento en Memoria Temporal (con persistencia en desarrollo) ---
const globalForDb = globalThis as unknown as { productos: Producto[] };
if (!globalForDb.productos) {
  globalForDb.productos = [];
}
const productos: Producto[] = globalForDb.productos;
// -----------------------------------------

export async function getAllProducts(): Promise<Producto[]> {
  // TODO: Reemplazar con la lógica para obtener todos los productos de la base de datos.
  // Ejemplo: return await db.product.findMany();
  console.log("Obteniendo todos los productos del almacén en memoria.");
  return JSON.parse(JSON.stringify(productos)); // Devolvemos una copia para evitar mutaciones.
}

export async function getProductById(id: string): Promise<Producto | undefined> {
  // TODO: Reemplazar con la lógica para obtener un producto por su ID de la base de datos.
  // Ejemplo: return await db.product.findUnique({ where: { id } });
  console.log(`Buscando producto con id: ${id}`);
  return productos.find(p => p.id === id);
}

export async function createProduct(
  productData: Omit<Producto, 'id'>,
  tipo: TipoMovimiento.CREACION_INICIAL | TipoMovimiento.IMPORTACION_CSV = TipoMovimiento.CREACION_INICIAL
): Promise<Producto> {
  // TODO: Reemplazar con la lógica para crear un producto en la base de datos.
  const nuevoProducto: Producto = {
    ...productData,
    id: `prod_${Date.now()}`,
    fechaVencimiento: new Date(productData.fechaVencimiento),
  };
  productos.push(nuevoProducto);
  console.log("Producto nuevo agregado al almacén en memoria:", nuevoProducto);
  
  await logMovement({
    productoId: nuevoProducto.id,
    productoNombre: nuevoProducto.nombre,
    tipo,
    cantidadMovida: nuevoProducto.cantidad,
    stockAnterior: 0,
    stockNuevo: nuevoProducto.cantidad,
    notas: tipo === TipoMovimiento.IMPORTACION_CSV ? 'Importado desde archivo CSV' : 'Creado desde formulario',
  });

  return nuevoProducto;
}

export async function updateProduct(id: string, productData: Partial<Omit<Producto, 'id'>>): Promise<Producto | null> {
    // TODO: Reemplazar con la lógica para actualizar un producto en la base de datos.
  const productIndex = productos.findIndex(p => p.id === id);
  if (productIndex === -1) {
    console.log(`Producto con id: ${id} no encontrado para actualizar.`);
    return null;
  }
  
  const productoAnterior = { ...productos[productIndex] };
  const stockAnterior = productoAnterior.cantidad;

  const productoActualizado: Producto = {
    ...productoAnterior,
    ...productData,
    fechaVencimiento: new Date(productData.fechaVencimiento || productoAnterior.fechaVencimiento),
  };
  
  const stockNuevo = productoActualizado.cantidad;

  if (stockNuevo !== stockAnterior) {
    const cantidadMovida = Math.abs(stockNuevo - stockAnterior);
    const tipo = stockNuevo > stockAnterior ? TipoMovimiento.AJUSTE_POSITIVO : TipoMovimiento.AJUSTE_NEGATIVO;
    await logMovement({
      productoId: id,
      productoNombre: productoActualizado.nombre,
      tipo,
      cantidadMovida,
      stockAnterior,
      stockNuevo,
      notas: 'Cantidad ajustada desde el formulario de edición.',
    });
  }


  productos[productIndex] = productoActualizado;
  console.log("Producto actualizado en el almacén en memoria:", productoActualizado);
  return productoActualizado;
}

export async function registerProductExit(id: string, cantidadSalida: number, notas?: string): Promise<Producto | null> {
  const productIndex = productos.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return null;
  }
  
  const productoAnterior = { ...productos[productIndex] };
  const stockAnterior = productoAnterior.cantidad;

  if (cantidadSalida > stockAnterior) {
    throw new Error('Stock insuficiente.');
  }

  const stockNuevo = stockAnterior - cantidadSalida;
  
  const productoActualizado: Producto = {
    ...productoAnterior,
    cantidad: stockNuevo,
  };
  
  await logMovement({
    productoId: id,
    productoNombre: productoActualizado.nombre,
    tipo: TipoMovimiento.SALIDA_MANUAL,
    cantidadMovida: cantidadSalida,
    stockAnterior,
    stockNuevo,
    notas: notas || 'Salida registrada manualmente.',
  });

  productos[productIndex] = productoActualizado;
  console.log("Salida de producto registrada:", productoActualizado);
  return productoActualizado;
}

export async function registerProductEntry(id: string, cantidadEntrada: number, tipo: TipoMovimiento, notas?: string): Promise<Producto | null> {
  const productIndex = productos.findIndex(p => p.id === id);
  if (productIndex === -1) {
    throw new Error(`Producto con ID ${id} no encontrado para registrar entrada.`);
  }

  const productoAnterior = { ...productos[productIndex] };
  const stockAnterior = productoAnterior.cantidad;
  const stockNuevo = stockAnterior + cantidadEntrada;

  const productoActualizado: Producto = {
    ...productoAnterior,
    cantidad: stockNuevo,
  };
  
  await logMovement({
    productoId: id,
    productoNombre: productoActualizado.nombre,
    tipo,
    cantidadMovida: cantidadEntrada,
    stockAnterior,
    stockNuevo,
    notas,
  });

  productos[productIndex] = productoActualizado;
  console.log(`${tipo} registrada para el producto ${id}: ${cantidadEntrada} unidades.`);
  return productoActualizado;
}


export async function deleteProduct(id: string): Promise<boolean> {
    // TODO: Reemplazar con la lógica para eliminar un producto de la base de datos.
    // Ejemplo: await db.product.delete({ where: { id } }); return true;
  const productIndex = productos.findIndex(p => p.id === id);
  if (productIndex === -1) {
    console.log(`Producto con id: ${id} no encontrado para eliminar.`);
    return false;
  }
  productos.splice(productIndex, 1);
  console.log(`Producto con id: ${id} eliminado del almacén en memoria.`);
  return true;
}
