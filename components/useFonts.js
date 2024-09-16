import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';

const useFonts = (fontMap) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadFonts = async () => {
      try {
        await Font.loadAsync(fontMap);
        if (isMounted) setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };

    loadFonts();

    return () => {
      isMounted = false;
    };
  }, [fontMap]);

  return fontsLoaded;
};

export default useFonts;
