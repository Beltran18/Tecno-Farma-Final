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
    fechaVencimiento: new Date(row.fechavencimiento),
    numeroLote: row.numerolote,
    proveedorId: row.proveedorid ? String(row.proveedorid) : undefined,
    proveedorNombre: row.proveedornombre,
    descuento: row.descuento ? parseFloat(row.descuento) : 0,
    fechaInicioGarantia: row.fechainiciogarantia ? new Date(row.fechainiciogarantia) : undefined,
    fechaFinGarantia: row.fechafingarantia ? new Date(row.fechafingarantia) : undefined,
  };
}

export async function getAllProducts(): Promise<Producto[]> {
  try {
    const result = await db.query('SELECT * FROM productos ORDER BY nombre ASC');
    return (result.rows as any[]).map(mapToProducto);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Producto | undefined> {
  try {
    const result = await db.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return undefined;
    }
    return mapToProducto(result.rows[0]);
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
    (nombre, categoria, costo, precio, cantidad, fechavencimiento, numerolote, proveedorid, proveedornombre, descuento, fechainiciogarantia, fechafingarantia) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id
  `;
  try {
    const insertResult = await db.query(sql, [
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
    
    const insertId = insertResult.rows[0].id;
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
    const fields = Object.keys(productData);
    if (fields.length > 0) {
      const sets = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
      await db.query(`UPDATE productos SET ${sets} WHERE id = $${fields.length + 1}`, [...fields.map(k => (productData as any)[k]), id]);
    }
    
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
    await db.query('UPDATE productos SET cantidad = $1 WHERE id = $2', [stockNuevo, id]);

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
    await db.query('UPDATE productos SET cantidad = $1 WHERE id = $2', [stockNuevo, id]);
    
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
    const result = await db.query('DELETE FROM productos WHERE id = $1', [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw new Error('No se pudo eliminar el producto.');
  }
}
