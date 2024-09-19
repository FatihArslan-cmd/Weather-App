import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import MainScreen from './components/MainScreen';
import SettingsScreen from './components/SettingsScreen';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
screenOptions={{
  ...TransitionPresets.SlideFromRightIOS,
  headerShown: false,
}}
      >
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
