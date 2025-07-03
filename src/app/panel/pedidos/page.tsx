import { getAllPedidos } from "@/services/pedido-service";
import { getAllProducts } from "@/services/product-service";
import { getAllProveedores } from "@/services/proveedor-service";
import { ClientePedidos } from "@/components/cliente-pedidos";

export default async function PaginaPedidos() {
    const [pedidos, productos, proveedores] = await Promise.all([
        getAllPedidos(),
        getAllProducts(),
        getAllProveedores(),
    ]);
    
    return (
        <ClientePedidos
            pedidosIniciales={pedidos}
            productosInventario={productos}
            proveedoresInventario={proveedores}
        />
    );
}
