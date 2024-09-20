import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Image, View, Animated } from 'react-native';
import { Card } from 'react-native-paper';
import translateWeatherDescription from '../utils/translateWeatherDescription';
import CustomText from './CustomText';

const HourlyWeatherCard = ({ hourlyWeather = [] }) => {  // Default empty array
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <Card style={styles.containerCard}>
      <Card.Content>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16} // Smooth scrolling
        >
          <View style={styles.hourlyWeatherContainer}>
            {hourlyWeather.length > 0 ? (
              hourlyWeather.map((hourData, index) => {
                const inputRange = [
                  (index - 1) * 100, // Adjust based on item width
                  index * 100,
                  (index + 1) * 100,
                ];

                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.9, 1.0, 0.9], // Scale effect (small to large to small)
                  extrapolate: 'clamp',
                });

                return (
                  <Animated.View
                    key={index}
                    style={[styles.hourlyItem, { transform: [{ scale }] }]}
                  >
                    <CustomText fontFamily="pop" style={styles.hourText}>
                      {new Date(hourData.dt * 1000).getHours()}:00
                    </CustomText>
                    <Image
                      source={{ uri: `https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png` }}
                      style={styles.weatherIcon}
                    />
                    <CustomText fontFamily="pop" style={styles.weatherText}>
                      {translateWeatherDescription(hourData.weather[0].description)}
                    </CustomText>
                    <CustomText fontFamily="pop" style={styles.tempText}>
                      {hourData.main.temp}°C
                    </CustomText>
                    {/* Add the rain probability */}
                    <CustomText fontFamily="pop" style={styles.popText}>
                      Yağmur İhtimali: {Math.round(hourData.pop * 100)}%
                    </CustomText>
                  </Animated.View>
                );
              })
            ) : (
              <CustomText fontFamily="pop" style={styles.emptyText}>
                No weather data available.
              </CustomText>
            )}
          </View>
        </Animated.ScrollView>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  containerCard: {
    borderRadius: 10,
    margin: 5,
  },
  hourlyWeatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourlyItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  hourText: {
    fontSize: 16,
  },
  weatherText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 5,
  },
  tempText: {
    fontSize: 18,
    textAlign: 'center',
  },
  popText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HourlyWeatherCard;
