import { type Empleado, RolEmpleado } from '@/lib/types';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';

function mapToEmpleado(row: any, includePassword = false): Empleado {
    const empleado: Empleado = {
        id: String(row.id),
        nombre: row.nombre,
        email: row.email,
        rol: row.rol,
    };
    if (includePassword && row.password) {
        empleado.password = row.password;
    }
    return empleado;
}

export async function getAllEmployees(): Promise<Omit<Empleado, 'password'>[]> {
    try {
        const [rows] = await db.query('SELECT id, nombre, email, rol FROM empleados ORDER BY nombre ASC');
        return (rows as any[]).map(row => mapToEmpleado(row));
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        throw new Error('No se pudieron obtener los empleados.');
    }
}

export async function getEmployeeByEmail(email: string): Promise<Empleado | null> {
    try {
        const [rows] = await db.query('SELECT * FROM empleados WHERE email = ?', [email]);
        const empleados = rows as any[];
        if (empleados.length === 0) {
            return null;
        }
        return mapToEmpleado(empleados[0], true);
    } catch (error) {
        console.error('Error al obtener empleado por email:', error);
        throw new Error('Error al consultar la base de datos.');
    }
}

export async function createEmployee(employeeData: Omit<Empleado, 'id'>): Promise<Omit<Empleado, 'password'>> {
    if (!employeeData.password) {
        throw new Error('La contraseña es requerida');
    }

    try {
        const hashedPassword = await bcrypt.hash(employeeData.password, 10);
        const sql = 'INSERT INTO empleados (nombre, email, rol, password) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [employeeData.nombre, employeeData.email, employeeData.rol, hashedPassword]);
        const insertId = (result as any).insertId;

        const [newRow] = await db.query('SELECT id, nombre, email, rol FROM empleados WHERE id = ?', [insertId]);
        return mapToEmpleado((newRow as any)[0]);

    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Ya existe un empleado con este correo electrónico.');
        }
        console.error('Error al crear empleado:', error);
        throw new Error('No se pudo crear el empleado.');
    }
}

export async function updateEmployee(id: string, employeeData: Partial<Omit<Empleado, 'id' | 'password'>>): Promise<Omit<Empleado, 'password'> | null> {
    try {
        const [rows] = await db.query('SELECT * FROM empleados WHERE id = ?', [id]);
        if ((rows as any[]).length === 0) {
            return null;
        }
        
        await db.query('UPDATE empleados SET ? WHERE id = ?', [employeeData, id]);
        
        const [updatedRows] = await db.query('SELECT id, nombre, email, rol FROM empleados WHERE id = ?', [id]);
        return mapToEmpleado((updatedRows as any)[0]);
        
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
             throw new Error('El nuevo correo electrónico ya está en uso por otro empleado.');
        }
        console.error('Error al actualizar empleado:', error);
        throw new Error('No se pudo actualizar el empleado.');
    }
}

export async function updateEmployeePassword(email: string, newPassword: string): Promise<boolean> {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await db.query('UPDATE empleados SET password = ? WHERE email = ?', [hashedPassword, email]);
        return (result as any).affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar la contraseña del empleado:', error);
        throw new Error('No se pudo actualizar la contraseña.');
    }
}

export async function deleteEmployee(id: string): Promise<boolean> {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 2) { // Proteger a los usuarios iniciales
        throw new Error('No se puede eliminar la cuenta de administrador principal o de prueba.');
    }
    try {
        const [result] = await db.query('DELETE FROM empleados WHERE id = ?', [id]);
        return (result as any).affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        throw new Error('No se pudo eliminar el empleado.');
    }
}
