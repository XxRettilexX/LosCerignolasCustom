import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '../../api';
import Header from '../../components/Header';
import { useCart } from '../../context/CartContext';
import { RootStackParamList } from '../../types/navigation';
import { Product } from '../../types/product';

const Colors = {
  primary: '#FFD60A',
  secondary: '#004AAD',
  backgroundLight: '#FFF7E0',
  text: '#142C4D',
  white: '#FFFFFF',
};

// 🧀 Allergeni
const ALLERGENS: Record<string, string[]> = {
  Margherita: ['🌾', '🥛'],
  Diavola: ['🌾', '🥛'],
  Napoli: ['🌾', '🐟'],
  Capricciosa: ['🌾', '🥛', '🍄'],
  Prosciutto: ['🌾', '🥛'],
};

// Descrizioni
const DESCRIPTIONS: Record<string, string> = {
  Margherita: 'Pomodoro, mozzarella e basilico fresco.',
  Diavola: 'Salame piccante e mozzarella filante.',
  Napoli: 'Acciughe, capperi e origano pugliese.',
  Capricciosa: 'Prosciutto, funghi, olive e carciofi.',
  Prosciutto: 'Prosciutto cotto e mozzarella fiordilatte.',
};

// Immagini locali
const pizzaImages: Record<string, any> = {
  Margherita: require('../../assets/pizze/margherita.jpg'),
  Diavola: require('../../assets/pizze/diavola.jpg'),
  Napoli: require('../../assets/pizze/napoli.jpg'),
  Capricciosa: require('../../assets/pizze/capricciosa.jpg'),
  Prosciutto: require('../../assets/pizze/prosciutto.jpg'),
};

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const MenuScreen: React.FC<{ navigation: MenuScreenNavigationProp }> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPizza, setSelectedPizza] = useState<Product | null>(null);
  const { addToCart } = useCart();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetched = await api.fetchProducts();
        setProducts(fetched.map((p: any) => ({ ...p, price: Number(p.price) })));

        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
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
    addToCart({ id: item.id, name: item.name, price: item.price, quantity: 1 });
    Alert.alert('✅ Aggiunto al carrello', `${item.name} è stato aggiunto!`);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <View style={styles.itemContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelectedPizza(item)}
          style={{ flexDirection: 'row', flex: 1 }}
        >
          <Image
            source={pizzaImages[item.name] || { uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.textBox}>
            <View style={styles.titleRow}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.allergens}>
                {ALLERGENS[item.name]?.join(' ') || ''}
              </Text>
            </View>
            <Text style={styles.description}>
              {DESCRIPTIONS[item.name] || 'Ingredienti selezionati e impasto artigianale.'}
            </Text>
            <Text style={styles.price}>€{item.price.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Aggiungi</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
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
      <Header title="Menù" />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Le nostre pizze 🍕</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* --- MODALE --- */}
      <Modal
        visible={!!selectedPizza}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedPizza(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={pizzaImages[selectedPizza?.name || ''] || { uri: selectedPizza?.image }}
              style={styles.modalImage}
              resizeMode="cover"
            />
            <Text style={styles.modalTitle}>{selectedPizza?.name}</Text>
            <Text style={styles.modalDescription}>
              {DESCRIPTIONS[selectedPizza?.name || ''] ||
                'Ingredienti selezionati e impasto artigianale.'}
            </Text>

            <View style={styles.allergenLegend}>
              <Text style={styles.legendTitle}>Allergeni:</Text>
              <Text style={styles.legendText}>
                🌾 Glutine   🥛 Lattosio   🧀 Formaggi   🐟 Pesce   🍄 Funghi
              </Text>
            </View>

            <Text style={styles.modalPrice}>€{selectedPizza?.price.toFixed(2)}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                handleAddToCart(selectedPizza!);
                setSelectedPizza(null);
              }}
            >
              <Text style={styles.modalButtonText}>Aggiungi al carrello</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedPizza(null)}
              style={styles.modalClose}
            >
              <Text style={styles.modalCloseText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

/* 💅 STILI */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: Colors.text, fontWeight: '600' },
  errorText: { color: 'red', fontSize: 16 },

  sectionHeader: { paddingVertical: 15, alignItems: 'center' },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: Colors.secondary },
  list: { paddingHorizontal: 15, paddingBottom: 20 },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f6eeb8',
  },
  image: { width: 80, height: 80, borderRadius: 12 },
  textBox: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '800', color: Colors.text },
  allergens: { fontSize: 14, color: '#888' },
  description: { fontSize: 13, color: Colors.secondary, marginTop: 4 },
  price: { fontSize: 15, fontWeight: '700', color: Colors.secondary, marginTop: 6 },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  addButtonText: { fontWeight: '700', fontSize: 13, color: Colors.text },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalImage: { width: 140, height: 140, borderRadius: 15, marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: Colors.secondary },
  modalDescription: {
    fontSize: 15,
    textAlign: 'center',
    color: Colors.text,
    marginVertical: 10,
    lineHeight: 22,
  },
  allergenLegend: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
  },
  legendTitle: { fontWeight: '800', color: Colors.secondary, marginBottom: 5 },
  legendText: { fontSize: 13, color: Colors.text, textAlign: 'center' },
  modalPrice: { fontSize: 18, fontWeight: '800', color: Colors.secondary, marginBottom: 15 },
  modalButton: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 5,
  },
  modalButtonText: { color: Colors.text, fontWeight: '800', fontSize: 16 },
  modalClose: { marginTop: 10 },
  modalCloseText: { color: Colors.secondary, fontWeight: '600' },
});

export default MenuScreen;
