import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '../../api';
import { useCart } from '../../context/CartContext';
import { RootStackParamList } from '../../types/navigation';
import { Product } from '../../types/product';

/* 🎨 Palette Los Cerignolas */
const Colors = {
  primary: '#FFD60A',
  secondary: '#004AAD',
  backgroundLight: '#FFF7E0',
  text: '#142C4D',
  white: '#FFFFFF',
};

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface Props {
  navigation: MenuScreenNavigationProp;
}

/* 🖼️ Immagini locali per le pizze */
const pizzaImages: Record<string, any> = {
  Margherita: require('../../assets/pizze/margherita.jpg'),
  Diavola: require('../../assets/pizze/diavola.jpg'),
  Napoli: require('../../assets/pizze/napoli.jpg'),
  Capricciosa: require('../../assets/pizze/capricciosa.jpg'),
  Prosciutto: require('../../assets/pizze/prosciutto.jpg'),
};

/* 🍽️ Allergeni associati ad alcune pizze */
const allergenIcons: Record<string, string[]> = {
  Margherita: ['🌾', '🧀'], // farina, latticini
  Diavola: ['🌾', '🧀', '🌶️'],
  Napoli: ['🌾', '🍅', '🐟'],
  Capricciosa: ['🌾', '🧀', '🥚'],
  Prosciutto: ['🌾', '🧀', '🥩'],
};

const MenuScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  /* 🔹 Caricamento prodotti */
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

  /* 🔹 Singolo elemento */
  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.itemContainer}>
      <View style={styles.leftBox}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        ) : pizzaImages[item.name] ? (
          <Image source={pizzaImages[item.name]} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>🍕</Text>
          </View>
        )}
      </View>

      <View style={styles.rightBox}>
        {/* 🔸 Nome + Allergen icons inline */}
        <View style={styles.textRow}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {(allergenIcons[item.name] || ['❄️']).map((icon, i) => (
              <Text key={i} style={styles.allergenIcon}>
                {icon}
              </Text>
            ))}
          </View>
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

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Aggiungi al carrello</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

/* 💅 Stili ottimizzati per tutti i device */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingTop: 10,
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
    fontWeight: '600',
  },
  errorText: { color: 'red', fontSize: 16 },
  list: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 18,
    marginBottom: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  leftBox: { marginRight: 12 },
  image: {
    width: 75,
    height: 75,
    borderRadius: 12,
  },
  placeholder: {
    width: 75,
    height: 75,
    borderRadius: 12,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { fontSize: 26 },
  rightBox: {
    flex: 1,
    justifyContent: 'center',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginRight: 6,
  },
  allergenIcon: {
    fontSize: 16,
    marginRight: 3,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.secondary,
  },
  detailButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradient: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  detailText: {
    fontWeight: '700',
    color: Colors.text,
    fontSize: 13,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: '700',
    fontSize: 13,
    color: Colors.text,
  },
});

export default MenuScreen;
