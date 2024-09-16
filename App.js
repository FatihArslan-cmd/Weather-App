import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, Card, ActivityIndicator, Text } from 'react-native-paper';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setLocation(address[0]);
    })();
  }, []);

  let text = 'Fetching location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `
      Country: ${location.country || 'N/A'}
      City: ${location.city || 'N/A'}
      District: ${location.subregion || 'N/A'}
    `;
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Location Info" titleStyle={styles.cardTitle} />
          <Card.Content>
            {location ? (
              <Text style={styles.locationText}>{text}</Text>
            ) : (
              <ActivityIndicator animating={true} />
            )}
          </Card.Content>
        </Card>
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky color
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardTitle: {
    textAlign: 'center', // Center the title
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 25,
    textAlign: 'left', // Align text for better readability
  },
});
