import { CartItem } from '../context/CartContext';
import { Order } from '../types/order';
import { Product } from '../types/product';
import { User } from '../types/user';

const API_BASE_URL = 'http://192.168.1.26/api/'; // ✅

export const api = {
  fetchProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}products.php`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // 🔹 Login
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    console.log('📤 Tentativo login:', { email, password });

    const response = await fetch(`${API_BASE_URL}login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    console.log('📥 Status risposta login:', response.status);

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.log('❌ Errore login:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      } catch {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('✅ Login riuscito:', data);
    return { user: data.user, token: data.token };
  },

  // 🔹 Ordini
  fetchOrders: async (token?: string): Promise<Order[]> => {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}orders.php`, { headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  createOrder: async (order: { items: CartItem[]; total: number }, token?: string): Promise<Order> => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}orders.php`, {
      method: 'POST',
      headers,
      body: JSON.stringify(order),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
  updateOrderStatus: async (orderId: string, status: string, token?: string): Promise<any> => {
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}orders.php?id=${orderId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

};
