import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import getWindDirection from '../utils/getWindDirection';

const WeatherDetails = ({ weather }) => {
  return (
    <View>
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <IconButton icon="water" size={20} />
          <Text style={styles.detailText}>Nem: {weather.main.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <IconButton icon="weather-windy" size={20} />
          <Text style={styles.detailText}>
            Rüzgar: {weather.wind.speed} m/s, {getWindDirection(weather.wind.deg)}
          </Text>
        </View>
      </View>
      <View style={styles.detailItemCenter}>
        <IconButton icon="speedometer" size={20} />
        <Text style={styles.detailText}>Basınç: {weather.main.pressure} hPa</Text>
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
