import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import Header from '../../components/Header';

const OrdersScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header title="I miei Ordini" />
      <View style={styles.content}>
        <Text style={styles.text}>Qui vedrai lo storico dei tuoi ordini.</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: Colors.text,
  },
});

export default OrdersScreen;
