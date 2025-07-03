import { ClienteAnalisis } from '@/components/cliente-analisis';
import { getAllProducts } from '@/services/product-service';
import { getAllMovements } from '@/services/movement-service';

export default async function PaginaAnalisis() {
    const [productos, movimientos] = await Promise.all([
        getAllProducts(),
        getAllMovements()
    ]);
    
    return <ClienteAnalisis productos={productos} movimientos={movimientos} />;
}
