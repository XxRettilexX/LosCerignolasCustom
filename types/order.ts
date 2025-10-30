
export type OrderStatus = 'Nuovo' | 'In Preparazione' | 'Pronto' | 'Completato' | 'Pagato';

export interface Order {
  order_id: number;
  user_id?: number | null;
  total_amount: number | string;
  status: OrderStatus;
  source?: string;
  created_at: string;
  updated_at?: string | null;
  items: Array<{
    product_id: number;
    name: string;
    quantity: number;
    price: number | string;
  }>;
}
export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
}
