import { getAllMovements } from "@/services/movement-service";
import { ClienteTrazabilidad } from "@/components/cliente-trazabilidad";

export default async function PaginaTrazabilidad() {
    const movimientos = await getAllMovements();
    
    return <ClienteTrazabilidad movimientosIniciales={movimientos} />;
}
