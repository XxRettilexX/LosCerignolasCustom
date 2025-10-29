import { CartItem } from '../context/CartContext';
import { Order } from '../types/order';
import { Product } from '../types/product';
import { User } from '../types/user';

const API_BASE_URL = 'http://192.168.7.230/api/'; // ✅

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
  fetchOrders: async (token?: string): Promise<any[]> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}orders.php`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    try {
      return await response.json();
    } catch {
      throw new Error("Invalid JSON response");
    }
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
    const response = await fetch(`${API_BASE_URL}orders.php`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        orderId: Number(orderId), // ✅ assicurati che arrivi come numero
        status: status,           // ✅ esattamente come "Nuovo", "In Preparazione", ecc.
      }),
    });

    if (!response.ok) {
      const text = await response.text(); // utile per debug
      console.error("❌ Errore risposta:", text);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },


};
