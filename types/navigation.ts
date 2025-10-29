// types/navigation.ts
import { Product } from './product';

/* Tab principale mobile */
export type MainTabParamList = {
  Home: undefined;
  Menu: undefined;
  Cart: undefined;      // ✅ aggiunto
  Orders: undefined;
  Profile: undefined;
};

/* Stack principale mobile */
export type RootStackParamList = {
  Main: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
  Checkout: undefined;   // ✅ aggiunto
  Login: undefined;
};

/* Auth stack (tablet o separato) */
export type AuthStackParamList = {
  Login: undefined;
};

/* Tablet */
export type TabletStackParamList = {
  Splash?: undefined;
  Auth?: undefined;
  Main: undefined;
  OrderDetail: { orderId: string };
};
