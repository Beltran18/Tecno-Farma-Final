import { getAllEmployees } from "@/services/employee-service";
import { ClienteEmpleados } from "@/components/cliente-empleados";

export default async function PaginaEmpleados() {
    const empleados = await getAllEmployees();

    return <ClienteEmpleados empleadosIniciales={empleados} />;
}
