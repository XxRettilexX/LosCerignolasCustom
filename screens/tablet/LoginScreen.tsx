import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';
import { api } from '../../api';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Errore', 'Per favore, inserisci email e password.');
      return;
    }

    setLoading(true);
    try {
      const user = await api.login(email, password);
      login(user);
      // Navigation is handled by AppNavigator based on user state
    } catch (error: any) {
      Alert.alert('Errore di Login', error.message || 'Credenziali non valide.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accesso Cucina</Text>
      <Text style={styles.subtitle}>Inserisci le tue credenziali per visualizzare gli ordini.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Chef (es. chef@example.com)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={Colors.grey}
      />
      <TextInput
        style={styles.input}
        placeholder="Password (es. password)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={Colors.grey}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Accesso in corso...' : 'Entra'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.grey,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
