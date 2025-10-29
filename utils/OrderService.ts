import { api } from '../api';
import { CartItem } from '../context/CartContext';
import { Order, OrderStatus } from '../types/order';

// Stato locale simulato
let orders: Order[] = [];
let listeners: Array<(orders: Order[]) => void> = [];
let pollingInterval: NodeJS.Timeout | null = null;
let currentToken: string | undefined;

const broadcast = () => listeners.forEach(listener => listener(orders));

// 🔁 Fetch e broadcast
const fetchAndBroadcastOrders = async () => {
  try {
    const fetchedOrders = await api.fetchOrders(currentToken);

    // 🔹 Normalizza i dati
    orders = fetchedOrders.map(o => ({
      ...o,
      total_amount: parseFloat(o.total_amount),
      items: o.items.map((i: any) => ({
        ...i,
        price: parseFloat(i.price)
      }))
    }));

    broadcast();
  } catch (error: any) {
    if (error.message.includes("403")) {
      console.warn("🚫 Accesso negato: solo lo staff può visualizzare gli ordini.");
      return;
    }
    console.error("Error fetching orders in OrderService:", error);
  }
};

// 🧩 Servizio Ordini
export const OrderService = {
  addOrder: async (items: CartItem[], total: number, token?: string) => {
    try {
      const newOrder = await api.createOrder({ items, total }, token);
      orders = [newOrder, ...orders];
      broadcast();
    } catch (error) {
      console.error("Error creating order in OrderService:", error);
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus, token?: string) => {
    try {
      const updatedOrder = await api.updateOrderStatus(orderId, status, token);

      // 🔹 aggiorna SOLO quell’ordine localmente
      orders = orders.map(order =>
        String(order.order_id) === String(orderId)
          ? { ...order, status }
          : order
      );

      broadcast(); // notifica i listener (KitchenDashboard)
      return updatedOrder;
    } catch (error) {
      console.error("Error updating order status in OrderService:", error);
    }
  },

  getOrders: () => orders,

  subscribe: (listener: (orders: Order[]) => void, token?: string): (() => void) => {
    listeners.push(listener);
    currentToken = token;

    if (!pollingInterval) {
      fetchAndBroadcastOrders();
      pollingInterval = setInterval(fetchAndBroadcastOrders, 1000); // ogni 10s
    }

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
