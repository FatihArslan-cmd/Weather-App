import React from 'react';
import { Text, StyleSheet } from 'react-native';
import translateWeatherDescription from '../utils/translateWeatherDescription';
import CustomText from './CustomText';
const WeatherDescription = ({ description }) => {
  const translatedDescription = translateWeatherDescription(description);

  return (
    <CustomText fontFamily="pop" style={styles.descriptionText}>{translatedDescription}</CustomText>
  );
};

const styles = StyleSheet.create({
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
});

export default WeatherDescription;
