import { ClientePanel } from '@/components/cliente-panel';
import { type Producto } from '@/lib/types';

async function getProducts(): Promise<Producto[]> {
  // En una aplicación real, esta URL debería estar en una variable de entorno
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productos`, { cache: 'no-store' });
  if (!res.ok) {
    console.error('Failed to fetch products');
    return [];
  }
  const productos = await res.json();
  
  // Las fechas de la API vienen como strings, hay que convertirlas a objetos Date
  return productos.map((p: any) => ({
    ...p,
    fechaVencimiento: new Date(p.fechaVencimiento)
  }));
}

export default async function PaginaPanel() {
  const productos = await getProducts();

  return <ClientePanel productosIniciales={productos} />;
}
