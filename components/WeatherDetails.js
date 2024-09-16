import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import getWindDirection from '../utils/getWindDirection';
import CustomText from './CustomText';
const WeatherDetails = ({ weather }) => {
  return (
    <View>
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <IconButton icon="water" size={20} />
          <CustomText fontFamily="pop" style={styles.detailText}>Nem: {weather.main.humidity}%</CustomText>
        </View>
        <View style={styles.detailItem}>
          <IconButton icon="weather-windy" size={20} />
          <CustomText fontFamily="pop" style={styles.detailText}>
            Rüzgar: {weather.wind.speed} m/s, {getWindDirection(weather.wind.deg)}
          </CustomText>
        </View>
      </View>
      <View style={styles.detailItemCenter}>
        <IconButton icon="speedometer" size={20} />
        <CustomText fontFamily="pop" style={styles.detailText}>Basınç: {weather.main.pressure} hPa</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItemCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    fontSize: 16,
  },
});

export default WeatherDetails;
