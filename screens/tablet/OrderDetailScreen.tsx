import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useOrders } from '../../context/OrderContext';
import { Colors } from '../../constants/Colors';
import Header from '../../components/Header';

const OrderDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { orders, updateOrderStatus } = useOrders();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <View style={styles.container}>
        <Header title="Ordine non trovato" canGoBack />
        <View style={styles.centered}>
          <Text>Dettagli dell'ordine non disponibili.</Text>
        </View>
      </View>
    );
  }

  const handleStatusChange = (status) => {
    updateOrderStatus(order.id, status);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title={`Ordine #${order.id.substring(0, 5)}`} canGoBack />
      <View style={styles.content}>
        <FlatList
          data={order.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name} (x{item.quantity})</Text>
            </View>
          )}
          ListHeaderComponent={<Text style={styles.listHeader}>Riepilogo</Text>}
        />
        <View style={styles.actionsContainer}>
          {order.status === 'Nuovo' && (
            <TouchableOpacity
              style={[styles.button, styles.inProgressButton]}
              onPress={() => handleStatusChange('In Preparazione')}
            >
              <Text style={styles.buttonText}>Inizia Preparazione</Text>
            </TouchableOpacity>
          )}
          {order.status === 'In Preparazione' && (
            <TouchableOpacity
              style={[styles.button, styles.readyButton]}
              onPress={() => handleStatusChange('Pronto')}
            >
              <Text style={styles.buttonText}>Ordine Pronto</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  listHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 15,
  },
  itemContainer: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  actionsContainer: {
    padding: 20,
  },
  button: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  inProgressButton: {
    backgroundColor: Colors.primary,
  },
  readyButton: {
    backgroundColor: '#28a745', // Green color
  },
});

export default OrderDetailScreen;
