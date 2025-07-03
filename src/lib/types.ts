export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
  fechaVencimiento: Date;
  numeroLote: string;
  proveedorId?: string;
  proveedorNombre?: string;
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
}

export enum TipoMovimiento {
  CREACION_INICIAL = 'Creación Inicial',
  SALIDA_MANUAL = 'Salida Manual',
  AJUSTE_POSITIVO = 'Ajuste Positivo',
  AJUSTE_NEGATIVO = 'Ajuste Negativo',
  IMPORTACION_CSV = 'Importación CSV',
  DISPENSADO_RECETA = 'Dispensado por Receta',
  ENTRADA_PEDIDO = 'Entrada por Pedido',
  DEVOLUCION_PROVEEDOR = 'Devolución a Proveedor',
}

export interface MovimientoInventario {
  id: string;
  productoId: string;
  productoNombre: string;
  fecha: Date;
  tipo: TipoMovimiento;
  cantidadMovida: number;
  stockAnterior: number;
  stockNuevo: number;
  notas?: string;
}

export interface MedicamentoPrescrito {
  productoId: string;
  productoNombre: string;
  cantidadPrescrita: number;
  notas?: string;
}

export interface RecetaMedica {
  id: string;
  pacienteNombre: string;
  doctorNombre: string;
  fechaPrescripcion: Date;
  medicamentos: MedicamentoPrescrito[];
  estado: 'Pendiente' | 'Dispensada' | 'Cancelada';
}

export enum EstadoPedido {
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado',
  CANCELADO = 'Cancelado',
}

export interface PedidoReposicion {
  id: string;
  fechaPedido: Date;
  proveedorId: string;
  proveedorNombre: string;
  productos: {
    productoId: string;
    productoNombre: string;
    cantidadPedida: number;
  }[];
  estado: EstadoPedido;
}

export interface DevolucionProveedor {
  id: string;
  fecha: Date;
  productoId: string;
  productoNombre: string;
  proveedorId: string;
  proveedorNombre: string;
  cantidadDevuelta: number;
  motivo: string;
}
