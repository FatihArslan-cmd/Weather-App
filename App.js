import React, { useState, useEffect, useCallback } from 'react';
import { View, StatusBar, StyleSheet,Text } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import RefreshScrollView from './components/RefreshScrollView';
import WeatherCard from './components/WeatherCard';
import HourlyWeatherCard from './components/HourlyWeatherCard';
import updateDateTime from './utils/updateDateTime';
import API_KEY from './API_KEY.';

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
    const interval = setInterval(() => updateDateTime(setDateTime), 60000);
    return () => clearInterval(interval);
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Konum izni reddedildi', 'Konum izni olmadan hava durumu gösterilemez.');
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
      setHourlyWeather(response.data.list.slice(0, 10));
    } catch (err) {
      setError('Saatlik hava durumu alınamadı.');
    }
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
      <RefreshScrollView refreshing={refreshing} onRefresh={onRefresh}>
        <WeatherCard dateTime={dateTime} weather={weather} loading={loading} error={error} />
        <HourlyWeatherCard hourlyWeather={hourlyWeather} />
      </RefreshScrollView>
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
});

export default App;
