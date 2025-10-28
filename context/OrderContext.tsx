import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Order, OrderStatus } from '../types/order';
import { OrderService } from '../utils/OrderService';
import { useAuth } from './AuthContext';
import { CartItem } from './CartContext';

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], total: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    // Inizializza gli ordini
    setOrders(OrderService.getOrders());

    // Si sottoscrive agli aggiornamenti
    const unsubscribe = OrderService.subscribe(updatedOrders => {
      setOrders(updatedOrders);
    }, token ?? undefined);

    return () => unsubscribe();
  }, [token]);

  const addOrder = (items: CartItem[], total: number) => {
    OrderService.addOrder(items, total, token ?? undefined);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    OrderService.updateOrderStatus(orderId, status, token ?? undefined);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders deve essere usato dentro un OrderProvider');
  return context;
};
