import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useOrders } from '../../context/OrderContext';
import { Order } from '../../types/order';
import { Colors } from '../../constants/Colors';
import Header from '../../components/Header';

const OrderCard = ({ order, onPress }: { order: Order; onPress: () => void }) => (
  <TouchableOpacity style={styles.orderCard} onPress={onPress}>
    <Text style={styles.orderId}>Ordine #{order.id.substring(0, 5)}</Text>
    <Text style={styles.orderTime}>{order.createdAt.toLocaleTimeString()}</Text>
    <Text style={styles.orderStatus}>{order.status}</Text>
  </TouchableOpacity>
);

const KitchenScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { orders } = useOrders();

  const newOrders = orders.filter(o => o.status === 'Nuovo');
  const inProgressOrders = orders.filter(o => o.status === 'In Preparazione');

  return (
    <View style={styles.container}>
      <Header title="Cucina - Ordini" />
      <View style={styles.content}>
        {/* New Orders Column */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Nuovi</Text>
          <FlatList
            data={newOrders}
            renderItem={({ item }) => (
              <OrderCard order={item} onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })} />
            )}
            keyExtractor={item => item.id}
          />
        </View>

        {/* In Preparation Column */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>In Preparazione</Text>
          <FlatList
            data={inProgressOrders}
            renderItem={({ item }) => (
              <OrderCard order={item} onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })} />
            )}
            keyExtractor={item => item.id}
          />
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
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: Colors.grey,
    padding: 10,
  },
  columnTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  orderTime: {
    fontSize: 14,
    color: Colors.grey,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 5,
  },
});

export default KitchenScreen;
