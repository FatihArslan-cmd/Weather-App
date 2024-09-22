import React, { createContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View } from 'react-native';
import OfflineScreen from '../utils/OfflineScreen';
export const NetInfoContext = createContext();

export const NetInfoProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetInfoContext.Provider value={{ isOffline }}>
      <View style={{ flex: 1 }}>
        {children}
        {isOffline && <OfflineScreen />} 
      </View>
    </NetInfoContext.Provider>
  );
};
