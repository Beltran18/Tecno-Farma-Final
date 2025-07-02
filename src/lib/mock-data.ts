import { type Product } from './types';
import { addDays, subDays } from 'date-fns';

export const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Paracetamol 500mg',
    category: 'Analgésicos',
    price: 5.99,
    quantity: 150,
    expirationDate: addDays(new Date(), 365),
    lotNumber: 'A123B45',
  },
  {
    id: 'prod_002',
    name: 'Amoxicilina 250mg',
    category: 'Antibióticos',
    price: 12.5,
    quantity: 8, // Low stock
    expirationDate: addDays(new Date(), 180),
    lotNumber: 'C678D90',
  },
  {
    id: 'prod_003',
    name: 'Vitamina C 1000mg',
    category: 'Vitaminas',
    price: 8.75,
    quantity: 200,
    expirationDate: addDays(new Date(), 730),
    lotNumber: 'E112F34',
  },
  {
    id: 'prod_004',
    name: 'Ibuprofeno 400mg',
    category: 'Analgésicos',
    price: 7.2,
    quantity: 80,
    expirationDate: addDays(new Date(), 25), // Nearing expiration
    lotNumber: 'G556H78',
  },
  {
    id: 'prod_005',
    name: 'Crema Hidratante',
    category: 'Dermatología',
    price: 15.0,
    quantity: 45,
    expirationDate: addDays(new Date(), 90),
    lotNumber: 'I990J12',
  },
  {
    id: 'prod_006',
    name: 'Ciprofloxacino 500mg',
    category: 'Antibióticos',
    price: 22.0,
    quantity: 60,
    expirationDate: subDays(new Date(), 10), // Expired
    lotNumber: 'K334L56',
  },
  {
    id: 'prod_007',
    name: 'Complejo B',
    category: 'Vitaminas',
    price: 10.5,
    quantity: 5, // Low stock
    expirationDate: addDays(new Date(), 400),
    lotNumber: 'M778N90',
  },
];
