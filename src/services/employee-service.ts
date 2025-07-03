import { type Empleado, RolEmpleado } from '@/lib/types';

const globalForDb = globalThis as unknown as { empleados: Empleado[] };
if (!globalForDb.empleados) {
  globalForDb.empleados = [
    {
        id: 'emp_admin',
        nombre: 'Admin Principal',
        email: 'admin@tecnofarma.com',
        rol: RolEmpleado.ADMINISTRADOR,
    },
    {
        id: 'emp_test',
        nombre: 'Usuario de Prueba',
        email: 'usuario@ejemplo.com',
        rol: RolEmpleado.EMPLEADO,
    }
  ];
}
let empleados: Empleado[] = globalForDb.empleados;

export async function getAllEmployees(): Promise<Empleado[]> {
  return JSON.parse(JSON.stringify(empleados));
}

export async function createEmployee(employeeData: Omit<Empleado, 'id'>): Promise<Empleado> {
    if (empleados.some(e => e.email.toLowerCase() === employeeData.email.toLowerCase())) {
        throw new Error('Ya existe un empleado con este correo electrónico.');
    }
    const nuevoEmpleado: Empleado = {
        id: `emp_${Date.now()}`,
        ...employeeData,
    };
    empleados.push(nuevoEmpleado);
    return nuevoEmpleado;
}

export async function updateEmployee(id: string, employeeData: Partial<Omit<Empleado, 'id'>>): Promise<Empleado | null> {
  const index = empleados.findIndex(e => e.id === id);
  if (index === -1) {
    return null;
  }
  // No permitir cambiar el email a uno que ya existe
  if (employeeData.email && empleados.some(e => e.email.toLowerCase() === employeeData.email!.toLowerCase() && e.id !== id)) {
      throw new Error('El nuevo correo electrónico ya está en uso por otro empleado.');
  }

  const empleadoActualizado = { ...empleados[index], ...employeeData };
  empleados[index] = empleadoActualizado;
  return empleadoActualizado;
}

export async function deleteEmployee(id: string): Promise<boolean> {
    if (id === 'emp_admin') {
        throw new Error('No se puede eliminar la cuenta de administrador principal.');
    }
    const index = empleados.findIndex(p => p.id === id);
    if (index === -1) {
        return false;
    }
    empleados.splice(index, 1);
    return true;
}
