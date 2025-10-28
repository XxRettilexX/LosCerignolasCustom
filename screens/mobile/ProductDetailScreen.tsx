import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useCart } from '../../context/CartContext';
import { Colors } from '../../constants/Colors';
import Header from '../../components/Header';

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;

interface Props {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
}

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    navigation.goBack(); // Or navigate to cart: navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <Header title={product.name} canGoBack />
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>{typeof product.price === 'number' && product.price > 0 ? `€${product.price.toFixed(2)}` : ''}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Aggiungi al Carrello</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  image: {
    width: '100%',
    height: 250,
  },
  detailsContainer: {
    padding: 20,
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
});

export default ProductDetailScreen;
