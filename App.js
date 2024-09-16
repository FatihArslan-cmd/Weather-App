import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, RefreshControl,Image } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { Card, Text, IconButton } from 'react-native-paper';
import API_KEY from './API_KEY.';

const getWindDirection = (degree) => {
  if (degree > 337.5 || degree <= 22.5) return 'Kuzey';
  if (degree > 22.5 && degree <= 67.5) return 'Kuzeydoğu';
  if (degree > 67.5 && degree <= 112.5) return 'Doğu';
  if (degree > 112.5 && degree <= 157.5) return 'Güneydoğu';
  if (degree > 157.5 && degree <= 202.5) return 'Güney';
  if (degree > 202.5 && degree <= 247.5) return 'Güneybatı';
  if (degree > 247.5 && degree <= 292.5) return 'Batı';
  return 'Kuzeybatı';
};

// Hava durumu açıklamalarını Türkçe'ye çevirme
const translateWeatherDescription = (description) => {
  switch (description) {
    case 'clear sky':
      return 'Açık hava';
    case 'few clouds':
      return 'Az bulutlu';
    case 'scattered clouds':
      return 'Parçalı bulutlu';
    case 'broken clouds':
      return 'Yer yer bulutlu';
    case 'shower rain':
      return 'Sağanak yağmur';
    case 'rain':
      return 'Yağmur';
    case 'thunderstorm':
      return 'Fırtına';
      case 'light rain':
        return 'Hafif Yağmurlu';
    case 'snow':
      return 'Kar';
      case 'overcast clouds':
        return 'Kapalı Bulutlu';
    case 'mist':
      return 'Sis';
    default:
      return description;
  }
};

const App = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const [hourlyWeather, setHourlyWeather] = useState([]);

  useEffect(() => {
    getLocationAsync();
    const interval = setInterval(updateDateTime, 60000); // 1 dakika aralıklarla saati güncelle
    return () => clearInterval(interval); // Temizleme
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Konum izni reddedildi', 'Konum izni verilmeden hava durumu gösterilemez.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
    fetchWeatherByLocation(location.coords.latitude, location.coords.longitude);
    fetchHourlyWeather(location.coords.latitude, location.coords.longitude);
  };

  const fetchWeatherByLocation = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      console.log(err.response?.data || err.message);
      setError('Hava durumu bilgisi alınamadı.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchHourlyWeather = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setHourlyWeather(response.data.list.slice(0, 10)); // İlk 10 saati al
    } catch (err) {
      console.log(err.response?.data || err.message);
      setError('Saatlik hava durumu alınamadı.');
    }
  };

  const updateDateTime = () => {
    const now = new Date();
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    setDateTime(now.toLocaleString('tr-TR', options));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (location) {
      fetchWeatherByLocation(location.latitude, location.longitude);
      fetchHourlyWeather(location.latitude, location.longitude);
    }
    setRefreshing(false);
  }, [location]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Ana Hava Durumu Kartı */}
        <Card style={styles.card}>
          <Card.Title title={dateTime} titleStyle={styles.cardTitle} />
          <Card.Content>
            {loading ? (
              <ActivityIndicator animating={true} style={styles.loadingIndicator} />
            ) : weather ? (
              <View>
                <View style={{flexDirection:'row'}}>
  <Image 
    source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` }} 
    style={{ width: 100}} 
  />
  <View>
  <Text style={styles.MaintempText}>{weather.main.temp}°C</Text>
  <Text style={styles.feelsLikeText}>Hissedilen Sıcaklık: {weather.main.feels_like}°C</Text>
  <Text style={styles.feelsLikeText}>{translateWeatherDescription(weather.weather[0].description)}</Text>
  </View>
  </View>
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
                <View style={{alignItems:'center'}}>
                <View style={styles.detailItem}>
                  <IconButton icon="speedometer" size={20} />
                  <Text style={styles.detailText}>Basınç: {weather.main.pressure} hPa</Text>
                </View>
                </View>
              </View>
            ) : (
              error && <Text style={styles.error}>{error}</Text>
            )}
          </Card.Content>
        </Card>
        <Card style={styles.hourlyCard}>
          <Card.Content>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.hourlyWeatherContainer}>
                {hourlyWeather.map((hourData, index) => (
                  <View key={index} style={styles.hourlyItem}>
                    <Text style={styles.hourText}>{new Date(hourData.dt * 1000).getHours()}:00</Text>
                    <Text style={styles.weatherText}>{translateWeatherDescription(hourData.weather[0].description)}</Text>
                    <Text style={styles.tempText}>{hourData.main.temp}°C</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginBottom: 10,
    elevation:5
  },
  hourlyCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weatherText: {
    fontSize: 18,
    textAlign: 'center',
  },
  MaintempText:{
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  tempText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  feelsLikeText: {
    textAlign: 'center',
    marginVertical: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
  },
  hourlyWeatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourlyItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  hourText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default App;
