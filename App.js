import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import MainScreen from './components/MainScreen';
import SettingsScreen from './components/SettingsScreen';
import { enableScreens } from 'react-native-screens';
import { NetInfoProvider } from './context/NetInfoContext';
import OfflineScreen from './utils/OfflineScreen';
enableScreens();

const Stack = createStackNavigator();

const App = () => {
  return (
    <NetInfoProvider>
     <NavigationContainer>
      <Stack.Navigator
         screenOptions={{
         ...TransitionPresets.SlideFromRightIOS,
          headerShown: false,}}>
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="OfflineScreen" component={OfflineScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      </Stack.Navigator>
     </NavigationContainer>
    </NetInfoProvider>
  );
};

export default App;
