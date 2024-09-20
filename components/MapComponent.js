import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { Card } from 'react-native-paper';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Icon importu
import API_KEY from '../API_KEY';

const MapComponent = ({ location }) => {
  const [region, setRegion] = useState(null);
  const [fullScreen, setFullScreen] = useState(false); // Tam ekran durumu

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
    return null; // Bölge ayarlanmadıysa bileşeni render etme
  }

  return (
    <View>
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
            {/* Kullanıcı konumuna marker */}
            <Marker coordinate={region} title="Your Location" />

            {/* OpenWeather'dan gelen hava durumu haritası */}
            <UrlTile
              urlTemplate={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
              zIndex={1}
              tileSize={256}
            />
          </MapView>

          {/* Tam Ekran İkonu */}
          <TouchableOpacity
            style={styles.fullScreenIcon}
            onPress={() => setFullScreen(true)}
          >
            <Icon name="fullscreen" size={24} color="#000" />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Tam Ekran Modal */}
      {fullScreen && (
        <Modal visible={fullScreen} animationType="slide" transparent={true}>
          <View style={styles.fullScreenContainer}>
            <MapView
              style={styles.fullScreenMap}
              region={region}
              showsUserLocation={true}
              followUserLocation={true}
              zoomEnabled={true}
            >
              <Marker coordinate={region} title="Your Location" />
              <UrlTile
                urlTemplate={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                zIndex={1}
                tileSize={256}
              />
            </MapView>

            {/* Tam ekrandan çıkma ikonu */}
            <TouchableOpacity
              style={styles.fullScreenIcon}
              onPress={() => setFullScreen(false)}
            >
              <Icon name="fullscreen-exit" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    elevation: 3, // Android gölgesi
    shadowColor: '#000', // iOS gölgesi
    shadowOffset: { width: 0, height: 2 }, // iOS gölge ofseti
    shadowOpacity: 0.2, // iOS gölge opaklığı
    shadowRadius: 3, // iOS gölge yarıçapı
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    width: Dimensions.get('window').width - 20, // Kartın genişliğiyle uyumlu olacak şekilde
    height: Dimensions.get('window').height * 0.4, // Ekranın yarısı kadar yükseklik
  },
  fullScreenIcon: {
    position: 'absolute',
    bottom: 20, // Sağ alta taşındı
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Saydamlık eklendi
    borderRadius: 20,
    padding: 5,
    opacity: 0.9, // İkonun saydamlığı artırıldı
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Tam ekran modunda arka plan opaklığı
  },
  fullScreenMap: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapComponent;
