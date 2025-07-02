import { productosSimulados } from '@/lib/datos-simulados';
import { ClientePanel } from '@/components/cliente-panel';

export default function PaginaPanel() {
  const productos = productosSimulados;

  return <ClientePanel productosIniciales={productos} />;
}
