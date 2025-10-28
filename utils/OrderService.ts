import { api } from '../api';
import { CartItem } from '../context/CartContext';
import { Order, OrderStatus } from '../types/order';

// 🔄 Stato locale simulato
let orders: Order[] = [];
let listeners: Array<(orders: Order[]) => void> = [];
let pollingInterval: NodeJS.Timeout | null = null;
let currentToken: string | undefined;

// 🔊 Notifica i listener
const broadcast = () => {
  listeners.forEach(listener => listener(orders));
};

// 🔁 Aggiorna lista ordini periodicamente
const fetchAndBroadcastOrders = async () => {
  try {
    const fetchedOrders = await api.fetchOrders(currentToken);
    orders = fetchedOrders;
    broadcast();
  } catch (error: any) {
    if (error.message.includes("403")) {
      console.warn("🚫 Accesso negato: solo lo staff può visualizzare gli ordini.");
      return;
    }
    console.error("Error fetching orders in OrderService:", error);
  }
};

// 🧩 Servizio centrale ordini
export const OrderService = {
  // ➕ Aggiungi nuovo ordine
  addOrder: async (items: CartItem[], total: number, token?: string) => {
    try {
      const newOrder = await api.createOrder({ items, total }, token);
      orders = [newOrder, ...orders];
      broadcast();
    } catch (error) {
      console.error("Error creating order in OrderService:", error);
    }
  },

  // 🔄 Aggiorna stato ordine
  updateOrderStatus: async (orderId: string, status: OrderStatus, token?: string) => {
    try {
      if (!api.updateOrderStatus) {
        console.warn("⚠️ api.updateOrderStatus non definito nel modulo API.");
        return;
      }

      const updatedOrder = await api.updateOrderStatus(orderId, status, token);
      orders = orders.map(order =>
        order.id === orderId
          ? { ...order, status: updatedOrder.new_status || status }
          : order
      );
      broadcast();
    } catch (error) {
      console.error("Error updating order status in OrderService:", error);
    }
  },

  // 📦 Ottieni lista ordini
  getOrders: () => orders,

  // 👂 Iscriviti agli aggiornamenti
  subscribe: (listener: (orders: Order[]) => void, token?: string): (() => void) => {
    listeners.push(listener);
    currentToken = token;

    if (!pollingInterval) {
      fetchAndBroadcastOrders(); // primo fetch immediato
      pollingInterval = setInterval(fetchAndBroadcastOrders, 10000); // ogni 10 sec
    }

    // ➖ Disiscrizione
    return () => {
      listeners = listeners.filter(l => l !== listener);
      if (listeners.length === 0 && pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        currentToken = undefined;
      }
    };
  },
};
