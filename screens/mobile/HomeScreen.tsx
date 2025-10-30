import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import logo from '../../assets/logo.png';
import GradientButton from '../../components/GradientButton';
import Header from '../../components/Header';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const reviews = [
  { id: 1, name: 'Giulia R.', text: 'Pizza eccezionale e ingredienti freschissimi! 🍕' },
  { id: 2, name: 'Marco L.', text: 'Servizio rapido e personale gentile, super consigliato!' },
  { id: 3, name: 'Elena P.', text: 'La mia pizzeria preferita, ogni volta una garanzia 😍' },
  { id: 4, name: 'Davide S.', text: 'Impasto leggero e gustoso, 10/10 🔥' },
  { id: 5, name: 'Chiara M.', text: 'Adoro la varietà e la qualità dei prodotti! 💛' },
];

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // animazione del logo
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -6, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 6, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // scorrimento automatico recensioni
  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % reviews.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, autoScroll]);

  // funzione apertura google maps
  const openInMaps = (lat: number, lng: number) => {
    const scheme = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
    });
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.canOpenURL(scheme!)
      .then((supported) => (supported ? Linking.openURL(scheme!) : Linking.openURL(url)))
      .catch((err) => console.error('Errore apertura Maps:', err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Home" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- SEZIONE PRINCIPALE --- */}
        <View style={[styles.cardContainer, !user && styles.guestCard]}>
          <Animated.Image
            source={logo}
            style={[styles.logo, { transform: [{ translateY: floatAnim }] }]}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            {user ? `Ciao, ${user.name}! 👋` : 'Benvenuto da Los Cerignolas! 🍕'}
          </Text>
          <Text style={styles.subtitle}>
            {user
              ? 'Continua a ordinare e guadagna punti fedeltà!'
              : 'Accedi per iniziare a guadagnare punti fedeltà e ricevere sconti esclusivi!'}
          </Text>

          {!user && (
            <View style={styles.buttonContainer}>
              <GradientButton
                title="Accedi ora"
                variant="secondary"
                onPress={() => navigation.navigate('Profile')}
              />
            </View>
          )}
        </View>

        {/* --- SEZIONE CHI SIAMO --- */}
        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>Chi siamo</Text>
          <Text style={styles.aboutText}>
            Siamo una pizzeria artigianale nata a Cerignola, specializzata in impasti leggeri e ingredienti 100% italiani.
            La nostra missione è portare la vera tradizione pugliese in ogni fetta! 🇮🇹
          </Text>
        </View>

        {/* --- RECENSIONI --- */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>⭐ Recensioni dei nostri clienti</Text>
          <FlatList
            ref={flatListRef}
            data={reviews}
            keyExtractor={(item) => String(item.id)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onTouchStart={() => setAutoScroll(false)}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (width * 0.8));
              setCurrentIndex(index);
              setAutoScroll(true);
            }}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <Text style={styles.reviewText}>“{item.text}”</Text>
                <Text style={styles.reviewName}>— {item.name}</Text>
              </View>
            )}
          />
        </View>

        {/* --- SEZIONE MAPPA --- */}
        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>📍 Dove trovarci</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 41.263,
              longitude: 15.900,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: 41.263, longitude: 15.900 }}
              title="Los Cerignolas"
              description="Via Roma 12, Cerignola (FG)"
            />
          </MapView>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => openInMaps(41.263, 15.900)}
          >
            <Text style={styles.mapButtonText}>Apri in Google Maps</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* 💅 STILI OTTIMIZZATI */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },
  scrollContent: { paddingBottom: 60, paddingHorizontal: 15, alignItems: 'center' },

  cardContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 15 },
  guestCard: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  logo: { width: 120, height: 120, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '900', color: Colors.text, textAlign: 'center' },
  subtitle: {
    fontSize: 15,
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  buttonContainer: { width: '80%', marginTop: 20 },

  aboutCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.secondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 15,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },

  reviewsSection: {
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
  },
  reviewCard: {
    width: width * 0.8,
    marginHorizontal: 10,
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewText: {
    fontSize: 15,
    color: Colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  reviewName: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '700',
    textAlign: 'center',
  },

  mapSection: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
    marginTop: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  map: { width: '100%', height: 220, borderRadius: 15 },
  mapButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  mapButtonText: { fontWeight: '700', fontSize: 15, color: Colors.text },
});

export default HomeScreen;
