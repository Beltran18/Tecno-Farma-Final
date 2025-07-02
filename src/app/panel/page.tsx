import { ClientePanel } from '@/components/cliente-panel';
import { type Producto } from '@/lib/types';
import { getAllProducts } from '@/services/product-service';

async function getProducts(): Promise<Producto[]> {
  try {
    const productos = await getAllProducts();
    return productos;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function PaginaPanel() {
  const productos = await getProducts();

  return <ClientePanel productosIniciales={productos} />;
}
