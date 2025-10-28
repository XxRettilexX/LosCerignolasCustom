// types/product.ts
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  quantity?: number; // 👈 aggiungi questa
}
