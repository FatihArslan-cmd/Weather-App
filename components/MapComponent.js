import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapComponent = ({ location }) => {
  const [region, setRegion] = useState(null);

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
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followUserLocation={true}
        zoomEnabled={true}
      >
        <Marker coordinate={region} title="Your Location" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    borderWidth: 2,  // Set the width of the border
    borderColor: 'gray',  // Set the color of the border
    borderRadius: 10,  // Optional: Rounded corners for the border
    overflow: 'hidden',  // Ensure the map does not overflow the border
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4, // Half the screen height
  },
  gradient: {
    flex: 1,
  },
  locationCardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollContainer: {
    paddingTop: 120, // Adjust this value based on your layout
  },
});

export default MapComponent;
