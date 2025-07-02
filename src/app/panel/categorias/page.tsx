import { getAllCategories } from "@/services/category-service";
import { ClienteCategorias } from "@/components/cliente-categorias";

export default async function PaginaCategorias() {
    const categorias = await getAllCategories();

    return <ClienteCategorias categoriasIniciales={categorias} />;
}
