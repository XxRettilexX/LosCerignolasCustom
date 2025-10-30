import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '../../api';
import Header from '../../components/Header';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 360;
const isTablet = width > 800;

const ProfileScreen: React.FC = () => {
  const { user, token, login, logout } = useAuth();
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Stato per il login locale
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // 🟡 Recupera punti solo se loggato
  const fetchPoints = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await api.fetchLoyaltyPoints(token);
      setPoints(data.points);
    } catch {
      Alert.alert('Errore', 'Impossibile recuperare i punti fedeltà.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, [token]);

  // 🎁 Riscatto punti
  const handleRedeemPoints = async () => {
    if (points < 50) {
      Alert.alert('Attenzione', 'Devi avere almeno 50 punti per riscattare un buono.');
      return;
    }

    try {
      await api.updateLoyaltyPoints('redeem', 50, token!);
      setPoints(points - 50);
      Alert.alert('🎉 Buono riscattato!', 'Hai usato 50 punti per ottenere un buono sconto.');
      setModalVisible(false);
    } catch {
      Alert.alert('Errore', 'Impossibile riscattare i punti.');
    }
  };

  // 🔐 Login inline
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Errore', 'Inserisci email e password.');
      return;
    }
    try {
      setLoginLoading(true);
      await login(email, password);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      Alert.alert('Errore di login', err.message || 'Credenziali non valide.');
    } finally {
      setLoginLoading(false);
    }
  };

  // --- SEZIONE PROFILO AUTENTICATO ---
  if (user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Profilo" />
        <View style={styles.content}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          {/* ⭐ Punti fedeltà */}
          <TouchableOpacity style={styles.pointsButton} onPress={() => setModalVisible(true)}>
            {loading ? (
              <ActivityIndicator color={Colors.secondary} />
            ) : (
              <Text style={styles.pointsText}>⭐ {points} punti fedeltà</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Esci</Text>
          </TouchableOpacity>
        </View>

        {/* 🎁 MODALE RISCATTO */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>🎁 Riscatta Punti</Text>
              <Text style={styles.modalSubtitle}>
                Hai <Text style={{ fontWeight: 'bold' }}>{points}</Text> punti disponibili.
              </Text>

              <TouchableOpacity
                style={[styles.redeemButton, points < 50 && { opacity: 0.5 }]}
                disabled={points < 50}
                onPress={handleRedeemPoints}
              >
                <Text style={styles.redeemText}>Riscatta 50 punti</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>Chiudi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // --- SEZIONE LOGIN (se non loggato) ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Accedi al tuo profilo" />
      <View style={styles.loginBox}>
        <Text style={styles.loginTitle}>👋 Bentornato!</Text>
        <Text style={styles.loginSubtitle}>
          Accedi per vedere i tuoi punti fedeltà e ordini
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.loginButton, loginLoading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loginLoading}
        >
          {loginLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Accedi</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* 🎨 STILI RESPONSIVE E FIX NOTCH */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isTablet ? 60 : 20,
  },
  name: {
    fontSize: isTablet ? 34 : isSmallDevice ? 22 : 26,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: isTablet ? 18 : 15,
    color: Colors.secondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  pointsButton: {
    backgroundColor: Colors.primary,
    paddingVertical: isTablet ? 20 : 14,
    paddingHorizontal: isTablet ? 60 : 40,
    borderRadius: 25,
    elevation: 4,
  },
  pointsText: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: isTablet ? 20 : 16,
  },
  logoutButton: {
    marginTop: isTablet ? 60 : 40,
    backgroundColor: Colors.secondary,
    paddingVertical: isTablet ? 18 : 14,
    paddingHorizontal: isTablet ? 60 : 40,
    borderRadius: 25,
  },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: isTablet ? 18 : 16 },

  // --- MODALE ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: isTablet ? 35 : 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: isTablet ? 18 : 15,
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  redeemButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 50 : 30,
    borderRadius: 25,
    marginBottom: 10,
  },
  redeemText: { color: '#FFF', fontWeight: '700', fontSize: isTablet ? 18 : 16 },
  closeButton: { marginTop: 5 },
  closeText: { color: Colors.text, fontWeight: '600', fontSize: 15 },

  // --- LOGIN BOX ---
  loginBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isTablet ? 40 : 20,
  },
  loginTitle: {
    fontSize: isTablet ? 36 : 28,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: isTablet ? 18 : 15,
    color: Colors.secondary,
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: isTablet ? 20 : 15,
    paddingHorizontal: isTablet ? 25 : 18,
    fontSize: isTablet ? 18 : 16,
    color: Colors.text,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  loginButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: isTablet ? 18 : 14,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: isTablet ? 18 : 17,
  },
});

export default ProfileScreen;
