import { type Proveedor } from '@/lib/types';

// En una aplicación real, esto estaría en una base de datos.
let proveedores: Proveedor[] = [
    { id: 'prov_1', nombre: 'Genfar', contacto: 'Ana García', telefono: '3001234567' },
    { id: 'prov_2', nombre: 'Bayer', contacto: 'Carlos Rivas', telefono: '3109876543' },
    { id: 'prov_3', nombre: 'MK', contacto: 'Luisa Fernanda', telefono: '3215558899' },
];

export async function getAllProveedores(): Promise<Proveedor[]> {
  return JSON.parse(JSON.stringify(proveedores));
}

export async function createProveedor(proveedorData: Omit<Proveedor, 'id'>): Promise<Proveedor> {
    if (proveedores.some(p => p.nombre.toLowerCase() === proveedorData.nombre.toLowerCase())) {
        throw new Error('El proveedor ya existe.');
    }
    const nuevoProveedor: Proveedor = {
        id: `prov_${Date.now()}`,
        ...proveedorData,
    };
    proveedores.push(nuevoProveedor);
    return nuevoProveedor;
}

export async function updateProveedor(id: string, proveedorData: Partial<Omit<Proveedor, 'id'>>): Promise<Proveedor | null> {
  const index = proveedores.findIndex(p => p.id === id);
  if (index === -1) {
    return null;
  }
  const proveedorActualizado = { ...proveedores[index], ...proveedorData };
  proveedores[index] = proveedorActualizado;
  return proveedorActualizado;
}

export async function deleteProveedor(id: string): Promise<boolean> {
    const index = proveedores.findIndex(p => p.id === id);
    if (index === -1) {
        return false;
    }
    proveedores.splice(index, 1);
    return true;
}
