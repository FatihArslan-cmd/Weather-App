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
import SunriseSunsetCard from './components/SunriseSunsetCard';
import DewPointCard from './components/DewPointCard';
import { WeatherProvider } from './context/WeatherContext';
import MoonPhaseCard from './components/MoonPhaseCard';
import MapComponent from './components/MapComponent';
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
  const [sunData, setSunData] = useState({ sunrise: null, sunset: null });
  const [moonData, setMoonData] = useState({ moonrise: null, moonset: null, moonPhase: null });

  // Animated value for scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getLocationAsync();
  }, []);

  const handleCitySelect = async (city) => {
    setLoading(true);
    setSelectedCity(city); // Save the selected city
  
    try {
      if (city.isCurrentLocation) {
        await fetchWeatherByLocation(location.latitude, location.longitude);
        await fetchHourlyWeather(location.latitude, location.longitude);
        await fetchAirQuality(location.latitude, location.longitude);
        await fetchUVIndex(location.latitude, location.longitude);
      } else {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric`
        );
        const weatherData = response.data;
        
        setWeather(weatherData);
        setSunData({
          sunrise: readTimeStamp(weatherData.sys.sunrise, weatherData.timezone),
          sunset: readTimeStamp(weatherData.sys.sunset, weatherData.timezone),
        });
  
        const [hourlyResponse, airQualityResponse, uvIndexResponse] = await Promise.all([
          axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&appid=${API_KEY}&units=metric`),
          axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}`),
          axios.get(`https://api.openweathermap.org/data/2.5/uvi?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}`)
        ]);
  
        setHourlyWeather(hourlyResponse.data.list.slice(0, 10));
        setAirQuality(airQualityResponse.data);
        setUVIndex(uvIndexResponse.data.value);
  
        setError('');
      }
    } catch (err) {
      setError('Hava durumu bilgisi alınamadı.');
      setWeather(null);
      setHourlyWeather([]);
      setAirQuality(null);
      setUVIndex(null);
      setSunData({ sunrise: null, sunset: null });
    } finally {
      setLoading(false);
    }
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
        setSunData(data.sunData); // Set cached sunrise/sunset data
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
      const sunData = await fetchSunriseSunset(lat, lon); // Fetch sunrise/sunset data

      // Cache data
      const dataToCache = {
        weather: weatherData,
        hourlyWeather: hourlyData,
        airQuality: airQualityData,
        uvIndex: uvIndexData,
        sunData: sunData, // Cache sunrise/sunset data

      };
      await AsyncStorage.setItem('weatherData', JSON.stringify({ data: dataToCache, timestamp: Date.now() }));

      setWeather(weatherData);
      setHourlyWeather(hourlyData);
      setAirQuality(airQualityData);
      setUVIndex(uvIndexData);
      setSunData(sunData); // Set sunrise/sunset data
    } catch (error) {
      setError('Data could not be fetched.');
      console.log('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const weatherData = response.data;
  
      // Güneş doğuşu ve batışı zamanlarını hesapla
      const sunData = {
        sunrise: readTimeStamp(weatherData.sys.sunrise, weatherData.timezone),
        sunset: readTimeStamp(weatherData.sys.sunset, weatherData.timezone),
      };
  
      // Görüş mesafesi verisini al
      const visibility = weatherData.visibility;
  
      // One Call API'den ay verilerini çek
      const moonData = await fetchMoonData(lat, lon);
  
      // Güneş ve ay verilerini set et
      setSunData(sunData);
      setMoonData(moonData); // Ay verilerini state'e set et
  
      // Görüş mesafesi verisini döndür
      return { ...weatherData, visibility };
    } catch (error) {
      console.error("Error fetching weather by location:", error);
      return null;
    }
  };
  
  // Ay verilerini çekmek için fonksiyon
  const fetchMoonData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${API_KEY}&units=metric`
      );
      const {  moon_phase } = response.data.current;
      return {
        moonPhase: moon_phase,
      };
    } catch (error) {
      console.error("Error fetching moon data:", error);
      return { moonrise: null, moonset: null, moonPhase: null };
    }
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
  const fetchSunriseSunset = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const { sunrise, sunset, timezone } = response.data.sys;
      return {
        sunrise: readTimeStamp(sunrise, timezone),
        sunset: readTimeStamp(sunset, timezone),
      };
    } catch (error) {
      console.error('Error fetching sunrise/sunset data:', error);
      return { sunrise: null, sunset: null };
    }
  };
  const readTimeStamp = (unixTimestamp, timezoneOffset) => {
    const clientOffset = new Date().getTimezoneOffset();
    const offsetTimestamp = unixTimestamp + clientOffset * 60 + timezoneOffset;
    const date = new Date(offsetTimestamp * 1000);
    return date.toLocaleTimeString();
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
    <WeatherProvider>
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
          <SunriseSunsetCard sunrise={sunData.sunrise} sunset={sunData.sunset} />
          <MoonPhaseCard 
  moonrise={moonData.moonrise} 
  moonset={moonData.moonset} 
  moonPhase={moonData.moonPhase} 
/>
          <DewPointCard visibility={weather?.visibility}/>
          <MapComponent location={location}/>
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
    </SafeAreaView></WeatherProvider>
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