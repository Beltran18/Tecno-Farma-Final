export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
  fechaVencimiento: Date;
  numeroLote: string;
}

export interface Categoria {
  id: string;
  nombre: string;
}
