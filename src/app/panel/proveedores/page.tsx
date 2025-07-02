import { getAllProveedores } from "@/services/proveedor-service";
import { ClienteProveedores } from "@/components/cliente-proveedores";

export default async function PaginaProveedores() {
    const proveedores = await getAllProveedores();
    return <ClienteProveedores proveedoresIniciales={proveedores} />;
}
