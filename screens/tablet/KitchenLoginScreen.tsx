import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Font from 'expo-font';
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
/* 🎨 Palette coerente Los Cerignola                                          */
/* -------------------------------------------------------------------------- */
const Colors = {
  primary: '#FFD60A',     // 🟡 Giallo
  secondary: '#004AAD',   // 🔵 Blu
  background: '#FFF7E0',  // ⚪ Crema
  text: '#142C4D',        // ⚫ Blu Notte
};

/* -------------------------------------------------------------------------- */
/* 🧭 Tipizzazione navigazione                                                */
/* -------------------------------------------------------------------------- */
type KitchenNavigationProp = StackNavigationProp<TabletStackParamList>;

/* -------------------------------------------------------------------------- */
/* 🧑‍🍳 Component                                                              */
/* -------------------------------------------------------------------------- */
const KitchenLoginScreen: React.FC = () => {
  const navigation = useNavigation<KitchenNavigationProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  /* ------------------------------------------------------------ */
  /* 🅰️ Caricamento font Nunito                                 */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        Nunito: require('../../assets/fonts/Nunito-Regular.ttf'),
        'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
      });
      setFontLoaded(true);
    })();
  }, []);

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

  /* 🧠 Logica di login */
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
        routes: [{ name: 'Main' }], // oppure 'Kitchen' se hai stack dedicato
      });
    } catch (error: any) {
      console.error("❌ Errore di login staff:", error.message);
      Alert.alert('Errore di Login', error.message || 'Credenziali non valide.');
    } finally {
      setLoading(false);
    }
  };

  if (!fontLoaded) return null;

  /* ------------------------------------------------------------ */
  /* 🖼️ UI                                                      */
  /* ------------------------------------------------------------ */
  return (
    <LinearGradient
      colors={[Colors.background, '#FFF9EB', Colors.background]}
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

          {/* ✉️ Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#7A7A7A"
          />

          {/* 🔒 Password */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#7A7A7A"
          />

          {/* 🔘 Pulsante Login */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.secondary, '#002F73']}
              style={styles.gradientBtn}
            >
              {loading ? (
                <ActivityIndicator color={Colors.primary} />
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
    fontFamily: 'Nunito-Bold',
    fontSize: 30,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'Nunito',
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
    fontFamily: 'Nunito',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
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
    fontFamily: 'Nunito-Bold',
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default KitchenLoginScreen;
