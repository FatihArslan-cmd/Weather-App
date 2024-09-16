// CustomText.js
import React from 'react';
import { Text } from 'react-native';
import useFonts from './useFonts'; // Ensure you import the hook

const CustomText = ({ children, style, fontFamily = 'lato' }) => {
  const fontsLoaded = useFonts({
    'pop': require('../assets/fonts/Poppins-Bold.ttf'),
    'bungee': require('../assets/fonts/BungeeSpice-Regular.ttf'),
    'lato': require('../assets/fonts/Lato-Regular.ttf'),
    'lato-bold': require('../assets/fonts/Lato-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <Text style={style}>{children}</Text>;
  }

  return (
    <Text style={[style, { fontFamily }]}>
      {children}
    </Text>
  );
};

export default React.memo(CustomText);
