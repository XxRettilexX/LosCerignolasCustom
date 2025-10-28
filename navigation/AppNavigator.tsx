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
import MobileHomeScreen from '../screens/mobile/HomeScreen';
import MobileLoginScreen from '../screens/mobile/LoginScreen';
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

// --- Mobile Navigator (No required login) ---
const MobileStack = createStackNavigator<RootStackParamList>();
const MobileTab = createBottomTabNavigator<MainTabParamList>();

const MobileMainNavigator = () => (
  <MobileTab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Menu') iconName = focused ? 'pizza' : 'pizza-outline';
        else if (route.name === 'Orders') iconName = focused ? 'receipt' : 'receipt-outline';
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
    <MobileTab.Screen name="Profile" component={MobileProfileScreen} />
  </MobileTab.Navigator>
);

const MobileAppStack = () => (
  <MobileStack.Navigator screenOptions={{ presentation: 'modal', headerShown: false }}>
    <MobileStack.Screen name="Main" component={MobileMainNavigator} options={{ headerShown: false }} />
    <MobileStack.Screen name="ProductDetail" component={MobileProductDetailScreen} options={{ headerShown: false }} />
    <MobileStack.Screen name="Cart" component={MobileCartScreen} options={{ headerShown: false }} />
    <MobileStack.Screen name="Login" component={MobileLoginScreen} />
  </MobileStack.Navigator>
);

// --- Tablet Navigator (Required login) ---
const TabletStack = createStackNavigator<TabletStackParamList>();

const TabletMainNavigator = () => (
  <TabletStack.Navigator screenOptions={{ headerShown: false }}>
    <TabletStack.Screen name="Main" component={TabletKitchenScreen} />
    <TabletStack.Screen name="OrderDetail" component={TabletOrderDetailScreen} />
  </TabletStack.Navigator>
)

// --- Main App Navigator ---
const AppNavigator = () => {
  const { user } = useAuth();

  const renderMobileNavigator = () => {
    return <MobileAppStack />;
  };

  const renderTabletNavigator = () => {
    return user ? <TabletMainNavigator /> : <TabletAuthNavigator />;
  };

  return (
    <NavigationContainer>
      {deviceType === 'mobile' ? renderMobileNavigator() : renderTabletNavigator()}
    </NavigationContainer>
  );
};

export default AppNavigator;
