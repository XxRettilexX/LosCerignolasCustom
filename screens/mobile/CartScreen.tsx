import React from 'react';
import {
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import { Colors } from '../../constants/Colors';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';

const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { items, removeFromCart, total, clearCart, updateQuantity } = useCart();
  const { addOrder } = useOrders();

  const handleCheckout = () => {
    addOrder(items, total);
    clearCart();
    Alert.alert('Ordine Inviato!', 'Il tuo ordine è stato inviato alla cucina.');
    navigation.goBack();
  };

  const increaseQuantity = (id: number) => {
    const item = items.find((p) => p.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const decreaseQuantity = (id: number) => {
    const item = items.find((p) => p.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    } else {
      removeFromCart(id);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>€{(item.price * item.quantity).toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: Colors.secondary }]}
          onPress={() => decreaseQuantity(item.id)}
        >
          <Text style={styles.quantityButtonText}>−</Text>
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.quantity}</Text>

        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: Colors.primary }]}
          onPress={() => increaseQuantity(item.id)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Carrello" canGoBack />
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Il tuo carrello è vuoto.</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
            <View style={styles.footer}>
              <Text style={styles.totalText}>Totale: €{total.toFixed(2)}</Text>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Invia Ordine</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

/* 💅 Stili */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    opacity: 0.8,
  },
  listContainer: {
    paddingVertical: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 3,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.secondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  quantityButtonText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    width: 28,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'right',
    marginBottom: 15,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default CartScreen;
