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
  // Get the correct image and description for each moon phase
  const getMoonPhaseDetails = (phase) => {
    if (phase === 0 || phase === 1) return { description: 'Yeni Ay', image: newMoon };
    if (phase < 0.25) return { description: 'Hilal', image: waxingCrescent };
    if (phase === 0.25) return { description: 'İlk Dördün', image: firstQuarter };
    if (phase < 0.5) return { description: 'Büyüyen Hilal', image: waxingGibbous };
    if (phase === 0.5) return { description: 'Dolunay', image: fullMoon };
    if (phase < 0.75) return { description: 'Küçülen Dolunay', image: waningGibbous };
    if (phase === 0.75) return { description: 'Son Dördün', image: lastQuarter };
    if (phase < 1) return { description: 'Küçülen Hilal', image: waningCrescent };
    return { description: 'Bilinmeyen', image: null };
  };

  const { description, image } = getMoonPhaseDetails(moonPhase);

  return (
    <View style={styles.container}>
      <CustomText fontFamily="pop" style={styles.text}>
        Ay Evresi: {description}
      </CustomText>
      {image && (
        <Image source={image} style={styles.image} resizeMode="contain" />
      )}
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
    marginBottom: 10,
  },
  image: {
    width: 75,
    height: 75,
  },
});

export default MoonPhaseCard;
