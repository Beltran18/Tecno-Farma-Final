import { getAllProducts } from "@/services/product-service";
import { ClienteCalendario } from "@/components/cliente-calendario";
import { getAllPedidos } from "@/services/pedido-service";

export default async function PaginaCalendario() {
    const [productos, pedidos] = await Promise.all([
        getAllProducts(),
        getAllPedidos()
    ]);
    return <ClienteCalendario productos={productos} pedidos={pedidos} />;
}
