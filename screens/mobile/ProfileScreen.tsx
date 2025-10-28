import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import GradientButton from '../../components/GradientButton';
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
          <View style={styles.profileCard}>
            <Image

              style={styles.avatar}
            />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>

            <View style={styles.pointsContainer}>
              <Text style={styles.pointsLabel}>Punti Fedeltà</Text>
              <Text style={styles.pointsValue}>{user.loyalty_points ?? 0}</Text>
            </View>

            <GradientButton title="Logout" onPress={logout} variant="danger" />
          </View>
        ) : (
          <View style={styles.guestContainer}>
            <Text style={styles.guestTitle}>Accedi per guadagnare punti! 🎉</Text>
            <Text style={styles.guestSubtitle}>
              Crea un account o accedi per salvare i tuoi ordini e accumulare punti fedeltà.
            </Text>
            <GradientButton
              title="Accedi o Registrati"
              onPress={() => navigation.navigate('Login')}
              variant="secondary"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: '800', color: Colors.text },
  email: { fontSize: 16, color: Colors.secondary, marginBottom: 20 },
  pointsContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  pointsLabel: { color: '#FFF', fontSize: 16 },
  pointsValue: { color: Colors.primary, fontSize: 36, fontWeight: '800' },
  guestContainer: { alignItems: 'center', paddingHorizontal: 20 },
  guestTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  guestSubtitle: { fontSize: 16, color: Colors.secondary, textAlign: 'center', marginBottom: 30 },
});

export default ProfileScreen;
