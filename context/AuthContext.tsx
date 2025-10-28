import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../api';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      if (savedToken) setToken(savedToken);
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    console.log("🟡 Tentativo di login da AuthContext...");
    const { user, token } = await api.login(email.trim(), password.trim());
    console.log("✅ Login riuscito:", user);
    console.log("🔐 Token ricevuto:", token);

    setUser(user);
    setToken(token);
    await AsyncStorage.setItem('token', token);
    console.log("💾 Token salvato localmente");
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve essere usato dentro un AuthProvider');
  return context;
};
