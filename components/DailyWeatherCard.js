import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native'; // Import Text from react-native
import CustomText from './CustomText'; // Ensure CustomText wraps a <Text> component

const DailyWeatherCard = ({ dailyWeather }) => {
  return (
    <View style={styles.containerCard}>
      {dailyWeather.map((dayData, index) => (
        <View key={index} style={styles.dayContainer}>
          {/* Make sure CustomText uses <Text> internally */}
          <CustomText fontFamily="pop" style={styles.dayText}>
            
          </CustomText>

          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png` }}
            style={styles.weatherIcon}
          />

          {/* Wrapping with <Text> to fix the issue */}
          <Text style={styles.tempText}>
            h
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  containerCard: {
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff', // Add background color to replicate card look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  dayText: {
    fontSize: 16,
    flex: 1,
  },
  tempText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
});

export default DailyWeatherCard;
