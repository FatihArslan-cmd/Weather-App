import React from 'react';
import { Card, Text } from 'react-native-paper';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import WeatherDetails from './WeatherDetails';
import WeatherDescription from './WeatherDescription';
const WeatherCard = ({ dateTime, weather, loading, error }) => {
  return (
    <Card style={styles.card}>
      <Card.Title title={dateTime} titleStyle={styles.cardTitle} />
      <Card.Content>
        {loading ? (
          <ActivityIndicator animating={true} style={styles.loadingIndicator} />
        ) : weather ? (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` }}
                style={{ width: 100 }}
              />
              <View>
                <Text style={styles.MaintempText}>{weather.main.temp}°C</Text>
                <Text style={styles.feelsLikeText}>Hissedilen Sıcaklık: {weather.main.feels_like}°C</Text>
                <WeatherDescription description={weather.weather[0].description} />
              </View>
            </View>
            <WeatherDetails weather={weather} />
          </View>
        ) : (
          error && <Text style={styles.error}>{error}</Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginBottom: 10,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  MaintempText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default WeatherCard;
