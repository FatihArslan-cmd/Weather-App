import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { Card } from 'react-native-paper';
import CustomText from './CustomText';
import API_KEY from '../API_KEY';
const MapComponent = ({ location }) => {
  const [region, setRegion] = useState(null);

  // Replace with your actual OpenWeather API key


  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

  if (!region) {
    return null; // Do not render until region is set
  }

  return (
    <Card style={styles.cardContainer}>
      <CustomText fontFamily="pop" style={styles.title}>Uydular</CustomText>
      <Card.Content>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}
        >
          {/* Marker for user location */}
          <Marker coordinate={region} title="Your Location" />

          {/* Weather map tile overlay from OpenWeather */}
          <UrlTile
            urlTemplate={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            zIndex={1}
            tileSize={256}
          />
        </MapView>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 3, // Shadow radius for iOS
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    width: Dimensions.get('window').width - 20, // Adjust width to fit card
    height: Dimensions.get('window').height * 0.4, // Half the screen height
  },
});

export default MapComponent;
