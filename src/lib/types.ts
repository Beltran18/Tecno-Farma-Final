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
