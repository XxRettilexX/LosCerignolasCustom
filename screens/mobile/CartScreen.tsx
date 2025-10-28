import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { Colors } from '../../constants/Colors';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';

const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { addOrder } = useOrders();

  const handleCheckout = () => {
    addOrder(items, total);
    clearCart();
    Alert.alert('Ordine Inviato!', 'Il tuo ordine è stato inviato alla cucina.');
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>
          {item.name} (x{item.quantity})
        </Text>
        <Text style={styles.itemPrice}>€{(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Text style={styles.removeButton}>Rimuovi</Text>
      </TouchableOpacity>
    </View>
  );

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: Colors.text,
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 4,
  },
  removeButton: {
    color: 'red',
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
    padding: 20,
    backgroundColor: Colors.white,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'right',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
});

export default CartScreen;
