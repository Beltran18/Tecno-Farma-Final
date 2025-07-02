import { type Producto } from '@/lib/types';
import { addDays, subDays } from 'date-fns';

export const productosSimulados: Producto[] = [
  {
    id: 'prod_001',
    nombre: 'Paracetamol 500mg',
    categoria: 'Analgésicos',
    precio: 5990,
    cantidad: 150,
    fechaVencimiento: addDays(new Date(), 365),
    numeroLote: 'A123B45',
  },
  {
    id: 'prod_002',
    nombre: 'Amoxicilina 250mg',
    categoria: 'Antibióticos',
    precio: 12500,
    cantidad: 8, // Stock bajo
    fechaVencimiento: addDays(new Date(), 180),
    numeroLote: 'C678D90',
  },
  {
    id: 'prod_003',
    nombre: 'Vitamina C 1000mg',
    categoria: 'Vitaminas',
    precio: 8750,
    cantidad: 200,
    fechaVencimiento: addDays(new Date(), 730),
    numeroLote: 'E112F34',
  },
  {
    id: 'prod_004',
    nombre: 'Ibuprofeno 400mg',
    categoria: 'Analgésicos',
    precio: 7200,
    cantidad: 80,
    fechaVencimiento: addDays(new Date(), 25), // Próximo a vencer
    numeroLote: 'G556H78',
  },
  {
    id: 'prod_005',
    nombre: 'Crema Hidratante',
    categoria: 'Dermatología',
    precio: 15000,
    cantidad: 45,
    fechaVencimiento: addDays(new Date(), 90),
    numeroLote: 'I990J12',
  },
  {
    id: 'prod_006',
    nombre: 'Ciprofloxacino 500mg',
    categoria: 'Antibióticos',
    precio: 22000,
    cantidad: 60,
    fechaVencimiento: subDays(new Date(), 10), // Vencido
    numeroLote: 'K334L56',
  },
  {
    id: 'prod_007',
    nombre: 'Complejo B',
    categoria: 'Vitaminas',
    precio: 10500,
    cantidad: 5, // Stock bajo
    fechaVencimiento: addDays(new Date(), 400),
    numeroLote: 'M778N90',
  },
];
