import React from 'react';
import { Text, StyleSheet } from 'react-native';
import translateWeatherDescription from '../utils/translateWeatherDescription';

const WeatherDescription = ({ description }) => {
  const translatedDescription = translateWeatherDescription(description);

  return (
    <Text style={styles.descriptionText}>{translatedDescription}</Text>
  );
};

const styles = StyleSheet.create({
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 5,
  },
});

export default WeatherDescription;
