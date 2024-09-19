import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import API_KEY from '../API_KEY';
import CustomText from './CustomText';
const lat = 41.0082;  // Latitude for Istanbul
const lon = 28.9784;  // Longitude for Istanbul

const FiveDayWeather = () => {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        // Filter for noon (12:00) each day
        const dailyData = response.data.list.filter(item => {
          return new Date(item.dt * 1000).getHours() === 12;  // 12:00
        });

        setForecast(dailyData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeather();
  }, []);

  const getDayLabel = (date) => {
    const today = new Date();
    const forecastDate = new Date(date * 1000);

    // For today show 'Bugün'
    if (forecastDate.toDateString() === today.toDateString()) {
      return 'Bugün';
    }

    // For tomorrow show 'Yarın'
    if (forecastDate.getDate() === today.getDate() + 1) {
      return 'Yarın';
    }

    // For other days show formatted date
    return forecastDate.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={forecast}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <CustomText fontFamily='pop' style={styles.date}>
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
                <CustomText fontFamily='pop'>{item.main.temp}°C</CustomText>
                <CustomText fontFamily='pop'>{item.weather[0].description}</CustomText>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
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
});

export default FiveDayWeather;
