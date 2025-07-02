import { productosSimulados } from '@/lib/datos-simulados';
import { type Producto } from '@/lib/types';

export async function getAllProducts(): Promise<Producto[]> {
  // En una aplicación real, aquí se haría la llamada a la base de datos.
  return [...productosSimulados];
}

export async function getProductById(id: string): Promise<Producto | undefined> {
  return productosSimulados.find(p => p.id === id);
}

export async function createProduct(productData: Omit<Producto, 'id'>): Promise<Producto> {
  const nuevoProducto: Producto = {
    ...productData,
    id: `prod_${Date.now()}`,
    fechaVencimiento: new Date(productData.fechaVencimiento),
  };
  productosSimulados.push(nuevoProducto);
  return nuevoProducto;
}

export async function updateProduct(id: string, productData: Partial<Omit<Producto, 'id'>>): Promise<Producto | null> {
  const productIndex = productosSimulados.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return null;
  }
  
  const productoActualizado: Producto = {
    ...productosSimulados[productIndex],
    ...productData,
    fechaVencimiento: new Date(productData.fechaVencimiento || productosSimulados[productIndex].fechaVencimiento),
  };

  productosSimulados[productIndex] = productoActualizado;
  return productoActualizado;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const productIndex = productosSimulados.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return false;
  }
  productosSimulados.splice(productIndex, 1);
  return true;
}
