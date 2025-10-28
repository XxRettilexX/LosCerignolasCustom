import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '../../api';
import Header from '../../components/Header';
import { useCart } from '../../context/CartContext'; // 🧠 Aggiunto
import { RootStackParamList } from '../../types/navigation';
import { Product } from '../../types/product';

const Colors = {
  primary: '#FFD60A',
  secondary: '#004AAD',
  backgroundLight: '#FFF7E0',
  text: '#001D3D',
};

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface Props {
  navigation: MenuScreenNavigationProp;
}

const MenuScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart(); // ✅ Importa la funzione del contesto carrello

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await api.fetchProducts();

        const normalizedProducts = fetchedProducts.map((p: any) => ({
          ...p,
          price: Number(p.price),
        }));

        setProducts(normalizedProducts);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (err) {
        console.error(err);
        setError('Errore durante il caricamento dei prodotti.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (item: Product) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });

    Alert.alert('✅ Aggiunto al carrello', `${item.name} è stato aggiunto!`);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        activeOpacity={0.85}
      >
        <LinearGradient colors={['#FFFFFF', '#FFF9E5']} style={styles.productCard}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
          ) : (
            <View style={[styles.productImage, styles.placeholder]}>
              <Text style={styles.placeholderText}>Nessuna immagine</Text>
            </View>
          )}

          <View style={styles.textContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            {item.description ? (
              <Text style={styles.productDescription} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}

            <View style={styles.productFooter}>
              <Text style={styles.price}>
                {Number.isFinite(item.price) ? Number(item.price).toFixed(2) : '—'} €
              </Text>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)} // ✅ Funzione collegata
              >
                <LinearGradient colors={[Colors.secondary, '#003080']} style={styles.gradientButton}>
                  <Text style={styles.addText}>Aggiungi</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Caricamento menù...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Menù" showCart />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingTop: 10,
  },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.text, marginTop: 10, fontSize: 16, fontWeight: '600' },
  errorText: { color: 'red', fontSize: 16 },
  listContainer: { paddingHorizontal: 18, paddingBottom: 100 },
  card: { marginBottom: 24 },
  productCard: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  textContainer: { padding: 18 },
  productName: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  productDescription: {
    fontSize: 14,
    color: '#3A3A3A',
    opacity: 0.9,
    marginBottom: 10,
    lineHeight: 20,
  },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  addButton: { borderRadius: 25, overflow: 'hidden' },
  gradientButton: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 25 },
  addText: { color: '#FFF', fontWeight: '700', fontSize: 15, letterSpacing: 0.5 },
  placeholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#EEE', height: 180 },
  placeholderText: { color: Colors.secondary, fontWeight: '600' },
});

export default MenuScreen;
