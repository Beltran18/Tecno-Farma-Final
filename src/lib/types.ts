export interface Product {
  id: string;
  name: string;
  category: 'Analgésicos' | 'Antibióticos' | 'Vitaminas' | 'Dermatología' | 'Otros';
  price: number;
  quantity: number;
  expirationDate: Date;
  lotNumber: string;
}
