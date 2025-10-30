import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import logo from '../../assets/logo.png';
import GradientButton from '../../components/GradientButton';
import Header from '../../components/Header';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

// Helpers
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const makeScale = (width: number) => {
  const s = clamp(width / 375, 0.85, 1.25);
  return (size: number) => Math.round(size * s);
};

const reviews = [
  { id: 1, name: 'Marco R.', text: 'Pizza fantastica, personale gentilissimo! 🔥' },
  { id: 2, name: 'Sara L.', text: 'Servizio rapido e ottima qualità degli ingredienti 🍕' },
  { id: 3, name: 'Luca D.', text: 'La migliore pizzeria della zona, senza paragoni 👏' },
  { id: 4, name: 'Giulia P.', text: 'Impasto leggero, prezzi ottimi, consigliatissimo 💛' },
  { id: 5, name: 'Francesco C.', text: 'Ogni volta una conferma, top come sempre! ⭐️' },
];

function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const scale = makeScale(width);

  const cardGap = clamp(Math.round(width * 0.03), 8, 18);
  const reviewCardWidth = clamp(Math.round(width * (isTablet ? 0.45 : 0.75)), 250, isTablet ? 420 : 340);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Recensioni auto-scroll + manuale
  const scrollRef = useRef<FlatList>(null);
  const autoScroll = useRef<NodeJS.Timeout | null>(null);
  const offset = useRef(0);
  const isUserScrolling = useRef(false);

  const startAutoScroll = () => {
    if (autoScroll.current) clearInterval(autoScroll.current);
    autoScroll.current = setInterval(() => {
      if (isUserScrolling.current) return; // pausa se l’utente interagisce
      offset.current += 1;
      scrollRef.current?.scrollToOffset({
        offset: offset.current,
        animated: false,
      });
      const totalWidth = (reviewCardWidth + cardGap) * reviews.length;
      if (offset.current > totalWidth) offset.current = 0;
    }, 16);
  };

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScroll.current) clearInterval(autoScroll.current);
    };
  }, [reviewCardWidth]);

  const onScrollBegin = () => {
    isUserScrolling.current = true;
    if (autoScroll.current) clearInterval(autoScroll.current);
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    offset.current = e.nativeEvent.contentOffset.x;
    isUserScrolling.current = false;
    startAutoScroll();
  };

  // Animazioni di ingresso
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 5, tension: 80, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -5, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 5, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const renderReview = ({ item }: any) => (
    <View style={[styles.reviewCard, { width: reviewCardWidth, marginHorizontal: cardGap / 2 }]}>
      <Text style={[styles.reviewText, { fontSize: scale(15) }]}>“{item.text}”</Text>
      <Text style={[styles.reviewAuthor, { fontSize: scale(14) }]}>— {item.name}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? 25 : 0 }]}>
      <Header title="Home" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {!user ? (
          <Animated.View style={[styles.guestCard, { opacity: fadeAnim }]}>
            <Animated.Image
              source={logo}
              style={[styles.logo, { transform: [{ translateY: floatAnim }] }]}
              resizeMode="contain"
            />
            <Text style={styles.guestTitle}>Benvenuto da Los Cerignolas!</Text>
            <Text style={styles.guestSubtitle}>
              Accedi per iniziare a guadagnare punti fedeltà e ricevere sconti esclusivi! 😋
            </Text>
            <View style={{ width: '80%', marginTop: 10 }}>
              <GradientButton title="Accedi ora" variant="secondary" onPress={() => navigation.navigate('Login')} />
            </View>
          </Animated.View>
        ) : (
          <Text style={styles.welcomeText}>Ciao, {user.name}! 👋</Text>
        )}
      </Animated.View>

      {/* ⭐ Recensioni */}
      <View style={styles.reviewsSection}>
        <Text style={styles.reviewsTitle}>⭐ Recensioni dei nostri clienti</Text>
        <FlatList
          ref={scrollRef}
          data={[...reviews, ...reviews]}
          horizontal
          renderItem={renderReview}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScrollBeginDrag={onScrollBegin}
          onScrollEndDrag={onScrollEnd}
          onMomentumScrollEnd={onScrollEnd}
          contentContainerStyle={{ paddingHorizontal: cardGap }}
        />
      </View>

      {/* ℹ️ Sezione Chi siamo */}
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>Chi siamo</Text>
        <Text style={styles.aboutText}>
          Los Cerignolas nasce dalla passione per la vera pizza artigianale, preparata con ingredienti freschi e
          genuini. La nostra missione è portare a tavola il sapore autentico della tradizione italiana con un tocco
          moderno. 🍕🇮🇹
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },

  guestCard: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 25,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  logo: { width: 120, height: 120, marginBottom: 10 },
  guestTitle: { fontSize: 22, fontWeight: '900', color: Colors.text, textAlign: 'center' },
  guestSubtitle: {
    fontSize: 15,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },

  welcomeText: { fontSize: 24, fontWeight: '900', color: Colors.text, textAlign: 'center' },

  // Reviews
  reviewsSection: { marginTop: 30, marginBottom: 20 },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  reviewText: { color: Colors.text, fontStyle: 'italic', marginBottom: 6 },
  reviewAuthor: { fontWeight: '700', color: Colors.secondary, textAlign: 'right' },

  // About Card
  aboutCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  aboutTitle: { fontSize: 20, fontWeight: '900', color: Colors.secondary, textAlign: 'center', marginBottom: 8 },
  aboutText: { fontSize: 15, color: Colors.text, textAlign: 'center', lineHeight: 22 },
});

export default HomeScreen;
