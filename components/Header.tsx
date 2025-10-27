import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';


interface HeaderProps {
  title: string;
  canGoBack?: boolean;
  showCart?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, canGoBack = false, showCart = false }) => {
  const navigation = useNavigation();
  const { items } = useCart();

  return (
    <View style={styles.headerContainer}>
      {canGoBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      {showCart && (
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartButton}>
          <Ionicons name="cart" size={24} color={Colors.text} />
          {items.length > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{items.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  cartButton: {
    position: 'absolute',
    right: 15,
  },
  badgeContainer: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
