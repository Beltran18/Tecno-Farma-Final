import { type Producto } from '@/lib/types';
import { addDays, subDays } from 'date-fns';

// --- Almacenamiento en Memoria Temporal ---
// En una aplicación real, esta variable no existiría.
// En su lugar, cada función se conectaría a una base de datos (PostgreSQL, MongoDB, etc.)
// para realizar las operaciones correspondientes.
let productos: Producto[] = [];
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

export async function createProduct(productData: Omit<Producto, 'id'>): Promise<Producto> {
  // TODO: Reemplazar con la lógica para crear un producto en la base de datos.
  // Ejemplo: return await db.product.create({ data: productData });
  const nuevoProducto: Producto = {
    ...productData,
    id: `prod_${Date.now()}`,
    fechaVencimiento: new Date(productData.fechaVencimiento),
  };
  productos.push(nuevoProducto);
  console.log("Producto nuevo agregado al almacén en memoria:", nuevoProducto);
  return nuevoProducto;
}

export async function updateProduct(id: string, productData: Partial<Omit<Producto, 'id'>>): Promise<Producto | null> {
    // TODO: Reemplazar con la lógica para actualizar un producto en la base de datos.
    // Ejemplo: return await db.product.update({ where: { id }, data: productData });
  const productIndex = productos.findIndex(p => p.id === id);
  if (productIndex === -1) {
    console.log(`Producto con id: ${id} no encontrado para actualizar.`);
    return null;
  }
  
  const productoActualizado: Producto = {
    ...productos[productIndex],
    ...productData,
    fechaVencimiento: new Date(productData.fechaVencimiento || productos[productIndex].fechaVencimiento),
  };

  productos[productIndex] = productoActualizado;
  console.log("Producto actualizado en el almacén en memoria:", productoActualizado);
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
