import { type RecetaMedica, type MedicamentoPrescrito, TipoMovimiento } from '@/lib/types';
import { getAllProducts, getProductById, registerProductExit } from './product-service';

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


export async function dispenseReceta(recetaId: string): Promise<RecetaMedica> {
  const recetaIndex = recetas.findIndex(r => r.id === recetaId);
  if (recetaIndex === -1) {
    throw new Error('Receta no encontrada.');
  }

  const receta = recetas[recetaIndex];

  if (receta.estado !== 'Pendiente') {
    throw new Error(`No se puede dispensar una receta que está en estado "${receta.estado}".`);
  }

  // 1. Verificar stock ANTES de dispensar nada
  for (const med of receta.medicamentos) {
    const producto = await getProductById(med.productoId);
    if (!producto || producto.cantidad < med.cantidadPrescrita) {
      throw new Error(`Stock insuficiente para "${med.productoNombre}". Se necesitan ${med.cantidadPrescrita} y hay ${producto?.cantidad || 0}.`);
    }
  }

  // 2. Si hay stock para todo, proceder a descontar
  for (const med of receta.medicamentos) {
    await registerProductExit(
      med.productoId,
      med.cantidadPrescrita,
      `Dispensado por receta #${receta.id} para ${receta.pacienteNombre}`,
      TipoMovimiento.DISPENSADO_RECETA
    );
  }

  // 3. Actualizar el estado de la receta
  const recetaActualizada: RecetaMedica = {
    ...receta,
    estado: 'Dispensada',
  };

  recetas[recetaIndex] = recetaActualizada;
  return recetaActualizada;
}
