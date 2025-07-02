import { type Categoria } from '@/lib/types';

// En una aplicación real, esto estaría en una base de datos.
let categorias: Categoria[] = [
    { id: 'cat_1', nombre: 'Analgésicos' },
    { id: 'cat_2', nombre: 'Antibióticos' },
    { id: 'cat_3', nombre: 'Vitaminas' },
    { id: 'cat_4', nombre: 'Dermatología' },
    { id: 'cat_5', nombre: 'Otros' },
];

export async function getAllCategories(): Promise<Categoria[]> {
  // TODO: Reemplazar con lógica de base de datos
  return JSON.parse(JSON.stringify(categorias));
}

export async function createCategory(nombre: string): Promise<Categoria> {
    // TODO: Reemplazar con lógica de base de datos
    if (categorias.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
        throw new Error('La categoría ya existe.');
    }
    const nuevaCategoria: Categoria = {
        id: `cat_${Date.now()}`,
        nombre,
    };
    categorias.push(nuevaCategoria);
    return nuevaCategoria;
}

export async function deleteCategory(id: string): Promise<boolean> {
    // TODO: Reemplazar con lógica de base de datos
    const index = categorias.findIndex(c => c.id === id);
    if (index === -1) {
        return false;
    }
    categorias.splice(index, 1);
    return true;
}
