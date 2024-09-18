import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const Footer = () => {
  return (
    <LinearGradient
      colors={['#00BFFF', '#f0f0f0']} // Define the gradient colors
      style={styles.container}
    >
      <CustomText fontFamily="pop" style={styles.text}>Weather App</CustomText>
      <View style={styles.iconsContainer}>
        <Icon name="facebook" size={30} color="gray" />
        <Icon name="youtube-play" size={30} color="gray" />
        <Icon name="instagram" size={30} color="gray" />
        <Icon name="linkedin" size={30} color="gray" />
      </View>
      <CustomText fontFamily="pop" style={styles.text}>© 2024 Weather App</CustomText>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
  },
  text: {
    color: 'gray',
    fontSize: 20,
    marginBottom: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 10,
  },
});

export default Footer;
