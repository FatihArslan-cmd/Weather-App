import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import CustomText from './CustomText';

// Import moon phase images
import newMoon from '../assets/new-moon-phase-circle.png';
import waxingCrescent from '../assets/crescent.png';
import firstQuarter from '../assets/crescent.png';
import waxingGibbous from '../assets/crescent.png';
import fullMoon from '../assets/new-moon-phase-circle.png';
import waningGibbous from '../assets/moon.png';
import lastQuarter from '../assets/night.png';
import waningCrescent from '../assets/night.png';

const MoonPhaseCard = ({ moonPhase }) => {
  const moonCycleDays = 29.53;

  // Get current date
  const today = new Date();
  const day = today.getDate();
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const month = monthNames[today.getMonth()]; // Get month name
  const year = today.getFullYear();

  // Function to add days to the current date and get the next phase date
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Get the correct image and description for each moon phase
  const getMoonPhaseDetails = (phase) => {
    if (phase === 0 || phase === 1) return { description: 'Yeni Ay', image: newMoon, nextPhase: 'Hilal', daysUntilNext: (0.25 - phase) * moonCycleDays };
    if (phase < 0.25) return { description: 'Hilal', image: waxingCrescent, nextPhase: 'İlk Dördün', daysUntilNext: (0.25 - phase) * moonCycleDays };
    if (phase === 0.25) return { description: 'İlk Dördün', image: firstQuarter, nextPhase: 'Büyüyen Hilal', daysUntilNext: (0.5 - phase) * moonCycleDays };
    if (phase < 0.5) return { description: 'Büyüyen Hilal', image: waxingGibbous, nextPhase: 'Dolunay', daysUntilNext: (0.5 - phase) * moonCycleDays };
    if (phase === 0.5) return { description: 'Dolunay', image: fullMoon, nextPhase: 'Küçülen Dolunay', daysUntilNext: (0.75 - phase) * moonCycleDays };
    if (phase < 0.75) return { description: 'Küçülen Dolunay', image: waningGibbous, nextPhase: 'Son Dördün', daysUntilNext: (0.75 - phase) * moonCycleDays };
    if (phase === 0.75) return { description: 'Son Dördün', image: lastQuarter, nextPhase: 'Küçülen Hilal', daysUntilNext: (1 - phase) * moonCycleDays };
    if (phase < 1) return { description: 'Küçülen Hilal', image: waningCrescent, nextPhase: 'Yeni Ay', daysUntilNext: (1 - phase) * moonCycleDays };
    return { description: 'Bilinmeyen', image: null, nextPhase: 'Bilinmeyen', daysUntilNext: 0 };
  };

  const { description, image, nextPhase, daysUntilNext } = getMoonPhaseDetails(moonPhase);

  // Calculate the date of the next phase
  const nextPhaseDate = addDays(today, daysUntilNext);
  const nextPhaseDay = nextPhaseDate.getDate();
  const nextPhaseMonth = monthNames[nextPhaseDate.getMonth()];
  const nextPhaseYear = nextPhaseDate.getFullYear();

  return (
    <View style={styles.container}>
      <CustomText fontFamily="pop" style={styles.text}>
        Ay Evresi: {description}
      </CustomText>
      {image && (
        <Image source={image} style={styles.image} resizeMode="contain" />
      )}
      <CustomText fontFamily="pop" style={styles.text}>
        Sonraki Ay Evresi: {nextPhase} - {daysUntilNext.toFixed(0)} gün sonra {nextPhaseDay} {nextPhaseMonth} {nextPhaseYear}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  image: {
    width: 75,
    height: 75,
  },
});

export default MoonPhaseCard;