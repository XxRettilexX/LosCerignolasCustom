import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';
import Header from '../../components/Header';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Header title="Home" showCart />
      <View style={styles.content}>
        {user ? (
          <>
            <Text style={styles.welcomeText}>Ciao, {user.name}!</Text>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsLabel}>Punti Fedeltà</Text>
              <Text style={styles.pointsValue}>{user.loyaltyPoints}</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.welcomeText}>Benvenuto da Los Cerignolas!</Text>
            <Text style={styles.promoText}>Accedi per iniziare a guadagnare punti fedeltà!</Text>
          </>
        )}
      </View>
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
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 40,
  },
  pointsContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  pointsLabel: {
    fontSize: 18,
    color: Colors.white,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  promoText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 40,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
