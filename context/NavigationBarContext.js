import React, { createContext, useState, useEffect, useContext } from 'react';
import * as NavigationBar from 'expo-navigation-bar';

const AppContext = createContext();

export const NavigationBarProvider = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState('black'); // Varsayılan renk

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(backgroundColor);
  }, [backgroundColor]);

  return (
    <AppContext.Provider value={{ backgroundColor, setBackgroundColor }}>
      {children}
    </AppContext.Provider>
  );
};

export const useNavigationBarContext = () => useContext(AppContext);