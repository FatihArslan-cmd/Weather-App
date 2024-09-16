import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { Menu, Divider, Provider } from 'react-native-paper';

const API_KEY = '';

const cities = [
  { name: 'Istanbul', value: 'Istanbul' },
  { name: 'Ankara', value: 'Ankara' },
  { name: 'Izmir', value: 'Izmir' },
  { name: 'New York', value: 'New York' },
  { name: 'London', value: 'London' },
  { name: 'Tokyo', value: 'Tokyo' },
  { name: 'Paris', value: 'Paris' },
];

const App = () => {
  const [visible, setVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(cities[0].value);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const selectCity = (city) => {
    setSelectedCity(city);
    closeMenu();
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      console.log(err.response?.data || err.message);  // Logs more detailed error information
      setError('Hava durumu bilgisi alınamadı.');
      setWeather(null);
    }
  };
  

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Hava Durumu Uygulaması</Text>

        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Button title={`Şehir: ${selectedCity}`} onPress={openMenu} />}
        >
          {cities.map((city) => (
            <Menu.Item
              key={city.value}
              onPress={() => selectCity(city.value)}
              title={city.name}
            />
          ))}
          <Divider />
        </Menu>

        <Button title="Hava Durumunu Getir" onPress={fetchWeather} />

        {weather && (
          <View style={styles.result}>
            <Text style={styles.weatherText}>Şehir: {weather.name}</Text>
            <Text style={styles.weatherText}>
              Sıcaklık: {weather.main.temp}°C
            </Text>
            <Text style={styles.weatherText}>
              Hava: {weather.weather[0].description}
            </Text>
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#dcdcdc',
    borderRadius: 5,
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default App;
