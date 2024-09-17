import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, Modal, Image,StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import RefreshScrollView from './components/RefreshScrollView';
import WeatherCard from './components/WeatherCard';
import HourlyWeatherCard from './components/HourlyWeatherCard';
import LocationCard from './components/LocationCard';
import { Fold } from 'react-native-animated-spinkit';
import API_KEY from './API_KEY';
import SunriseSunsetCard from './components/SunriseSunsetCard';
const App = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [address, setAddress] = useState('');

  useEffect(() => {
    getLocationAsync();;
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Konum izni reddedildi', 'Konum izni olmadan hava durumu gösterilemez.');
      setLoading(false); // Hide loading if permission is not granted
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);

    // Reverse geocoding to get street-level location
    const addressArray = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (addressArray.length > 0) {
      const { street, city, region } = addressArray[0];
      setAddress(`${street}, ${city}, ${region}`);
    }

    await fetchWeatherByLocation(location.coords.latitude, location.coords.longitude);
    await fetchHourlyWeather(location.coords.latitude, location.coords.longitude);
    setLoading(false); // Hide loading after fetching data
  };

  const fetchWeatherByLocation = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      const weatherData = response.data;
      const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(); // Convert UNIX timestamp to readable time
      const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(); // Convert UNIX timestamp to readable time
  
      setWeather({
        ...weatherData,
        sunrise,
        sunset,
      });
      
      setError('');
    } catch (err) {
      setError('Hava durumu bilgisi alınamadı.');
      setWeather(null);
    }
  };
  
  const handleCitySelect = async (city) => {
    setLoading(true); // Show loading while fetching data
    if (city.isCurrentLocation) {
      // Current location was selected
      await fetchWeatherByLocation(location.latitude, location.longitude);
      await fetchHourlyWeather(location.latitude, location.longitude);
    } else {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);
  
        // Fetch hourly weather for the selected city
        const hourlyResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&appid=${API_KEY}&units=metric`
        );
        setHourlyWeather(hourlyResponse.data.list.slice(0, 10));
        
        setError('');
      } catch (err) {
        setError('Hava durumu bilgisi alınamadı.');
        setWeather(null);
        setHourlyWeather([]);
      }
    }
    setLoading(false); // Hide loading after fetching data
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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#87CEEB', '#00BFFF']}
        style={styles.gradient}
      >

        <RefreshScrollView refreshing={refreshing} onRefresh={onRefresh}>
          <LocationCard address={address} onSelectCity={handleCitySelect} />
          <WeatherCard  weather={weather} loading={loading} error={error} />
          <HourlyWeatherCard hourlyWeather={hourlyWeather} />
          <StatusBar
        backgroundColor="#87CEEB"
        barStyle="light-content"
        translucent   
      />
        </RefreshScrollView>
      </LinearGradient>

      <Modal
        transparent={true}
        animationType="fade"
        visible={loading}
      >
        <View style={styles.loadingOverlay}>
        <Image
      source={require('./assets/icon.png')}
      style={{ width: 200, height: 200 }}
    />
          <Fold size={48} color="#f5b406" />
          <StatusBar
        backgroundColor="#e9e6d9"
        barStyle="light-content"
        translucent   
      />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9e6d9',
  },
});

export default App;
