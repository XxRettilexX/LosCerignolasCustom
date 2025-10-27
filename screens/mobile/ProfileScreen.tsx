import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';


const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Header title="Profilo" />
      <View style={styles.content}>
        {user ? (
          // Authenticated View
          <>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{user.name}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
            <Text style={styles.label}>Punti Fedeltà:</Text>
            <Text style={styles.value}>{user.loyaltyPoints}</Text>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Guest View
          <>
            <Text style={styles.guestTitle}>Accedi per guadagnare punti!</Text>
            <Text style={styles.guestSubtitle}>
              Crea un account o accedi per salvare i tuoi ordini e accumulare punti fedeltà da usare come sconti.
            </Text>
            <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Accedi o Registrati</Text>
            </TouchableOpacity>
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
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    color: Colors.secondary,
    marginTop: 20,
  },
  value: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  loginButton: {
    backgroundColor: Colors.primary,
  },
  logoutButton: {
    backgroundColor: '#FF6347', // Tomato color
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  guestSubtitle: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default ProfileScreen;
