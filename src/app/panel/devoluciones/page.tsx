import { getAllDevoluciones } from "@/services/devolucion-service";
import { getAllProducts } from "@/services/product-service";
import { ClienteDevoluciones } from "@/components/cliente-devoluciones";

export default async function PaginaDevoluciones() {
    const [devoluciones, productos] = await Promise.all([
        getAllDevoluciones(),
        getAllProducts(),
    ]);
    
    return (
        <ClienteDevoluciones
            devolucionesIniciales={devoluciones}
            productosInventario={productos}
        />
    );
}
