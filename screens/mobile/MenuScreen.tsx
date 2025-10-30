import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
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

/* 📱 Calcolo dimensioni dinamiche */
const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.18; // immagini proporzionali
const CARD_PADDING = width * 0.03;

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
          activeOpacity={0.85}
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

/* 💅 Stili moderni, responsive e fluidi */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingTop: Platform.OS === 'ios' ? 10 : 5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  list: {
    paddingHorizontal: width * 0.04,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 18,
    marginBottom: 14,
    padding: CARD_PADDING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 0.8,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  leftBox: {
    marginRight: 14,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  placeholder: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 14,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  placeholderText: {
    fontSize: 28,
  },
  rightBox: {
    flex: 1,
    justifyContent: 'center',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: width * 0.045,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: width * 0.04,
    fontWeight: '700',
    color: Colors.secondary,
  },
  detailButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: Colors.secondary,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailText: {
    fontWeight: '700',
    color: Colors.text,
    fontSize: width * 0.035,
    letterSpacing: 0.3,
  },
});

export default MenuScreen;
