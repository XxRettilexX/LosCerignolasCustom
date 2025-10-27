import { CartItem } from "../context/CartContext";

export type OrderStatus = 'Nuovo' | 'In Preparazione' | 'Pronto' | 'Completato';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}
