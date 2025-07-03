import { ClientePanel } from '@/components/cliente-panel';
import { type Producto, type MovimientoInventario } from '@/lib/types';
import { getAllProducts } from '@/services/product-service';
import { getAllMovements } from '@/services/movement-service';

async function getProducts(): Promise<Producto[]> {
  try {
    const productos = await getAllProducts();
    return productos;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

async function getMovements(): Promise<MovimientoInventario[]> {
  try {
    const movimientos = await getAllMovements();
    return movimientos;
  } catch (error) {
    console.error('Failed to fetch movements:', error);
    return [];
  }
}

export default async function PaginaPanel() {
  const [productos, movimientos] = await Promise.all([
      getProducts(),
      getMovements()
  ]);

  return <ClientePanel productosIniciales={productos} movimientosIniciales={movimientos} />;
}
