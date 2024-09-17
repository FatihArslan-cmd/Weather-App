// SunriseSunsetCard.js
import React from 'react';
import { Card, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import CustomText from './CustomText';

const SunriseSunsetCard = ({ sunrise, sunset }) => {
  return (
    <Card style={styles.card}>
      <Card.Title title="Gün Doğumu ve Batımı" titleStyle={styles.cardTitle} />
      <Card.Content>
        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <CustomText fontFamily="pop" style={styles.timeText}>
              Gün Doğumu:
            </CustomText>
            <Text style={styles.timeValue}>{sunrise}</Text>
          </View>
          <View style={styles.timeItem}>
            <CustomText fontFamily="pop" style={styles.timeText}>
              Gün Batımı:
            </CustomText>
            <Text style={styles.timeValue}>{sunset}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginBottom: 10,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  timeItem: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    marginBottom: 5,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SunriseSunsetCard;
