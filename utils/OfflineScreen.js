import React from 'react';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native'; // useNavigation hook

const OfflineScreen = () => {
  const navigation = useNavigation(); // Get navigation using the hook

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="red" barStyle="light-content" />
      <View style={styles.content}>
        <MaterialIcons name="wifi-off" size={50} color="#fff" />
        <Text style={styles.text}>You are offline</Text>

        {/* Updated Button with TouchableOpacity and icon */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainScreen')}>
          <MaterialIcons name="arrow-forward" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Continue Offline</Text>
        </TouchableOpacity>
      </View>

        <StatusBar backgroundColor="red"  />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#ff5c5c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OfflineScreen;
