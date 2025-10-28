import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { TabletStackParamList } from '../../types/navigation';

/* -------------------------------------------------------------------------- */
/* 🎨 Palette specifica per lo staff cucina                                   */
/* -------------------------------------------------------------------------- */
const Colors = {
  primary: '#2E7D32', // Verde scuro (cucina)
  secondary: '#81C784', // Verde chiaro
  background: '#F1F8E9', // Verde molto chiaro
  text: '#1B5E20', // Verde profondo
  accent: '#C8E6C9', // Verde tenue
};

/* -------------------------------------------------------------------------- */
/* 🧭 Tipizzazione navigazione                                                */
/* -------------------------------------------------------------------------- */
type KitchenNavigationProp = StackNavigationProp<TabletStackParamList>;

const KitchenLoginScreen: React.FC = () => {
  const navigation = useNavigation<KitchenNavigationProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  /* ✨ Animazioni in ingresso */
  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* 🧠 Logica di login per la cucina */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Errore', 'Inserisci email e password per accedere.');
      return;
    }

    setLoading(true);
    try {
      console.log("👨‍🍳 Tentativo di login staff cucina:", { email, password });
      await login(email, password);

      console.log("✅ Login staff riuscito, vado alla schermata Kitchen...");
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }], // oppure 'Kitchen' se hai uno stack dedicato
      });
    } catch (error: any) {
      console.error("❌ Errore di login staff:", error.message);
      Alert.alert('Errore di Login', error.message || 'Credenziali non valide.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.background, Colors.accent, '#E8F5E9']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, width: '100%' }}
      >
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY }] },
          ]}
        >
          <View style={styles.headerBox}>
            <Text style={styles.title}>Area Staff 👨‍🍳</Text>
            <Text style={styles.subtitle}>
              Accedi per gestire gli ordini della cucina
            </Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#7A7A7A"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#7A7A7A"
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.gradientBtn}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Accedi</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

/* -------------------------------------------------------------------------- */
/* 💅 Stili                                                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    opacity: 0.8,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  button: {
    width: '100%',
    borderRadius: 50,
    overflow: 'hidden',
    marginTop: 10,
  },
  gradientBtn: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default KitchenLoginScreen;
