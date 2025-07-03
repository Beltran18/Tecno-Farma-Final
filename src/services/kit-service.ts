import { type Kit, type ProductoComponente, TipoMovimiento } from '@/lib/types';
import { getAllProducts, getProductById, registerProductExit } from './product-service';

const globalForDb = globalThis as unknown as { kits: Kit[] };
if (!globalForDb.kits) {
  globalForDb.kits = [];
}
let kits: Kit[] = globalForDb.kits;

export async function getAllKits(): Promise<Kit[]> {
  return JSON.parse(JSON.stringify(kits));
}

export async function createKit(data: Omit<Kit, 'id' | 'componentes'> & { componentes: Omit<ProductoComponente, 'productoNombre'>[] }): Promise<Kit> {
  const allProducts = await getAllProducts();
  const productMap = new Map(allProducts.map(p => [p.id, p]));

  const componentesCompletos: ProductoComponente[] = data.componentes.map(comp => {
    const producto = productMap.get(comp.productoId);
    if (!producto) {
      throw new Error(`El producto componente con ID ${comp.productoId} no fue encontrado.`);
    }
    return { ...comp, productoNombre: producto.nombre };
  });

  const nuevoKit: Kit = {
    id: `kit_${Date.now()}`,
    nombre: data.nombre,
    precio: data.precio,
    componentes: componentesCompletos,
  };

  kits.unshift(nuevoKit);
  return nuevoKit;
}

export async function deleteKit(id: string): Promise<boolean> {
  const index = kits.findIndex(k => k.id === id);
  if (index === -1) {
    return false;
  }
  kits.splice(index, 1);
  return true;
}

export async function sellKit(kitId: string, cantidadVendida: number): Promise<void> {
  const kit = kits.find(k => k.id === kitId);
  if (!kit) {
    throw new Error('Kit no encontrado.');
  }

  // 1. Verificar stock de todos los componentes ANTES de descontar
  for (const componente of kit.componentes) {
    const producto = await getProductById(componente.productoId);
    const cantidadRequerida = componente.cantidad * cantidadVendida;
    if (!producto || producto.cantidad < cantidadRequerida) {
      throw new Error(`Stock insuficiente para "${componente.productoNombre}". Se necesitan ${cantidadRequerida} y hay ${producto?.cantidad || 0}.`);
    }
  }

  // 2. Si hay stock para todo, proceder a descontar
  for (const componente of kit.componentes) {
    await registerProductExit(
      componente.productoId,
      componente.cantidad * cantidadVendida,
      `Venta del kit "${kit.nombre}"`,
      TipoMovimiento.VENTA_KIT
    );
  }
}