import { type RecetaMedica, type MedicamentoPrescrito } from '@/lib/types';
import { getAllProducts } from './product-service';

// En una aplicación real, esto estaría en una base de datos.
const globalForDb = globalThis as unknown as { recetas: RecetaMedica[] };
if (!globalForDb.recetas) {
  globalForDb.recetas = [];
}
const recetas: RecetaMedica[] = globalForDb.recetas;

export async function getAllRecetas(): Promise<RecetaMedica[]> {
  // Devolvemos una copia para evitar mutaciones.
  return JSON.parse(JSON.stringify(recetas));
}

export async function createReceta(
  data: Omit<RecetaMedica, 'id' | 'estado' | 'medicamentos'> & { medicamentos: Omit<MedicamentoPrescrito, 'productoNombre' | 'notas'>[] }
): Promise<RecetaMedica> {
  
  const allProducts = await getAllProducts();
  const productMap = new Map(allProducts.map(p => [p.id, p]));

  const medicamentosCompletos: MedicamentoPrescrito[] = data.medicamentos.map(med => {
    const producto = productMap.get(med.productoId);
    if (!producto) {
      throw new Error(`Producto con ID ${med.productoId} no encontrado.`);
    }
    return {
      ...med,
      productoNombre: producto.nombre,
    };
  });
  
  const nuevaReceta: RecetaMedica = {
    id: `rec_${Date.now()}`,
    pacienteNombre: data.pacienteNombre,
    doctorNombre: data.doctorNombre,
    fechaPrescripcion: new Date(data.fechaPrescripcion),
    medicamentos: medicamentosCompletos,
    estado: 'Pendiente',
  };

  recetas.unshift(nuevaReceta);
  return nuevaReceta;
}
