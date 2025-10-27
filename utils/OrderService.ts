import { Order, OrderStatus } from '../types/order';
import { CartItem } from '../context/CartContext';

// This is a simple in-memory pub/sub service to simulate a real-time backend.

let orders: Order[] = [];
let listeners: Array<(orders: Order[]) => void> = [];

const broadcast = () => {
  listeners.forEach(listener => {
    listener(orders);
  });
};

export const OrderService = {
  addOrder: (items: CartItem[], total: number) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items,
      total,
      status: 'Nuovo',
      createdAt: new Date(),
    };
    orders = [newOrder, ...orders];
    broadcast();
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    orders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    broadcast();
  },

  getOrders: () => {
    return orders;
  },

  subscribe: (listener: (orders: Order[]) => void): (() => void) => {
    listeners.push(listener);
    // Return an unsubscribe function
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
