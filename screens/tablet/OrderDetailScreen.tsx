import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { Colors } from '../../constants/Colors';
import { useOrders } from '../../context/OrderContext';
import { RootStackParamList } from '../../types/navigation';
import { Order } from '../../types/order';

type OrderDetailRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;

const OrderDetailScreen: React.FC = () => {
  const route = useRoute<OrderDetailRouteProp>();
  const { orderId } = route.params;
  const { orders, updateOrderStatus } = useOrders();

  // trova l'ordine giusto
  const order: Order | undefined = orders.find(o => o.order_id === orderId);

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Ordine non trovato</Text>
      </View>
    );
  }

  const handleUpdateStatus = () => {
    const next =
      order.status === 'Nuovo'
        ? 'In Preparazione'
        : order.status === 'In Preparazione'
          ? 'Pronto'
          : 'Completato';
    updateOrderStatus(order.order_id.toString(), next);
  };

  return (
    <View style={styles.container}>
      <Header title={`Ordine #${order.order_id}`} canGoBack />

      <View style={styles.infoContainer}>
        <Text style={styles.status}>🟡 Stato: {order.status}</Text>
        <Text style={styles.total}>
          💰 Totale: {Number(order.total_amount).toFixed(2)} €
        </Text>
        <Text style={styles.source}>👤 Fonte: {order.source || '—'}</Text>
        <Text style={styles.time}>🕒 {order.created_at}</Text>
      </View>

      <Text style={styles.sectionTitle}>🍕 Prodotti</Text>

      <FlatList
        data={order.items}
        keyExtractor={(item, index) => `${item.product_id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQty}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>
              {Number(item.price).toFixed(2)} €
            </Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateStatus}>
        <Text style={styles.buttonText}>Aggiorna stato →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { fontSize: 18, color: 'red' },
  infoContainer: { marginBottom: 16, backgroundColor: Colors.white, padding: 16, borderRadius: 10 },
  status: { fontSize: 18, fontWeight: 'bold', color: Colors.secondary },
  total: { fontSize: 18, color: Colors.primary, marginTop: 6 },
  source: { fontSize: 14, color: Colors.grey, marginTop: 4 },
  time: { fontSize: 13, color: Colors.grey, marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginVertical: 10 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemName: { fontSize: 16, fontWeight: '600', color: Colors.text },
  itemQty: { fontSize: 16, color: Colors.secondary },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  button: {
    marginTop: 20,
    backgroundColor: Colors.secondary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default OrderDetailScreen;
