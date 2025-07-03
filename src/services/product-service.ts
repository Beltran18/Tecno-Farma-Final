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
  console.log("Obteniendo todos los productos del almacén en memoria.");
  return JSON.parse(JSON.stringify(productos)); 
}

export async function getProductById(id: string): Promise<Producto | undefined> {
  console.log(`Buscando producto con id: ${id}`);
  return productos.find(p => p.id === id);
}

export async function createProduct(
  productData: Omit<Producto, 'id'>,
  tipo: TipoMovimiento.CREACION_INICIAL | TipoMovimiento.IMPORTACION_CSV = TipoMovimiento.CREACION_INICIAL
): Promise<Producto> {
  const nuevoProducto: Producto = {
    id: `prod_${Date.now()}`,
    nombre: productData.nombre,
    categoria: productData.categoria,
    costo: parseFloat(String(productData.costo)) || 0,
    precio: parseFloat(String(productData.precio)) || 0,
    cantidad: parseInt(String(productData.cantidad), 10) || 0,
    fechaVencimiento: new Date(productData.fechaVencimiento),
    numeroLote: productData.numeroLote,
    proveedorId: productData.proveedorId,
    proveedorNombre: productData.proveedorNombre,
    descuento: parseFloat(String(productData.descuento)) || 0,
    fechaInicioGarantia: productData.fechaInicioGarantia ? new Date(productData.fechaInicioGarantia) : undefined,
    fechaFinGarantia: productData.fechaFinGarantia ? new Date(productData.fechaFinGarantia) : undefined,
  };

  productos.push(nuevoProducto);
  console.log("Producto nuevo agregado al almacén en memoria:", nuevoProducto);
  
  await logMovement({
    productoId: nuevoProducto.id,
    productoNombre: nuevoProducto.nombre,
    numeroLote: nuevoProducto.numeroLote,
    tipo,
    cantidadMovida: nuevoProducto.cantidad,
    stockAnterior: 0,
    stockNuevo: nuevoProducto.cantidad,
    notas: tipo === TipoMovimiento.IMPORTACION_CSV ? 'Importado desde archivo CSV' : 'Creado desde formulario',
  });

  return nuevoProducto;
}

export async function updateProduct(id: string, productData: Partial<Omit<Producto, 'id'>>): Promise<Producto | null> {
  const productIndex = productos.findIndex(p => p.id === id);
  if (productIndex === -1) {
    console.log(`Producto con id: ${id} no encontrado para actualizar.`);
    return null;
  }
  
  const productoAnterior = productos[productIndex];
  const stockAnterior = productoAnterior.cantidad;

  const productoActualizado: Producto = {
      ...productoAnterior,
      nombre: productData.nombre ?? productoAnterior.nombre,
      categoria: productData.categoria ?? productoAnterior.categoria,
      costo: productData.costo !== undefined ? (parseFloat(String(productData.costo)) || 0) : productoAnterior.costo,
      precio: productData.precio !== undefined ? (parseFloat(String(productData.precio)) || 0) : productoAnterior.precio,
      cantidad: productData.cantidad !== undefined ? (parseInt(String(productData.cantidad), 10) || 0) : productoAnterior.cantidad,
      fechaVencimiento: productData.fechaVencimiento ? new Date(productData.fechaVencimiento) : productoAnterior.fechaVencimiento,
      numeroLote: productData.numeroLote ?? productoAnterior.numeroLote,
      proveedorId: productData.proveedorId === '' ? undefined : productData.proveedorId ?? productoAnterior.proveedorId,
      proveedorNombre: productData.proveedorNombre === '' ? undefined : productData.proveedorNombre ?? productoAnterior.proveedorNombre,
      descuento: productData.descuento !== undefined ? (parseFloat(String(productData.descuento)) || 0) : productoAnterior.descuento,
      fechaInicioGarantia: productData.fechaInicioGarantia ? new Date(productData.fechaInicioGarantia) : productData.fechaInicioGarantia === null ? undefined : productoAnterior.fechaInicioGarantia,
      fechaFinGarantia: productData.fechaFinGarantia ? new Date(productData.fechaFinGarantia) : productData.fechaFinGarantia === null ? undefined : productoAnterior.fechaFinGarantia,
  };
  
  const stockNuevo = productoActualizado.cantidad;

  if (stockNuevo !== stockAnterior) {
    const cantidadMovida = Math.abs(stockNuevo - stockAnterior);
    const tipo = stockNuevo > stockAnterior ? TipoMovimiento.AJUSTE_POSITIVO : TipoMovimiento.AJUSTE_NEGATIVO;
    await logMovement({
      productoId: id,
      productoNombre: productoActualizado.nombre,
      numeroLote: productoActualizado.numeroLote,
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

export async function registerProductExit(
  id: string, 
  cantidadSalida: number, 
  notas?: string,
  tipo: TipoMovimiento = TipoMovimiento.SALIDA_MANUAL
): Promise<Producto | null> {
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
    numeroLote: productoActualizado.numeroLote,
    tipo,
    cantidadMovida: cantidadSalida,
    stockAnterior,
    stockNuevo,
    notas: notas,
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
    numeroLote: productoActualizado.numeroLote,
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
  const productIndex = productos.findIndex(p => p.id === id);
  if (productIndex === -1) {
    console.log(`Producto con id: ${id} no encontrado para eliminar.`);
    return false;
  }
  productos.splice(productIndex, 1);
  console.log(`Producto con id: ${id} eliminado del almacén en memoria.`);
  return true;
}
