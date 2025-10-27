import { Product } from '../types/product';
import { User } from '../types/user';

const API_BASE_URL = 'http://192.168.1.52/'; // Use the IP address of your XAMPP server

export const api = {
  fetchProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products: Product[] = await response.json();
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  // You can add more API functions here (e.g., register, fetchUserDetails, etc.)
};
