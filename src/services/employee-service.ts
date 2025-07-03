import { type Empleado, RolEmpleado } from '@/lib/types';
import bcrypt from 'bcryptjs';

const globalForDb = globalThis as unknown as { empleados: Empleado[] };
if (!globalForDb.empleados) {
  globalForDb.empleados = [
    {
        id: 'emp_admin',
        nombre: 'Admin Principal',
        email: 'admin@tecnofarma.com',
        rol: RolEmpleado.ADMINISTRADOR,
        password: bcrypt.hashSync('admin123', 10),
    },
    {
        id: 'emp_test',
        nombre: 'Usuario de Prueba',
        email: 'usuario@ejemplo.com',
        rol: RolEmpleado.EMPLEADO,
        password: bcrypt.hashSync('empleado123', 10),
    }
  ];
}
let empleados: Empleado[] = globalForDb.empleados;

export async function getAllEmployees(): Promise<Omit<Empleado, 'password'>[]> {
  return JSON.parse(JSON.stringify(empleados)).map((emp: Empleado) => {
    const { password, ...rest } = emp;
    return rest;
  });
}

export async function getEmployeeByEmail(email: string): Promise<Empleado | null> {
    const empleado = empleados.find(e => e.email.toLowerCase() === email.toLowerCase());
    return empleado ? { ...empleado } : null;
}

export async function createEmployee(employeeData: Omit<Empleado, 'id'>): Promise<Omit<Empleado, 'password'>> {
    if (!employeeData.password) {
        throw new Error('La contraseña es requerida');
    }
    if (empleados.some(e => e.email.toLowerCase() === employeeData.email.toLowerCase())) {
        throw new Error('Ya existe un empleado con este correo electrónico.');
    }

    const hashedPassword = await bcrypt.hash(employeeData.password, 10);

    const nuevoEmpleado: Empleado = {
        id: `emp_${Date.now()}`,
        nombre: employeeData.nombre,
        email: employeeData.email,
        rol: employeeData.rol,
        password: hashedPassword,
    };
    empleados.push(nuevoEmpleado);
    
    const { password, ...rest } = nuevoEmpleado;
    return rest;
}

export async function updateEmployee(id: string, employeeData: Partial<Omit<Empleado, 'id' | 'password'>>): Promise<Omit<Empleado, 'password'> | null> {
  const index = empleados.findIndex(e => e.id === id);
  if (index === -1) {
    return null;
  }
  
  if (employeeData.email && empleados.some(e => e.email.toLowerCase() === employeeData.email!.toLowerCase() && e.id !== id)) {
      throw new Error('El nuevo correo electrónico ya está en uso por otro empleado.');
  }

  const empleadoActualizado = { ...empleados[index], ...employeeData };
  empleados[index] = empleadoActualizado;
  
  const { password, ...rest } = empleadoActualizado;
  return rest;
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
