import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
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
      <View style={styles.container}>
        <Header title="Profilo" />
        <View style={styles.content}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          {/* ⭐ Punti fedeltà */}
          <TouchableOpacity
            style={styles.pointsButton}
            onPress={() => setModalVisible(true)}
          >
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

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>Chiudi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // --- SEZIONE LOGIN (se non loggato) ---
  return (
    <View style={styles.container}>
      <Header title="Accedi al tuo profilo" />
      <View style={styles.loginBox}>
        <Text style={styles.loginTitle}>👋 Bentornato!</Text>
        <Text style={styles.loginSubtitle}>Accedi per vedere i tuoi punti fedeltà e ordini</Text>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 24, fontWeight: '800', color: Colors.text },
  email: { fontSize: 16, color: Colors.secondary, marginBottom: 30 },
  pointsButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  pointsText: { color: Colors.text, fontWeight: '700', fontSize: 16 },
  logoutButton: {
    marginTop: 40,
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  // --- Modal ---
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 10 },
  modalSubtitle: { fontSize: 16, color: Colors.text, marginBottom: 20 },
  redeemButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
  },
  redeemText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  closeButton: { marginTop: 5 },
  closeText: { color: Colors.text, fontWeight: '600', fontSize: 15 },

  // --- Login box ---
  loginBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginTitle: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 10 },
  loginSubtitle: { fontSize: 15, color: Colors.text, marginBottom: 25, textAlign: 'center' },
  input: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  loginButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
  },
  loginButtonText: { color: '#FFF', fontWeight: '700', fontSize: 17 },
});

export default ProfileScreen;
