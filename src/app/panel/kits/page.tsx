import { getAllKits } from "@/services/kit-service";
import { getAllProducts } from "@/services/product-service";
import { ClienteKits } from "@/components/cliente-kits";

export default async function PaginaKits() {
    const [kits, productos] = await Promise.all([
        getAllKits(),
        getAllProducts(),
    ]);
    
    return (
        <ClienteKits
            kitsIniciales={kits}
            productosInventario={productos}
        />
    );
}
