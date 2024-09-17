import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import CustomText from './CustomText';
import getWindDirection from '../utils/getWindDirection';

const WeatherDetails = ({ weather }) => {
  return (
    <View  style={styles.container}>
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <IconButton icon="water" size={20} />
          <CustomText fontFamily="pop" style={styles.detailText}>Nem: {weather.main.humidity}%</CustomText>
        </View>
        <View style={styles.detailItem}>
          <IconButton icon="weather-windy" size={20} />
          <View style={{flexDirection:''}}>
          <CustomText fontFamily="pop" style={styles.detailText}>Rüzgar: {weather.wind.speed} m/s</CustomText>
          <CustomText fontFamily="pop" style={styles.detailText}>
            {getWindDirection(weather.wind.deg)}
          </CustomText>
          </View>
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
  container:{
    flex:1
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical:5
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
