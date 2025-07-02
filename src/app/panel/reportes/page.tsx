import { getAllProducts } from "@/services/product-service";
import { ClienteReportes } from "@/components/cliente-reportes";

export default async function PaginaReportes() {
    const productos = await getAllProducts();
    
    return <ClienteReportes productos={productos} />;
}
