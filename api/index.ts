import { CartItem } from '../context/CartContext';
import { Order } from '../types/order';
import { Product } from '../types/product';
import { User } from '../types/user';

const API_BASE_URL = 'http://172.20.10.5/los-cerignola-api/api'; // ✅ percorso coerente

export const api = {
  // 🛒 Prodotti
  fetchProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // 🔐 Login
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // 📦 Ottieni tutti gli ordini
  fetchOrders: async (token?: string): Promise<Order[]> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/orders`, { method: 'GET', headers });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // 🧾 Crea nuovo ordine
  createOrder: async (order: { items: CartItem[]; total: number }, token?: string): Promise<Order> => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(order),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // 🔄 Aggiorna stato ordine
  updateOrderStatus: async (orderId: string, status: string, token?: string): Promise<any> => {
    const url = `${API_BASE_URL}/orders/${orderId}?status=${encodeURIComponent(status)}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // 💳 Simula pagamento → elimina ordine
  async payOrder(orderId: number, total: number, userId?: number, token?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}orders?action=pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      // 💰 Aggiungi punti (1€ = 1 punto)
      if (userId && total > 0) {
        const points = Math.floor(total);
        await fetch(`${API_BASE_URL}loyalty`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, action: 'add', points }),
        });
      }

      return result;
    } catch (error) {
      console.error('Errore payOrder:', error);
      throw error;
    }
  },




  // Ottiene i punti attuali dell’utente
  fetchLoyaltyPoints: async (userId: number): Promise<{ loyalty_points: number }> => {
    const response = await fetch(`${API_BASE_URL}loyalty?user_id=${userId}`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  },

  // Aggiunge o riscatta punti
  updateLoyaltyPoints: async (
    action: 'add' | 'redeem',
    points: number,
    userId: number
  ): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}loyalty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, action, points }),
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  },

};
