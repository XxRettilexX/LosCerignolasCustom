import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';

// 🔸 Assicurati di avere il logo in assets/logo.png
import logo from '../../assets/logo.png';

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // 🔵 Punti animati
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo fade + bounce
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Loop puntini animati
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        dot1.setValue(0);
        dot2.setValue(0);
        dot3.setValue(0);
        animateDots();
      });
    };
    animateDots();

    // Naviga alla Home (Main) dopo 2.5 secondi
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={logo}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.text,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          Stiamo accendendo il forno
        </Animated.Text>

        {/* Puntini animati */}
        <View style={styles.dotsContainer}>
          <Animated.Text
            style={[styles.dot, { opacity: dot1.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }]}
          >
            .
          </Animated.Text>
          <Animated.Text
            style={[styles.dot, { opacity: dot2.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }]}
          >
            .
          </Animated.Text>
          <Animated.Text
            style={[styles.dot, { opacity: dot3.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }]}
          >
            .
          </Animated.Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // crema
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginLeft: 6,
  },
  dot: {
    fontSize: 22,
    color: Colors.text,
    fontWeight: 'bold',
    marginHorizontal: 1,
  },
});

export default LoadingScreen;
