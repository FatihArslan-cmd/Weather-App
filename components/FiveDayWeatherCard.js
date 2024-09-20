import translateWeatherDescription from '../utils/translateWeatherDescription';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomText from './CustomText'; // Assuming CustomText is correctly defined elsewhere

const FiveDayWeather = ({ forecast }) => {

  // Function to generate readable labels for the day
  const getDayLabel = (timestamp) => {
    const today = new Date();
    const forecastDate = new Date(timestamp * 1000); // Convert from UNIX timestamp

    // If the forecast is for today
    if (forecastDate.toDateString() === today.toDateString()) {
      return 'Bugün';
    }

    // Calculate tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // If the forecast is for tomorrow
    if (forecastDate.toDateString() === tomorrow.toDateString()) {
      return 'Yarın';
    }

    // For other days, return formatted day in Turkish
    return forecastDate.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Safeguard against null or undefined forecast data
  if (!forecast) {
    return (
      <View style={styles.container}>
        <CustomText fontFamily="pop" style={styles.noDataText}>
          Hava durumu verisi mevcut değil.
        </CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {forecast.map((item) => (
        <View key={item.dt.toString()} style={styles.card}>
          <CustomText fontFamily="pop" style={styles.date}>
            {getDayLabel(item.dt)}
          </CustomText>
          <View style={styles.row}>
            <Image
              style={styles.icon}
              source={{
                uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
              }}
            />
            <View style={styles.textContainer}>
              <CustomText fontFamily="pop">{item.main.temp}°C</CustomText>
              {/* Hava durumu açıklamasını Türkçe'ye çevir */}
              <CustomText fontFamily="pop">
                {translateWeatherDescription(item.weather[0].description)}
              </CustomText>
              {/* Add the rain probability */}
              <CustomText fontFamily="pop" style={styles.popText}>
                Yağmur İhtimali: {Math.round(item.pop * 100)}%
              </CustomText>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 20,
  },
  card: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 8,
  },
  date: {
    fontSize: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 10,
  },
  icon: {
    width: 80,
    height: 80,
  },
  popText: {
    fontSize: 11,
    textAlign: 'center',
  },
});

export default FiveDayWeather;
