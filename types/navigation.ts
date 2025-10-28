import { Product } from './product';

/* -------------------------------------------------------------------------- */
/* 🧭 STACK DI AUTENTICAZIONE (usato per tablet o login separato)             */
/* -------------------------------------------------------------------------- */
export type AuthStackParamList = {
  Login: undefined;
};

/* -------------------------------------------------------------------------- */
/* 📱 TAB PRINCIPALE MOBILE (bottom tab navigator)                            */
/* -------------------------------------------------------------------------- */
export type MainTabParamList = {
  Home: undefined;
  Menu: undefined;
  Orders: undefined;
  Profile: undefined;
};

/* -------------------------------------------------------------------------- */
/* 📦 STACK PRINCIPALE MOBILE (include le tab e altre schermate extra)        */
/* -------------------------------------------------------------------------- */
export type RootStackParamList = {
  Splash: undefined;                   // Schermata iniziale
  Auth: undefined;                     // Stack auth (eventuale)
  Main: undefined;                     // Contiene il tab navigator
  ProductDetail: { product: Product }; // Riceve un oggetto "Product"
  Cart: undefined;
  Login: undefined;                    // 👈 Login mobile (per navigate da Home)
};

/* -------------------------------------------------------------------------- */
/* 🍳 TAB KITCHEN (solo per tablet)                                           */
/* -------------------------------------------------------------------------- */
export type KitchenTabParamList = {
  Kitchen: undefined;
};

/* -------------------------------------------------------------------------- */
/* 💻 STACK PRINCIPALE TABLET (con autenticazione e ordini cucina)            */
/* -------------------------------------------------------------------------- */
export type TabletStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  OrderDetail: { orderId: string };
};
