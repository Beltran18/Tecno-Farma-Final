import { productosSimulados } from '@/libreria/datos-simulados';
import { ClientePanel } from '@/componentes/cliente-panel';

export default function PaginaPanel() {
  const productos = productosSimulados;

  return <ClientePanel productosIniciales={productos} />;
}
