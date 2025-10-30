// navigation/AppNavigator.tsx
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { Colors } from '../constants/Colors';
import { useAuth } from '../context/AuthContext';
import {
  AuthStackParamList,
  MainTabParamList,
  RootStackParamList,
  TabletStackParamList,
} from '../types/navigation';
import { getDeviceType } from '../utils/deviceDetector';

// Mobile Screens
import MobileCartScreen from '../screens/mobile/CartScreen';
import CheckoutScreen from '../screens/mobile/CheckoutScreen';
import MobileHomeScreen from '../screens/mobile/HomeScreen';
import LoadingScreen from '../screens/mobile/LoadingScreen'; // 🔥 AGGIUNTO
import MobileMenuScreen from '../screens/mobile/MenuScreen';
import MobileOrdersScreen from '../screens/mobile/OrdersScreen';
import MobileProductDetailScreen from '../screens/mobile/ProductDetailScreen';
import MobileProfileScreen from '../screens/mobile/ProfileScreen';

// Tablet Screens
import TabletLoginScreen from '../screens/tablet/KitchenLoginScreen';
import TabletKitchenScreen from '../screens/tablet/KitchenScreen';
import TabletOrderDetailScreen from '../screens/tablet/OrderDetailScreen';

const deviceType = getDeviceType();

// --- Tablet Auth Navigator ---
const AuthStack = createStackNavigator<AuthStackParamList>();
const TabletAuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={TabletLoginScreen} />
  </AuthStack.Navigator>
);

// --- Mobile Navigator ---
const MobileTab = createBottomTabNavigator<MainTabParamList>();
const MobileStack = createStackNavigator<RootStackParamList>();

const MobileMainNavigator = () => (
  <MobileTab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Menu') iconName = focused ? 'pizza' : 'pizza-outline';
        else if (route.name === 'Orders') iconName = focused ? 'receipt' : 'receipt-outline';
        else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.secondary,
    })}
  >
    <MobileTab.Screen name="Home" component={MobileHomeScreen} />
    <MobileTab.Screen name="Menu" component={MobileMenuScreen} />
    <MobileTab.Screen name="Orders" component={MobileOrdersScreen} />
    <MobileTab.Screen name="Cart" component={MobileCartScreen} />
    <MobileTab.Screen name="Profile" component={MobileProfileScreen} />
  </MobileTab.Navigator>
);

// --- Mobile Stack con LoadingScreen iniziale ---
const MobileAppStack = () => (
  <MobileStack.Navigator screenOptions={{ presentation: 'modal', headerShown: false }}>
    {/* 👇 Prima schermata: Loading */}
    <MobileStack.Screen name="Loading" component={LoadingScreen} />
    <MobileStack.Screen name="Main" component={MobileMainNavigator} />
    <MobileStack.Screen name="ProductDetail" component={MobileProductDetailScreen} />
    <MobileStack.Screen name="Checkout" component={CheckoutScreen} />
  </MobileStack.Navigator>
);

// --- Tablet Navigator ---
const TabletStack = createStackNavigator<TabletStackParamList>();
const TabletMainNavigator = () => (
  <TabletStack.Navigator screenOptions={{ headerShown: false }}>
    <TabletStack.Screen name="Main" component={TabletKitchenScreen} />
    <TabletStack.Screen name="OrderDetail" component={TabletOrderDetailScreen} />
  </TabletStack.Navigator>
);

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {deviceType === 'mobile'
        ? <MobileAppStack />
        : (user ? <TabletMainNavigator /> : <TabletAuthNavigator />)}
    </NavigationContainer>
  );
};

export default AppNavigator;
