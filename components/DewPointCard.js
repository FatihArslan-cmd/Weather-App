import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWeather } from '../context/WeatherContext'; // Context'ten import
import CustomText from './CustomText';
const calculateDewPoint = (temperature, humidity) => {
  return temperature - ((100 - humidity) / 5);
};

const DewPointCard = ( {visibility}) => {
  const { temperature, humidity } = useWeather(); 

  const dewPoint = temperature !== null && humidity !== null ? calculateDewPoint(temperature, humidity) : null;

  return (
    <View style={styles.container}>
      <CustomText fontFamily='pop' style={styles.text}>
        Çiy Noktası: {dewPoint !== null ? dewPoint.toFixed(2) + '°C' : 'Hesaplanıyor...'}
      </CustomText>
      <CustomText fontFamily='pop' style={styles.text}>
        Görüş Mesafesi: {visibility ? `${visibility / 1000} km` : 'N/A'}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DewPointCard;
