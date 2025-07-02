export interface Producto {
  id: string;
  nombre: string;
  categoria: 'Analgésicos' | 'Antibióticos' | 'Vitaminas' | 'Dermatología' | 'Otros';
  precio: number;
  cantidad: number;
  fechaVencimiento: Date;
  numeroLote: string;
}
