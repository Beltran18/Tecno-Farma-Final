import { type Producto, TipoMovimiento } from '@/lib/types';
import { logMovement } from './movement-service';
import db from '@/lib/db';

function mapToProducto(row: any): Producto {
  return {
    id: String(row.id),
    nombre: row.nombre,
    categoria: row.categoria,
    costo: parseFloat(row.costo),
    precio: parseFloat(row.precio),
    cantidad: parseInt(row.cantidad, 10),
    fechaVencimiento: new Date(row.fechaVencimiento),
    numeroLote: row.numeroLote,
    proveedorId: row.proveedorId ? String(row.proveedorId) : undefined,
    proveedorNombre: row.proveedorNombre,
    descuento: row.descuento ? parseFloat(row.descuento) : 0,
    fechaInicioGarantia: row.fechaInicioGarantia ? new Date(row.fechaInicioGarantia) : undefined,
    fechaFinGarantia: row.fechaFinGarantia ? new Date(row.fechaFinGarantia) : undefined,
  };
}

export async function getAllProducts(): Promise<Producto[]> {
  try {
    const [rows] = await db.query('SELECT * FROM productos ORDER BY nombre ASC');
    return (rows as any[]).map(mapToProducto);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error('No se pudieron obtener los productos.');
  }
}

export async function getProductById(id: string): Promise<Producto | undefined> {
  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) {
      return undefined;
    }
    return mapToProducto((rows as any)[0]);
  } catch (error) {
    console.error(`Error al obtener producto ${id}:`, error);
    throw new Error('Error al buscar el producto.');
  }
}

export async function createProduct(
  productData: Omit<Producto, 'id'>,
  tipo: TipoMovimiento.CREACION_INICIAL | TipoMovimiento.IMPORTACION_CSV = TipoMovimiento.CREACION_INICIAL
): Promise<Producto> {
  const sql = `
    INSERT INTO productos 
    (nombre, categoria, costo, precio, cantidad, fechaVencimiento, numeroLote, proveedorId, proveedorNombre, descuento, fechaInicioGarantia, fechaFinGarantia) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await db.query(sql, [
      productData.nombre,
      productData.categoria,
      productData.costo,
      productData.precio,
      productData.cantidad,
      productData.fechaVencimiento,
      productData.numeroLote,
      productData.proveedorId,
      productData.proveedorNombre,
      productData.descuento,
      productData.fechaInicioGarantia,
      productData.fechaFinGarantia,
    ]);
    
    const insertId = (result as any).insertId;
    const nuevoProducto = { id: String(insertId), ...productData };

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
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw new Error('No se pudo crear el producto.');
  }
}

export async function updateProduct(id: string, productData: Partial<Omit<Producto, 'id'>>): Promise<Producto | null> {
  const productoAnterior = await getProductById(id);
  if (!productoAnterior) {
    return null;
  }
  
  const stockAnterior = productoAnterior.cantidad;
  const stockNuevo = productData.cantidad !== undefined ? Number(productData.cantidad) : stockAnterior;

  try {
    await db.query('UPDATE productos SET ? WHERE id = ?', [productData, id]);
    
    if (stockNuevo !== stockAnterior) {
      const cantidadMovida = Math.abs(stockNuevo - stockAnterior);
      const tipo = stockNuevo > stockAnterior ? TipoMovimiento.AJUSTE_POSITIVO : TipoMovimiento.AJUSTE_NEGATIVO;
      await logMovement({
        productoId: id,
        productoNombre: productData.nombre || productoAnterior.nombre,
        numeroLote: productData.numeroLote || productoAnterior.numeroLote,
        tipo,
        cantidadMovida,
        stockAnterior,
        stockNuevo,
        notas: 'Cantidad ajustada desde el formulario de edición.',
      });
    }

    return await getProductById(id) || null;
  } catch (error) {
    console.error(`Error al actualizar producto ${id}:`, error);
    throw new Error('No se pudo actualizar el producto.');
  }
}

export async function registerProductExit(
  id: string, 
  cantidadSalida: number, 
  notas?: string,
  tipo: TipoMovimiento = TipoMovimiento.SALIDA_MANUAL
): Promise<Producto | null> {
  const productoAnterior = await getProductById(id);
  if (!productoAnterior) {
    return null;
  }
  
  const stockAnterior = productoAnterior.cantidad;
  if (cantidadSalida > stockAnterior) {
    throw new Error('Stock insuficiente.');
  }
  const stockNuevo = stockAnterior - cantidadSalida;
  
  try {
    await db.query('UPDATE productos SET cantidad = ? WHERE id = ?', [stockNuevo, id]);

    await logMovement({
      productoId: id,
      productoNombre: productoAnterior.nombre,
      numeroLote: productoAnterior.numeroLote,
      tipo,
      cantidadMovida: cantidadSalida,
      stockAnterior,
      stockNuevo,
      notas: notas,
    });

    return { ...productoAnterior, cantidad: stockNuevo };
  } catch (error) {
    console.error('Error al registrar salida de producto:', error);
    throw new Error('No se pudo registrar la salida del producto.');
  }
}

export async function registerProductEntry(id: string, cantidadEntrada: number, tipo: TipoMovimiento, notas?: string): Promise<Producto | null> {
  const productoAnterior = await getProductById(id);
  if (!productoAnterior) {
    throw new Error(`Producto con ID ${id} no encontrado para registrar entrada.`);
  }

  const stockAnterior = productoAnterior.cantidad;
  const stockNuevo = stockAnterior + cantidadEntrada;
  
  try {
    await db.query('UPDATE productos SET cantidad = ? WHERE id = ?', [stockNuevo, id]);
    
    await logMovement({
      productoId: id,
      productoNombre: productoAnterior.nombre,
      numeroLote: productoAnterior.numeroLote,
      tipo,
      cantidadMovida: cantidadEntrada,
      stockAnterior,
      stockNuevo,
      notas,
    });
    
    return { ...productoAnterior, cantidad: stockNuevo };
  } catch (error) {
    console.error('Error al registrar entrada de producto:', error);
    throw new Error('No se pudo registrar la entrada del producto.');
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw new Error('No se pudo eliminar el producto.');
  }
}
