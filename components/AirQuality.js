import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card } from 'react-native-paper';
import CustomText from './CustomText';

const getAirQualityDetails = (aqi) => {
  switch (aqi) {
    case 1:
      return { text: 'Mükemmel', icon: require('../assets/ok.png'), color: '#02a308' };
    case 2:
      return { text: 'İyi', icon: require('../assets/feedback-review.png'), color: '#47ad4b' };
    case 3:
      return { text: 'Ortalama', icon: require('../assets/unlike.png'), color: 'orange' };
    case 4:
      return { text: 'Kötü', icon: require('../assets/chat.png'), color: '#FF5722' };
    case 5:
      return { text: 'Çok Kötü', icon: require('../assets/air-pollution.png'), color: '#F44336' };
    default:
      return { text: 'Bilinmiyor', icon: require('../assets/air-pollution.png'), color: '#9E9E9E' };
  }
};

const AirQualityScreen = ({ airQuality }) => {
  const airQualityDetails = airQuality ? getAirQualityDetails(airQuality.list[0].main.aqi) : null;

  return (
    <Card style={styles.card}>
      {/* Replacing Card.Title with CustomText */}
      <View style={styles.titleContainer}>
        <CustomText fontFamily="pop" style={styles.cardTitle}>
          Air Quality
        </CustomText>
      </View>
      <Card.Content>
        {airQuality && airQualityDetails ? (
          <View>
            <View style={styles.infoContainer}>
              <Image source={airQualityDetails.icon} style={styles.icon} />
              <View style={{ flexDirection: 'column' }}>
                <View style={{ margin: 20 }}>
                  <CustomText fontFamily="pop" style={styles.dataText}>
                    CO: {airQuality.list[0].components.co} μg/m³
                  </CustomText>
                  <CustomText fontFamily="pop" style={styles.dataText}>
                    O3: {airQuality.list[0].components.o3} μg/m³
                  </CustomText>
                  <CustomText fontFamily="pop" style={styles.dataText}>
                    PM2.5: {airQuality.list[0].components.pm2_5} μg/m³
                  </CustomText>
                  <CustomText fontFamily="pop" style={styles.dataText}>
                    PM10: {airQuality.list[0].components.pm10} μg/m³
                  </CustomText>
                </View>
                <CustomText fontFamily="pop" style={[styles.title, { color: airQualityDetails.color }]}>
                  Hava Kalitesi: {airQualityDetails.text}
                </CustomText>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.dataText}>Hava kalitesi verisi yok.</Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginVertical: 10,
  },
  titleContainer: {
    alignItems: 'center',
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 20,
  },
  infoContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    flexDirection: 'row',
  },
  icon: {
    width: 100,
    height: 100,
    margin: 10,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  dataText: {
    fontSize: 16,
  },
});

export default AirQualityScreen;
