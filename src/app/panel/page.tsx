import { productosSimulados } from '@/libreria/datos-simulados';
import { ClientePanel } from '@/componentes/cliente-panel';

export default function PaginaPanel() {
  // En una aplicación real, estos datos se obtendrían de tu API
  const productos = productosSimulados;

  return <ClientePanel productosIniciales={productos} />;
}
