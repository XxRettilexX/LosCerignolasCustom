import { Product } from './product';

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Menu: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
  Login: undefined;
};

export type KitchenTabParamList = {
  Kitchen: undefined;
};

export type TabletStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  OrderDetail: { orderId: string };
};
