import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from '../../assets/logo.png';
import GradientButton from '../../components/GradientButton';
import Header from '../../components/Header';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const offers = [
    { title: '2x1 su tutte le pizze 🍕', color: Colors.primary, textColor: Colors.text },
    { title: 'Menù Pasta + Bibita 🍝', color: Colors.secondary, textColor: Colors.white },
    { title: 'Dolce omaggio 🍰', color: Colors.background, textColor: Colors.text },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -5, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 5, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / 260);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={[Colors.background, '#FFF2B5']} style={StyleSheet.absoluteFill} />
      <Header title="Home" />

      <Animated.View
        style={[
          styles.offersContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={260}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {offers.map((offer, i) => {
            const isActive = i === activeIndex;
            return (
              <Animated.View
                key={i}
                style={[
                  styles.offerCardSmall,
                  {
                    backgroundColor: offer.color,
                    transform: [{ scale: isActive ? 1.05 : 1 }],
                    shadowOpacity: isActive ? 0.3 : 0.1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.offerTextSmall,
                    { color: offer.textColor, opacity: isActive ? 1 : 0.8 },
                  ]}
                >
                  {offer.title}
                </Text>
              </Animated.View>
            );
          })}
        </ScrollView>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {user ? (
          <>
            <Text style={styles.welcomeText}>Ciao, {user.name}! 👋</Text>

            <Animated.View style={[styles.pointsContainer, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.pointsLabel}>I tuoi punti fedeltà</Text>
              <Text style={styles.pointsValue}>{user.loyalty_points ?? 0}</Text>
            </Animated.View>

            <Text style={styles.motivation}>
              Continua a ordinare per guadagnare altri punti e sbloccare premi! 🎁
            </Text>
          </>
        ) : (
          <Animated.View style={[styles.guestCard, { opacity: fadeAnim }]}>
            <Animated.Image
              source={logo}
              style={[
                styles.logoImage,
                { transform: [{ translateY: floatAnim }], width: width * 0.3, height: width * 0.3 },
              ]}
              resizeMode="contain"
            />
            <Text style={styles.guestTitle}>Benvenuto da Los Cerignolas!</Text>
            <Text style={styles.guestSubtitle}>
              Accedi per iniziare a guadagnare punti fedeltà e ricevere sconti esclusivi! 😋
            </Text>
            <View style={{ width: '80%', marginTop: 20 }}>
              <GradientButton
                title="Accedi ora"
                variant="secondary"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  offersContainer: { paddingVertical: 10, alignItems: 'center', marginTop: 5 },
  offerCardSmall: {
    width: 240,
    height: 65,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    paddingHorizontal: 12,
  },
  offerTextSmall: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 18,
  },
  pointsContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 35,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 20,
  },
  pointsLabel: { color: Colors.white, marginBottom: 4 },
  pointsValue: { fontWeight: '900', color: Colors.primary },
  motivation: { color: Colors.secondary, textAlign: 'center', marginTop: 8 },
  guestCard: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    width: '88%',
  },
  logoImage: { marginBottom: 8 },
  guestTitle: {
    fontWeight: '900',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  guestSubtitle: { color: Colors.secondary, textAlign: 'center', marginBottom: 16 },
});

export default HomeScreen;
