import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Card } from 'react-native-paper';
import CustomText from './CustomText';
import CountryFlag from 'react-native-country-flag';
import Icon from 'react-native-vector-icons/MaterialIcons';

const famousCities = [
  { name: 'Select Current Location', countryCode: null, isCurrentLocation: true },
  { name: 'Paris, France', countryCode: 'FR' },
  { name: 'New York, USA', countryCode: 'US' },
  { name: 'Tokyo, Japan', countryCode: 'JP' },
  { name: 'London, UK', countryCode: 'GB' },
  { name: 'Sydney, Australia', countryCode: 'AU' },
  { name: 'Rome, Italy', countryCode: 'IT' },
  { name: 'Berlin, Germany', countryCode: 'DE' },
  { name: 'Madrid, Spain', countryCode: 'ES' },
  { name: 'Moscow, Russia', countryCode: 'RU' },
  { name: 'Beijing, China', countryCode: 'CN' },
  { name: 'Rio de Janeiro, Brazil', countryCode: 'BR' },
  { name: 'Dubai, UAE', countryCode: 'AE' },
  { name: 'Istanbul, Turkey', countryCode: 'TR' },
  { name: 'Seoul, South Korea', countryCode: 'KR' },
  { name: 'Bangkok, Thailand', countryCode: 'TH' },
  { name: 'Mexico City, Mexico', countryCode: 'MX' },
  { name: 'Cairo, Egypt', countryCode: 'EG' },
  { name: 'Toronto, Canada', countryCode: 'CA' },
  { name: 'Buenos Aires, Argentina', countryCode: 'AR' },
  { name: 'Cape Town, South Africa', countryCode: 'ZA' },
  { name: 'Athens, Greece', countryCode: 'GR' },
  { name: 'Amsterdam, Netherlands', countryCode: 'NL' },
  { name: 'Lisbon, Portugal', countryCode: 'PT' },
  { name: 'Vienna, Austria', countryCode: 'AT' },
  { name: 'Brussels, Belgium', countryCode: 'BE' },
  { name: 'Zurich, Switzerland', countryCode: 'CH' },
  { name: 'Stockholm, Sweden', countryCode: 'SE' },
  { name: 'Copenhagen, Denmark', countryCode: 'DK' },
  { name: 'Helsinki, Finland', countryCode: 'FI' },
  { name: 'Oslo, Norway', countryCode: 'NO' },
  { name: 'Warsaw, Poland', countryCode: 'PL' },
  { name: 'Budapest, Hungary', countryCode: 'HU' },
  { name: 'Prague, Czech Republic', countryCode: 'CZ' },
  { name: 'Dublin, Ireland', countryCode: 'IE' },
  { name: 'Edinburgh, Scotland', countryCode: 'GB' },
  { name: 'Hanoi, Vietnam', countryCode: 'VN' },
  { name: 'Kuala Lumpur, Malaysia', countryCode: 'MY' },
  { name: 'Singapore, Singapore', countryCode: 'SG' },
  { name: 'Jakarta, Indonesia', countryCode: 'ID' },
  { name: 'Mumbai, India', countryCode: 'IN' },
  { name: 'Manila, Philippines', countryCode: 'PH' },
  { name: 'Tehran, Iran', countryCode: 'IR' },
  { name: 'Baghdad, Iraq', countryCode: 'IQ' },
  { name: 'Casablanca, Morocco', countryCode: 'MA' },
  { name: 'Nairobi, Kenya', countryCode: 'KE' },
  { name: 'Lagos, Nigeria', countryCode: 'NG' },
  { name: 'Karachi, Pakistan', countryCode: 'PK' },
  { name: 'Santiago, Chile', countryCode: 'CL' },
  { name: 'Lima, Peru', countryCode: 'PE' }
];

const LocationCard = ({ address, onSelectCity }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState({ name: address, countryCode: null });

  const handleCitySelect = (city) => {
    if (city.isCurrentLocation) {
      // Use the current address for the current location
      setSelectedCity({ name: address, countryCode: null });
    } else {
      setSelectedCity(city);
    }
    onSelectCity(city);
    setModalVisible(false);
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Card style={styles.locationCard}>
          <Card.Content style={styles.locationInfo}>
            {selectedCity.countryCode && (
              <CountryFlag isoCode={selectedCity.countryCode} size={25} style={styles.flag} />
            )}
            <CustomText fontFamily="pop" style={styles.cityText}>{selectedCity.name}</CustomText>
          </Card.Content>
        </Card>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <CustomText fontFamily="pop" style={styles.modalTitle}>Select a Popular City</CustomText>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Icon name="close" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={famousCities}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleCitySelect(item)}>
                      <View style={styles.cityItem}>
                        {item.isCurrentLocation ? (
                          <Icon name="my-location" size={25} color="#000" />
                        ) : (
                          item.countryCode && (
                            <CountryFlag isoCode={item.countryCode} size={25} />
                          )
                        )}
                        <CustomText fontFamily="pop" style={styles.cityName}>{item.name}</CustomText>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  locationCard: {
    width: '90%',
    borderRadius: 10,
  },
  cityText: {
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 10, // Added margin for spacing between flag and text
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    marginRight: 10, // Optional: add spacing between flag and city name
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  cityName: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default LocationCard;