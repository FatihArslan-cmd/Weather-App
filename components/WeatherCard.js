import React, { useState, useEffect } from 'react';
import { Card, Text } from 'react-native-paper';
import { View, StyleSheet, Image,TouchableOpacity } from 'react-native';
import WeatherDetails from './WeatherDetails';
import WeatherDescription from './WeatherDescription';
import CustomText from './CustomText';
import updateDateTime from '../utils/updateDateTime';
import { useWeather } from '../context/WeatherContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // You can choose any icon set, such as MaterialIcons, FontAwesome, etc.
const WeatherCard = ({ weather, error }) => {
  const [dateTime, setDateTime] = useState('');
  const { setTemperature, setHumidity } = useWeather(); // Context'ten setter'ları al
  const navigation = useNavigation(); 

  useEffect(() => {
    updateDateTime(setDateTime); // Set the date and time immediately
    const interval = setInterval(() => updateDateTime(setDateTime), 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (weather) {
      const temperature = weather.main.temp; // Sıcaklık (°C)
      const humidity = weather.main.humidity; // Bağıl nem oranı (%)
      setTemperature(temperature); // Sıcaklığı context'e kaydet
      setHumidity(humidity); // Nem oranını context'e kaydet
    }
  }, [weather]);

  return (
    <Card style={styles.card}>
        <TouchableOpacity 
         style={styles.settingsContainer}
         onPress={() => navigation.navigate('SettingsScreen')} // Basıldığında ayarlar ekranına git
 >
        <Icon name="settings-sharp" size={32} color="black" />
        </TouchableOpacity>
      <Card.Title title={dateTime} titleStyle={styles.cardTitle} />
      <Card.Content>
        {weather ? (
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
  settingsContainer: {
    position: 'absolute',
    zIndex: 101, // Diğer bileşenlerin üzerinde olmasını sağlar
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
    height: 100,
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
