import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Order, OrderStatus } from '../types/order';
import { CartItem } from './CartContext';
import { OrderService } from '../utils/OrderService';

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], total: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Initialize orders from the service
    setOrders(OrderService.getOrders());

    // Subscribe to order changes
    const unsubscribe = OrderService.subscribe(updatedOrders => {
      setOrders(updatedOrders);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addOrder = (items: CartItem[], total: number) => {
    OrderService.addOrder(items, total);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    OrderService.updateOrderStatus(orderId, status);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};