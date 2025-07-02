import { getProductById } from "@/services/product-service";
import { ComponenteEtiqueta } from "@/components/componente-etiqueta";
import { notFound } from "next/navigation";

export default async function PaginaImprimirEtiqueta({ params }: { params: { id: string } }) {
    const producto = await getProductById(params.id);

    if (!producto) {
        notFound();
    }
    
    // The main panel layout will be applied, but hidden on print via CSS.
    return <ComponenteEtiqueta producto={producto} />;
}
