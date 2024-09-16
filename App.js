import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Menu, Divider, Provider as PaperProvider, Card, Text, Button } from 'react-native-paper';
import API_KEY from './API_KEY.'; // Your API key

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const selectCity = (city) => {
    setSelectedCity(city);
    closeMenu();
  };

  const fetchWeather = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      console.log(err.response?.data || err.message); // Logs more detailed error information
      setError('Hava durumu bilgisi alınamadı.');
      setWeather(null);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Hava Durumu Uygulaması" titleStyle={styles.cardTitle} />
          <Card.Content>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={<Button onPress={openMenu} mode="outlined" labelStyle={styles.cityLabel}>{`Şehir: ${selectedCity}`}</Button>}
            >
              {cities.map((city) => (
                <Menu.Item key={city.value} onPress={() => selectCity(city.value)} title={city.name} />
              ))}
              <Divider />
            </Menu>

            <Button
              mode="contained"
              onPress={fetchWeather}
              style={styles.button}
              color="#87CEEB" // Match button color to background (SteelBlue tone)
              labelStyle={styles.buttonLabel}
            >
              Hava Durumunu Göster
            </Button>

            {loading ? (
              <ActivityIndicator animating={true} style={styles.loadingIndicator} />
            ) : weather ? (
              <View style={styles.result}>
                <Text style={styles.weatherText}>Şehir: {weather.name}</Text>
                <Text style={styles.weatherText}>Sıcaklık: {weather.main.temp}°C</Text>
                <Text style={styles.weatherText}>Hava: {weather.weather[0].description}</Text>
              </View>
            ) : (
              error && <Text style={styles.error}>{error}</Text>
            )}
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky color background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  cityLabel: {
    fontSize: 18,
    color: '#4682B4', // Matches the button color (SteelBlue)
  },
  button: {
    marginTop: 20,
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff', // White text for better contrast
  },
  loadingIndicator: {
    marginTop: 20,
  },
  result: {
    marginTop: 20,
  },
  weatherText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 25,
  },
  error: {
    marginTop: 20,
    color: 'red',
    textAlign: 'center',
  },
});

export default App;
