import React, { createContext, useContext, useState } from 'react';
import { CartItem } from './CartContext';

export interface MultiOrder {
    id: string;
    name: string;
    items: CartItem[];
}

interface MultiCartContextType {
    orders: MultiOrder[];
    activeOrderId: string | null;
    createOrder: (name?: string) => void;
    switchOrder: (id: string) => void;
    addToActiveOrder: (item: CartItem) => void;
    clearAll: () => void;
}

const MultiCartContext = createContext<MultiCartContextType | undefined>(undefined);

export const MultiCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<MultiOrder[]>([]);
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

    const createOrder = (name = `Ordine ${orders.length + 1}`) => {
        const newOrder = { id: Date.now().toString(), name, items: [] };
        setOrders(prev => [...prev, newOrder]);
        setActiveOrderId(newOrder.id);
    };

    const switchOrder = (id: string) => setActiveOrderId(id);

    const addToActiveOrder = (item: CartItem) => {
        if (!activeOrderId) createOrder();
        setOrders(prev =>
            prev.map(o =>
                o.id === activeOrderId
                    ? { ...o, items: [...o.items, item] }
                    : o
            )
        );
    };

    const clearAll = () => {
        setOrders([]);
        setActiveOrderId(null);
    };

    return (
        <MultiCartContext.Provider
            value={{ orders, activeOrderId, createOrder, switchOrder, addToActiveOrder, clearAll }}
        >
            {children}
        </MultiCartContext.Provider>
    );
};

export const useMultiCart = () => {
    const context = useContext(MultiCartContext);
    if (!context) throw new Error('useMultiCart deve essere usato dentro MultiCartProvider');
    return context;
};
