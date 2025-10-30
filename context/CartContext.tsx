import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../api'; // 👈 importa il tuo endpoint base
import { useAuth } from './AuthContext'; // 👈 serve per sapere chi è loggato

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  discountedTotal: number;
  discountPercent: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const { user } = useAuth(); // 👈 ottieni l’utente loggato

  // Calcolo totale base
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calcolo totale scontato (solo se c’è buono attivo)
  const discountedTotal =
    discountPercent > 0 ? total * (1 - discountPercent / 100) : total;

  // 🔍 Controlla se l’utente ha un buono sconto attivo
  useEffect(() => {
    if (!user) {
      setDiscountPercent(0);
      return;
    }

    const checkDiscount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}user_discounts.php?user_id=${user.id}`);
        const data = await response.json();

        if (data.active_discount) {
          setDiscountPercent(data.active_discount); // es. 50
        } else {
          setDiscountPercent(0);
        }
      } catch (error) {
        console.error('Errore nel controllo sconto:', error);
      }
    };

    checkDiscount();
  }, [user]);

  // Aggiungi prodotto
  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Rimuovi prodotto
  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Svuota carrello
  const clearCart = () => setItems([]);

  // Aggiorna quantità manualmente
  const updateQuantity = (id: number, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        discountedTotal,
        discountPercent,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error('useCart deve essere usato dentro un CartProvider');
  return context;
};
