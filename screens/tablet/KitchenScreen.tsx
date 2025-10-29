import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { useOrders } from '../../context/OrderContext';
import { Order } from '../../types/order';

/* 🎨 Palette coerente con il brand */
const palette = {
  yellow: '#FFD60A',
  blue: '#004AAD',
  cream: '#FFF7E0',
  dark: '#142C4D',
  white: '#FFFFFF',
};

/* 🧩 Componente singola card ordine */
const OrderCard = ({
  order,
  onAction,
  type,
}: {
  order: Order;
  onAction: () => void;
  type: 'new' | 'progress';
}) => {
  const cardColor = type === 'new' ? palette.yellow : palette.blue;
  const actionText = type === 'new' ? 'Inizia Preparazione' : 'Segna Completato';

  // Calcola minuti trascorsi
  const minutesAgo = Math.floor(
    (Date.now() - new Date(order.created_at).getTime()) / 60000
  );

  return (
    <View style={[styles.card, { borderColor: cardColor }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.orderTitle, { color: cardColor }]}>
          Ordine #{order.order_id}
        </Text>
        <Text style={styles.timeText}>⏱ {minutesAgo} min</Text>
      </View>

      <View style={styles.itemsBox}>
        {order.items.map((item, idx) => (
          <Text key={idx} style={styles.itemText}>
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: cardColor }]}
        onPress={onAction}
      >
        <Text
          style={[
            styles.actionText,
            { color: type === 'new' ? palette.dark : palette.white },
          ]}
        >
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/* 🍳 Dashboard Cucina */
const KitchenDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();

  const newOrders = orders.filter((o) => o.status === 'Nuovo');
  const inProgressOrders = orders.filter((o) => o.status === 'In Preparazione');

  return (
    <View style={styles.container}>
      <Header title="Dashboard Cucina" />

      <View style={styles.content}>
        {/* COLONNA NUOVI ORDINI */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Nuovi Ordini</Text>
          <FlatList
            data={newOrders}
            keyExtractor={(item) => String(item.order_id)}
            renderItem={({ item }) => (
              <OrderCard
                order={item}
                type="new"
                onAction={() =>
                  updateOrderStatus(item.order_id.toString(), 'In Preparazione')
                }
              />
            )}
          />
        </View>

        {/* COLONNA IN PREPARAZIONE */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>In Preparazione</Text>
          <FlatList
            data={inProgressOrders}
            keyExtractor={(item) => String(item.order_id)}
            renderItem={({ item }) => (
              <OrderCard
                order={item}
                type="progress"
                onAction={() =>
                  updateOrderStatus(item.order_id.toString(), 'Pronto')
                }
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

/* 💅 Stili ottimizzati per tablet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  columnTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 26,
    color: palette.dark,
    textAlign: 'center',
    marginVertical: 16,
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 3,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
  },
  timeText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: '#555',
  },
  itemsBox: {
    marginVertical: 8,
  },
  itemText: {
    fontFamily: 'Nunito',
    fontSize: 16,
    color: palette.dark,
    marginBottom: 2,
  },
  actionButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
});

export default KitchenDashboard;
