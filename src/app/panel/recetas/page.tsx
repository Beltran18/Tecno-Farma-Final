import { getAllRecetas } from "@/services/receta-service";
import { getAllProducts } from "@/services/product-service";
import { ClienteRecetas } from "@/components/cliente-recetas";

export default async function PaginaRecetas() {
    const [recetas, productos] = await Promise.all([
        getAllRecetas(),
        getAllProducts()
    ]);
    
    return <ClienteRecetas recetasIniciales={recetas} productosInventario={productos} />;
}
