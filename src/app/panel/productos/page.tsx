import { ClienteProductos } from "@/components/cliente-productos";
import { getAllProducts } from "@/services/product-service";
import { getAllCategories } from "@/services/category-service";
import { getAllProveedores } from "@/services/proveedor-service";

export default async function PaginaProductos() {
    const [productos, categorias, proveedores] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getAllProveedores()
    ]);

    return <ClienteProductos 
        productosIniciales={productos} 
        categoriasIniciales={categorias}
        proveedoresIniciales={proveedores}
    />;
}
