import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '../../api';
import { useCart } from '../../context/CartContext';
import { RootStackParamList } from '../../types/navigation';
import { Product } from '../../types/product';

/* 🎨 Palette Los Cerignola */
const Colors = {
  primary: '#FFD60A', // giallo
  secondary: '#004AAD', // blu
  backgroundLight: '#FFF7E0', // crema
  text: '#142C4D', // blu notte
  white: '#FFFFFF',
};

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface Props {
  navigation: MenuScreenNavigationProp;
}

const MenuScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  /* 🔹 Caricamento prodotti dal DB */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetched = await api.fetchProducts();
        setProducts(fetched.map((p: any) => ({ ...p, price: Number(p.price) })));
      } catch (err) {
        console.error(err);
        setError('Errore durante il caricamento dei prodotti.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* 🔹 Aggiunta al carrello */
  const handleAddToCart = (item: Product) => {
    addToCart({ id: item.id, name: item.name, price: item.price, quantity: 1 });
    Alert.alert('✅ Aggiunto al carrello', `${item.name} è stato aggiunto!`);
  };

  /* 🔹 Singolo elemento del menù */
  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.itemContainer}>
      <View style={styles.leftBox}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>🍕</Text>
          </View>
        )}
      </View>

      <View style={styles.rightBox}>
        <View style={styles.textRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>€{item.price.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => navigation.navigate('ProductDetail', { product: item })}
          activeOpacity={0.8}
        >
          <LinearGradient colors={[Colors.primary, '#E6C200']} style={styles.gradient}>
            <Text style={styles.detailText}>Dettagli</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* 🔹 Stati di caricamento / errore */
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={styles.loadingText}>Caricamento menù...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );

  /* 🔹 Schermata principale */
  return (
    <View style={styles.container}>


      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

/* 💅 Stili coerenti con la UI del mockup */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.text,
    fontFamily: 'Nunito-Bold',
  },
  errorText: { color: 'red', fontSize: 16 },
  list: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  leftBox: { marginRight: 10 },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { fontSize: 22 },
  rightBox: {
    flex: 1,
    justifyContent: 'center',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: Colors.text,
  },
  price: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: Colors.secondary,
  },
  detailButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    borderRadius: 6,
    overflow: 'hidden',
  },
  gradient: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailText: {
    fontFamily: 'Nunito-Bold',
    color: Colors.text,
    fontSize: 13,
  },
});

export default MenuScreen;
