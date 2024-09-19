import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // LinearGradient bileşenini içe aktar

const SettingsScreen = () => {
  return (
    <LinearGradient colors={['#87CEEB', '#00BFFF']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.text}>SettingsScreen</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // Gradient arka planı tüm ekranı kaplar
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#fff', // Metin rengini beyaz yap
  },
});

export default SettingsScreen;
