import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import GradientButton from '../../components/GradientButton';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();

  // 🔹 Animazioni
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        bounciness: 15,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>


      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {user ? (
          <>
            <Text style={styles.welcomeText}>Ciao, {user.name}! 👋</Text>

            <View style={styles.pointsContainer}>
              <Text style={styles.pointsLabel}>I tuoi punti fedeltà</Text>
              <Text style={styles.pointsValue}>{user.loyalty_points ?? 0}</Text>
            </View>

            <Text style={styles.motivation}>
              Continua a ordinare per guadagnare altri punti e sbloccare premi! 🎁
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.welcomeText}>Benvenuto da Los Cerignolas! 🍕</Text>
            <Text style={styles.promoText}>
              Accedi per iniziare a guadagnare punti fedeltà e ricevere sconti esclusivi!
            </Text>

            <GradientButton
              title="Accedi ora"
              variant="secondary"
              onPress={() => console.log('Vai alla pagina di login')}
              style={{ marginTop: 20, width: '80%' }}
            />
          </>
        )}
      </Animated.View>
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
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  pointsContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 25,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#FFF',
  },
  pointsValue: {
    fontSize: 46,
    fontWeight: '800',
    color: Colors.primary,
  },
  promoText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  motivation: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 22,
  },
});

export default HomeScreen;
