import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  Image,
  Animated,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import WeatherCard from './WeatherCard';
import HourlyWeatherCard from './HourlyWeatherCard';
import LocationCard from './LocationCard';
import { Fold } from 'react-native-animated-spinkit';
import API_KEY from '../API_KEY';
import AirQualityScreen from './AirQuality';
import UVIndexScreen from './UVIndexScreen';
import SunriseSunsetCard from './SunriseSunsetCard';
import DewPointCard from './DewPointCard';
import { WeatherProvider } from '../context/WeatherContext';
import MoonPhaseCard from './MoonPhaseCard';
import SocialShareBar from './SocialShareBar';
import MapComponent from './MapComponent';
import Icon from 'react-native-vector-icons/Ionicons'; // You can choose any icon set, such as MaterialIcons, FontAwesome, etc.
import Footer from './Footer';
import FiveDayWeather from './FiveDayWeatherCard';
import { useNavigation } from '@react-navigation/native';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const MainScreen = () => {
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
  const [sunData, setSunData] = useState({ sunrise: null, sunset: null, timezone: null });
  const [moonData, setMoonData] = useState({ moonrise: null, moonset: null, moonPhase: null });
  const [forecast, setForecast] = useState(null); // 5-day forecast state

  
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getLocationAsync();
  }, []);

  const handleCitySelect = async (city) => {
    setLoading(true);
    setSelectedCity(city);

    try {
      if (city.isCurrentLocation) {
        await fetchWeatherByLocation(location.latitude, location.longitude);
        await fetchHourlyWeather(location.latitude, location.longitude);
        await fetchAirQuality(location.latitude, location.longitude);
        await fetchUVIndex(location.latitude, location.longitude);
        await fetchFiveDayWeather(location.latitude, location.longitude);
        await fetchMoonData(location.latitude, location.longitude);
        await fetchSunriseSunset(location.latitude, location.longitude);
      } else {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric`
        );
        const weatherData = response.data;
        const { lat, lon } = weatherData.coord;
        setLocation({ latitude: lat, longitude: lon });

        setWeather(weatherData);
        setSunData({
          sunrise: weatherData.sys.sunrise, // Pass raw data
          sunset: weatherData.sys.sunset,   // Pass raw data
          timezone: weatherData.timezone,   // Update timezone here with the correct data
        });

        const [hourlyResponse, airQualityResponse, uvIndexResponse, forecastData] = await Promise.all([
          axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&appid=${API_KEY}&units=metric`),
          axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
          axios.get(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
          fetchFiveDayWeather(lat, lon)
        ]);

        setHourlyWeather(hourlyResponse.data.list.slice(0, 10));
        setAirQuality(airQualityResponse.data);
        setUVIndex(uvIndexResponse.data.value);
        setForecast(forecastData);

        setError('');
      }
    } catch (err) {
      setError('Hava durumu bilgisi alınamadı.');
      setWeather(null);
      setHourlyWeather([]);
      setAirQuality(null);
      setUVIndex(null);
      setSunData({ sunrise: null, sunset: null });
      setForecast(null);
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

    const cachedData = await AsyncStorage.getItem('weatherData');
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setWeather(data.weather);
        setHourlyWeather(data.hourlyWeather);
        setAirQuality(data.airQuality);
        setUVIndex(data.uvIndex);
        setSunData(data.sunData);
        setForecast(data.forecast); // Set forecast data from cache
        setLoading(false);
        return;
      }
    }

    await fetchWeatherData(location.coords.latitude, location.coords.longitude);
  };
  const fetchWeatherByLocation = async (lat, lon) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return {
      ...response.data,
    };
  };
  const fetchWeatherData = async (lat, lon) => {
    try {
      const weatherData = await fetchWeatherByLocation(lat, lon);
      const hourlyData = await fetchHourlyWeather(lat, lon);
      const airQualityData = await fetchAirQuality(lat, lon);
      const uvIndexData = await fetchUVIndex(lat, lon);
      const sunData = await fetchSunriseSunset(lat, lon);
      const forecastData = await fetchFiveDayWeather(lat, lon);
      setForecast(forecastData.length ? forecastData : null); // Eğer veri varsa, aksi takdirde null
      
      const dataToCache = {
        weather: weatherData,
        hourlyWeather: hourlyData,
        airQuality: airQualityData,
        uvIndex: uvIndexData,
        sunData: sunData,
        forecast: forecastData, // Cache forecast data
      };

      await AsyncStorage.setItem('weatherData', JSON.stringify({ data: dataToCache, timestamp: Date.now() }));

      setWeather(weatherData);
      setHourlyWeather(hourlyData);
      setAirQuality(airQualityData);
      setUVIndex(uvIndexData);
      setSunData(sunData);
      setForecast(forecastData); // Set forecast state
    } catch (error) {
      setError('Data could not be fetched.');
      console.log('Error fetching weather data:', error);
    } finally {
      setLoading(false);
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
  const fetchFiveDayWeather = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const dailyData = response.data.list.filter(item => {
        return new Date(item.dt * 1000).getHours() === 12; // 12:00
      });

      return dailyData;
    } catch (error) {
      console.error('Error fetching 5-day weather data:', error);
      return [];
    }
  };
  const fetchSunriseSunset = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const { sunrise, sunset } = response.data.sys;
      const { timezone } = response.data;
      return {
        sunrise, // Timestamp olarak döndürülüyor
        sunset,  // Timestamp olarak döndürülüyor
        timezone // Zaman dilimini de döndür
      };
    } catch (error) {
      console.error('Error fetching sunrise/sunset data:', error);
      return { sunrise: null, sunset: null, timezone: null };
    }
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
      if (selectedCity.isCurrentLocation) {
        fetchWeatherByLocation(location.latitude, location.longitude);
      } else {
        handleCitySelect(selectedCity); // Re-fetch data for the selected city
      }
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
          <FiveDayWeather forecast={forecast} />
          <AirQualityScreen airQuality={airQuality} />
          <UVIndexScreen uvIndex={uvIndex} />
          <SunriseSunsetCard sunrise={sunData.sunrise} sunset={sunData.sunset} timezone={sunData.timezone}  // timezone prop'unu geç
 />
          <MoonPhaseCard 
             moonrise={moonData.moonrise} 
             moonset={moonData.moonset} 
             moonPhase={moonData.moonPhase} 
           />
          <DewPointCard visibility={weather?.visibility}/>
          <MapComponent location={location}/>
          <SocialShareBar/>
          <Footer/>
          <StatusBar backgroundColor="#87CEEB" />
          </ScrollView>
      </LinearGradient>

      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loadingOverlay}>
          <Image source={require('../assets/icon.png')} style={{ width: 200, height: 200 }} />
          <Fold size={48} color="#f5b406" />
          <StatusBar backgroundColor="#e9e6d9"  />
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
settingsContainer: {
  position: 'absolute',
  zIndex: 101, // Diğer bileşenlerin üzerinde olmasını sağlar
},
  settingsText: {
    color: '#fff',
    marginRight: 8, // Space between the text and the icon
    fontSize: 16,
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

export default MainScreen;