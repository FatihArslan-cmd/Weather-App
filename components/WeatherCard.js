import {React,useState,useEffect} from 'react';
import { Card, Text } from 'react-native-paper';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import WeatherDetails from './WeatherDetails';
import WeatherDescription from './WeatherDescription';
import CustomText from './CustomText';
import updateDateTime from '../utils/updateDateTime';

const WeatherCard = ({ weather, loading, error }) => {
  const [dateTime, setDateTime] = useState('');
  useEffect(() => {
    updateDateTime(setDateTime); // Set the date and time immediately
    const interval = setInterval(() => updateDateTime(setDateTime), 60000); // Continue updating every minute
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card style={styles.card}>
      <Card.Title title={dateTime} titleStyle={styles.cardTitle} />
      <Card.Content>
        {loading ? (
          <ActivityIndicator animating={true} style={styles.loadingIndicator} />
        ) : weather ? (
          <View>
            <View style={styles.weatherContainer}>
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` }}
                style={styles.weatherIcon}
                accessibilityLabel="Weather icon"
              />
              <View>
                <CustomText fontFamily="pop" style={styles.MaintempText}>
                  {weather.main.temp}°C
                </CustomText>
                <CustomText fontFamily="pop" style={styles.feelsLikeText}>
                  Hissedilen Sıcaklık: {weather.main.feels_like}°C
                </CustomText>
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
  weatherContainer: {
    flexDirection: 'row',
  },
  weatherIcon: {
    width: 100,
    height: 100, // Adjust if needed
  },
  MaintempText: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 10,
  },
  feelsLikeText: {
    textAlign: 'center',
    marginTop: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default WeatherCard;
