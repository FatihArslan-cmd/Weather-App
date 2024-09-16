// LocationCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

const LocationCard = ({ address }) => (
  <View style={styles.cardContainer}>
    <Card style={styles.locationCard}>
      <Card.Content style={styles.locationInfo}>
        <Text style={styles.cityText}>{address}</Text>
      </Card.Content>
    </Card>
  </View>
);

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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default LocationCard;
