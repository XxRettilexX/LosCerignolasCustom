// screens/mobile/CheckoutScreen.tsx
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../../api';
import Header from '../../components/Header';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { CartItem } from '../../context/CartContext'; // ✅
import { MultiOrder, useMultiCart } from '../../context/MultiCartContext'; // ✅

const CheckoutScreen: React.FC = () => {
  const { orders, clearAll } = useMultiCart();
  const { token } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const total = useMemo(() => {
    return orders.reduce((sum: number, order: MultiOrder) => {
      const orderTotal = order.items.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
      return sum + orderTotal;
    }, 0);
  }, [orders]);

  const handleSendAll = async () => {
    if (!orders.length) {
      Alert.alert('Carrello vuoto', 'Aggiungi almeno un ordine.');
      return;
    }

    setSubmitting(true);
    try {
      for (const order of orders) {
        const orderTotal = order.items.reduce(
          (sum: number, i: CartItem) => sum + i.price * i.quantity,
          0
        );

        // ✅ inviamo anche name per soddisfare il tipo CartItem lato client
        await api.createOrder(
          {
            items: order.items.map((i: CartItem) => ({
              id: i.id,
              name: i.name,
              quantity: i.quantity,
              price: i.price,
            })),
            total: orderTotal,
          },
          token ?? undefined
        );
      }

      Alert.alert('Ordini inviati', 'Tutti gli ordini sono stati inviati alla cucina.');
      clearAll();
    } catch (e: any) {
      Alert.alert('Errore', e?.message || 'Invio ordini fallito.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderOrder = ({ item }: { item: MultiOrder }) => {
    const orderTotal = item.items.reduce(
      (sum: number, i: CartItem) => sum + i.price * i.quantity,
      0
    );
    return (
      <View style={styles.orderCard}>
        <Text style={styles.orderTitle}>{item.name}</Text>
        {item.items.map((i: CartItem) => (
          <View key={`${i.id}-${i.quantity}`} style={styles.line}>
            <Text style={styles.lineName}>{i.name}</Text>
            <Text style={styles.lineQty}>x{i.quantity}</Text>
            <Text style={styles.linePrice}>{(i.price * i.quantity).toFixed(2)} €</Text>
          </View>
        ))}
        <Text style={styles.orderSubtotal}>Subtotale: {orderTotal.toFixed(2)} €</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Checkout" canGoBack />
      {orders.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Non ci sono ordini selezionati.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(o) => o.id}
            contentContainerStyle={{ padding: 16 }}
          />

          <View style={styles.footer}>
            <Text style={styles.total}>Totale: {total.toFixed(2)} €</Text>
            <TouchableOpacity
              style={[styles.btn, submitting && { opacity: 0.6 }]}
              disabled={submitting}
              onPress={handleSendAll}
            >
              <Text style={styles.btnText}>{submitting ? 'Invio...' : 'Invia in cucina'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { color: Colors.text, fontSize: 16 },
  orderCard: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  orderTitle: { fontWeight: '700', fontSize: 16, color: Colors.text, marginBottom: 8 },
  line: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  lineName: { color: Colors.text, fontSize: 14, flex: 1 },
  lineQty: { color: Colors.secondary, width: 40, textAlign: 'right' },
  linePrice: { color: Colors.primary, width: 80, textAlign: 'right', fontWeight: '700' },
  orderSubtotal: { textAlign: 'right', marginTop: 8, fontWeight: '700', color: Colors.text },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
    padding: 16,
    backgroundColor: Colors.white,
  },
  total: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 10, textAlign: 'right' },
  btn: { backgroundColor: Colors.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: Colors.text, fontWeight: '800', fontSize: 16 },
});

export default CheckoutScreen;
