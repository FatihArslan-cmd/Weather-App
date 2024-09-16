import React from 'react';
import { ScrollView, StyleSheet, Text, Image, View } from 'react-native';
import { Card } from 'react-native-paper';
import translateWeatherDescription from '../utils/translateWeatherDescription';

const HourlyWeatherCard = ({ hourlyWeather }) => {
  return (
    <Card style={styles.containerCard}>
      <Card.Content>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.hourlyWeatherContainer}>
            {hourlyWeather.map((hourData, index) => (
              <View key={index} style={styles.hourlyItem}>
                <Text style={styles.hourText}>{new Date(hourData.dt * 1000).getHours()}:00</Text>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png` }}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherText}>
                  {translateWeatherDescription(hourData.weather[0].description)}
                </Text>
                <Text style={styles.tempText}>{hourData.main.temp}°C</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  containerCard: {
    borderRadius: 10,
  },
  hourlyWeatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourlyItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  hourText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weatherText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 5,
  },
  tempText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HourlyWeatherCard;
