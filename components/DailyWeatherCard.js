import React from 'react';
import { View, Image, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from './CustomText'; // Assuming you are using CustomText component

const DailyWeatherCard = ({ dailyWeather }) => {
  // Format the day from the timestamp
  const getDayOfWeek = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long' };
    return date.toLocaleDateString('tr-TR', options); // Adjust locale if needed
  };

  // Render each day's weather
  const renderItem = ({ item }) => {
    return (
      <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={styles.dayCard}>
        <View style={styles.dayContainer}>
          <Text style={styles.dayText}>{getDayOfWeek(item.dt)}</Text>
          <Image
            style={styles.weatherIcon}
            source={{ uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
          />
          <Text style={styles.tempText}>
            {Math.round(item.temp.day)}°C
          </Text>
          <Text style={styles.weatherDesc}>{item.weather[0].description}</Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Günlük Hava Durumu</Text>
      <FlatList
        data={dailyWeather}
        renderItem={renderItem}
        keyExtractor={(item) => item.dt.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dayCard: {
    flex: 1,
    width: 120,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  dayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tempText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  weatherDesc: {
    fontSize: 14,
    color: '#555',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
});

export default DailyWeatherCard;
