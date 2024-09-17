import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  Image,
  StatusBar,
  Animated,
  ScrollView,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import RefreshScrollView from './components/RefreshScrollView';
import WeatherCard from './components/WeatherCard';
import HourlyWeatherCard from './components/HourlyWeatherCard';
import LocationCard from './components/LocationCard';
import { Fold } from 'react-native-animated-spinkit';
import API_KEY from './API_KEY';
import AirQualityScreen from './components/AirQuality';
import UVIndexScreen from './components/UVIndexScreen';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const App = () => {
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [address, setAddress] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [uvIndex, setUVIndex] = useState(null);

  // Animated value for scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getLocationAsync();
  }, []);

  const handleCitySelect = async (city) => {
    setLoading(true);
    setSelectedCity(city); // Save the selected city

    if (city.isCurrentLocation) {
      // Mevcut konum
      await fetchWeatherByLocation(location.latitude, location.longitude);
      await fetchHourlyWeather(location.latitude, location.longitude);
      await fetchAirQuality(location.latitude, location.longitude);
      await fetchUVIndex(location.latitude, location.longitude); // UV Endeksi
    } else {
      // Şehir ismiyle hava durumu
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);

        const hourlyResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&appid=${API_KEY}&units=metric`
        );
        setHourlyWeather(hourlyResponse.data.list.slice(0, 10));

        const airQualityResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${API_KEY}`
        );
        setAirQuality(airQualityResponse.data);

        // UV Endeksi
        const uvIndexResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/uvi?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${API_KEY}`
        );
        setUVIndex(uvIndexResponse.data.value);

        setError('');
      } catch (err) {
        setError('Hava durumu bilgisi alınamadı.');
        setWeather(null);
        setHourlyWeather([]);
        setAirQuality(null); // Hata durumunda hava kalitesini sıfırla
        setUVIndex(null); // Hata durumunda UV endeksini sıfırla
      }
    }
    setLoading(false);
  };

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Konum izni reddedildi', 'Konum izni olmadan hava durumu gösterilemez.');
      setLoading(false);
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);

    const addressArray = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (addressArray.length > 0) {
      const { street, city, region } = addressArray[0];
      setAddress(`${street}, ${city}, ${region}`);
    }

    // Check cache
    const cachedData = await AsyncStorage.getItem('weatherData');
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setWeather(data.weather);
        setHourlyWeather(data.hourlyWeather);
        setAirQuality(data.airQuality);
        setUVIndex(data.uvIndex);
        setLoading(false);
        return;
      }
    }

    await fetchWeatherData(location.coords.latitude, location.coords.longitude);
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      const weatherData = await fetchWeatherByLocation(lat, lon);
      const hourlyData = await fetchHourlyWeather(lat, lon);
      const airQualityData = await fetchAirQuality(lat, lon);
      const uvIndexData = await fetchUVIndex(lat, lon);

      // Cache data
      const dataToCache = {
        weather: weatherData,
        hourlyWeather: hourlyData,
        airQuality: airQualityData,
        uvIndex: uvIndexData,
      };
      await AsyncStorage.setItem('weatherData', JSON.stringify({ data: dataToCache, timestamp: Date.now() }));

      setWeather(weatherData);
      setHourlyWeather(hourlyData);
      setAirQuality(airQualityData);
      setUVIndex(uvIndexData);
    } catch (error) {
      setError('Data could not be fetched.');
      console.log('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async (lat, lon) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return {
      ...response.data,
      sunrise: new Date(response.data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(response.data.sys.sunset * 1000).toLocaleTimeString(),
    };
  };

  const fetchHourlyWeather = async (lat, lon) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return response.data.list.slice(0, 10);
  };

  const fetchAirQuality = async (lat, lon) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    return response.data;
  };

  const fetchUVIndex = async (lat, lon) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    return response.data.value;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (selectedCity) {
      handleCitySelect(selectedCity);
    }
    setRefreshing(false);
  }, [selectedCity, location]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#87CEEB', '#00BFFF']} style={styles.gradient}>
        <View style={styles.locationCardContainer}>
          <LocationCard address={address} onSelectCity={handleCitySelect} />
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false } // Change to `true` if you're animating transform properties only
          )}
        >
          <WeatherCard weather={weather} />
          <HourlyWeatherCard hourlyWeather={hourlyWeather} />
          <AirQualityScreen airQuality={airQuality} />
          <UVIndexScreen uvIndex={uvIndex} />
          <StatusBar backgroundColor="#87CEEB" barStyle="light-content" translucent />
        </ScrollView>
      </LinearGradient>

      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loadingOverlay}>
          <Image source={require('./assets/icon.png')} style={{ width: 200, height: 200 }} />
          <Fold size={48} color="#f5b406" />
          <StatusBar backgroundColor="#e9e6d9" barStyle="light-content" translucent />
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
  },
  locationCardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollContainer: {
    paddingTop: 120, // Adjust this value to fit the height of the LocationCard
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9e6d9',
  },
});

export default App;
