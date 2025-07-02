import { type Producto } from '@/lib/types';
import { addDays, subDays } from 'date-fns';

// --- Almacenamiento en Memoria Temporal ---
// En una aplicación real, esta variable no existiría.
// En su lugar, cada función se conectaría a una base de datos (PostgreSQL, MongoDB, etc.)
// para realizar las operaciones correspondientes.
let productos: Producto[] = [
  {
    id: 'prod_001',
    nombre: 'Paracetamol 500mg',
    categoria: 'Analgésicos',
    precio: 5990,
    cantidad: 150,
    fechaVencimiento: addDays(new Date(), 365),
    numeroLote: 'A123B45',
    proveedorId: 'prov_1',
    proveedorNombre: 'Genfar',
  },
  {
    id: 'prod_002',
    nombre: 'Amoxicilina 250mg',
    categoria: 'Antibióticos',
    precio: 12500,
    cantidad: 8, // Stock bajo
    fechaVencimiento: addDays(new Date(), 180),
    numeroLote: 'C678D90',
    proveedorId: 'prov_3',
    proveedorNombre: 'MK',
  },
  {
    id: 'prod_003',
    nombre: 'Vitamina C 1000mg',
    categoria: 'Vitaminas',
    precio: 8750,
    cantidad: 200,
    fechaVencimiento: addDays(new Date(), 730),
    numeroLote: 'E112F34',
    proveedorId: 'prov_2',
    proveedorNombre: 'Bayer',
  },
  {
    id: 'prod_004',
    nombre: 'Ibuprofeno 400mg',
    categoria: 'Analgésicos',
    precio: 7200,
    cantidad: 80,
    fechaVencimiento: addDays(new Date(), 25), // Próximo a vencer
    numeroLote: 'G556H78',
    proveedorId: 'prov_2',
    proveedorNombre: 'Bayer',
  },
  {
    id: 'prod_005',
    nombre: 'Crema Hidratante',
    categoria: 'Dermatología',
    precio: 15000,
    cantidad: 45,
    fechaVencimiento: addDays(new Date(), 90),
    numeroLote: 'I990J12',
    proveedorId: 'prov_1',
    proveedorNombre: 'Genfar',
  },
  {
    id: 'prod_006',
    nombre: 'Ciprofloxacino 500mg',
    categoria: 'Antibióticos',
    precio: 22000,
    cantidad: 60,
    fechaVencimiento: subDays(new Date(), 10), // Vencido
    numeroLote: 'K334L56',
    proveedorId: 'prov_3',
    proveedorNombre: 'MK',
  },
  {
    id: 'prod_007',
    nombre: 'Complejo B',
    categoria: 'Vitaminas',
    precio: 10500,
    cantidad: 5, // Stock bajo
    fechaVencimiento: addDays(new Date(), 400),
    numeroLote: 'M778N90',
    proveedorId: 'prov_2',
    proveedorNombre: 'Bayer',
  },
];
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
