import React, { createContext, useState, useContext } from 'react';

// Weather Context'ini oluştur
const WeatherContext = createContext();

// Weather Context Provider'ı
export const WeatherProvider = ({ children }) => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  return (
    <WeatherContext.Provider value={{ temperature, setTemperature, humidity, setHumidity }}>
      {children}
    </WeatherContext.Provider>
  );
};

// Context'i kullanmak için bir kanca
export const useWeather = () => useContext(WeatherContext);
