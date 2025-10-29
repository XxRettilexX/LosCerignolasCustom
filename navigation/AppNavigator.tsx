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

/* -------------------------------------------------------------------------- */
/* 🎯 AUTH NAVIGATOR (TABLET)                                                 */
/* -------------------------------------------------------------------------- */
const AuthStack = createStackNavigator<AuthStackParamList>();
const TabletAuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={TabletLoginScreen} />
  </AuthStack.Navigator>
);

/* -------------------------------------------------------------------------- */
/* 📱 MOBILE NAVIGATOR (Bottom Tabs + Stack)                                  */
/* -------------------------------------------------------------------------- */
const MobileStack = createStackNavigator<RootStackParamList>();
const MobileTab = createBottomTabNavigator<MainTabParamList>();

const MobileMainNavigator = () => (
  <MobileTab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: Colors.backgroundLight,
        borderTopColor: '#E0E0E0',
        height: 60,
        paddingBottom: 5,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '700',
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Menu':
            iconName = focused ? 'pizza' : 'pizza-outline';
            break;
          case 'Cart':
            iconName = focused ? 'cart' : 'cart-outline';
            break;
          case 'Orders':
            iconName = focused ? 'receipt' : 'receipt-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.secondary,
    })}
  >
    <MobileTab.Screen
      name="Home"
      component={MobileHomeScreen}
      options={{ title: 'Home' }}
    />
    <MobileTab.Screen
      name="Menu"
      component={MobileMenuScreen}
      options={{ title: 'Menù' }}
    />
    <MobileTab.Screen
      name="Cart"
      component={MobileCartScreen}
      options={{ title: 'Carrello' }}
    />
    <MobileTab.Screen
      name="Orders"
      component={MobileOrdersScreen}
      options={{ title: 'Ordini' }}
    />
    <MobileTab.Screen
      name="Profile"
      component={MobileProfileScreen}
      options={{ title: 'Profilo' }}
    />
  </MobileTab.Navigator>
);

/* -------------------------------------------------------------------------- */
/* 🧭 MOBILE STACK (con Product Detail e Login)                               */
/* -------------------------------------------------------------------------- */
const MobileAppStack = () => (
  <MobileStack.Navigator screenOptions={{ presentation: 'modal', headerShown: false }}>
    <MobileStack.Screen name="Main" component={MobileMainNavigator} options={{ headerShown: false }} />
    <MobileStack.Screen name="ProductDetail" component={MobileProductDetailScreen} options={{ headerShown: false }} />
    <MobileStack.Screen name="Login" component={MobileLoginScreen} />
  </MobileStack.Navigator>
);

/* -------------------------------------------------------------------------- */
/* 💻 TABLET STACK (solo se loggato)                                         */
/* -------------------------------------------------------------------------- */
const TabletStack = createStackNavigator<TabletStackParamList>();

const TabletMainNavigator = () => (
  <TabletStack.Navigator screenOptions={{ headerShown: false }}>
    <TabletStack.Screen name="Main" component={TabletKitchenScreen} />
    <TabletStack.Screen name="OrderDetail" component={TabletOrderDetailScreen} />
  </TabletStack.Navigator>
);

/* -------------------------------------------------------------------------- */
/* 🌍 MAIN NAVIGATOR                                                         */
/* -------------------------------------------------------------------------- */
const AppNavigator = () => {
  const { user } = useAuth();

  const renderMobileNavigator = () => <MobileAppStack />;
  const renderTabletNavigator = () => (user ? <TabletMainNavigator /> : <TabletAuthNavigator />);

  return (
    <NavigationContainer>
      {deviceType === 'mobile' ? renderMobileNavigator() : renderTabletNavigator()}
    </NavigationContainer>
  );
};

export default AppNavigator;
