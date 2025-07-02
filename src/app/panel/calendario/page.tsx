import { getAllProducts } from "@/services/product-service";
import { ClienteCalendario } from "@/components/cliente-calendario";

export default async function PaginaCalendario() {
    const productos = await getAllProducts();
    return <ClienteCalendario productos={productos} />;
}
