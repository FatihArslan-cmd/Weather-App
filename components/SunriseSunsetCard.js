import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Card } from 'react-native-paper';
import CustomText from './CustomText';
import { MaterialIcons } from '@expo/vector-icons'; // Simge için MaterialIcons kütüphanesini kullanabilirsiniz.

const formatTo24Hour = (time) => {
  const [hour, minute] = time.split(':');
  const period = time.includes('AM') || time.includes('PM') ? time.slice(-2) : null;

  let formattedHour = parseInt(hour, 10);

  if (period === 'PM' && formattedHour < 12) {
    formattedHour += 12;
  }
  if (period === 'AM' && formattedHour === 12) {
    formattedHour = 0;
  }

  return `${formattedHour < 10 ? '0' + formattedHour : formattedHour}:${minute.slice(0, 2)}`;
};

const SunriseSunsetCard = ({ sunrise, sunset }) => {
  const [is24Hour, setIs24Hour] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const toggleTimeFormat = () => {
    // Önce fade-out yapıyoruz
    Animated.timing(fadeAnim, {
      toValue: 0, // Saydamlık sıfıra düşer
      duration: 300, // 300ms sürede
      useNativeDriver: true,
    }).start(() => {
      // Saat formatını değiştiriyoruz
      setIs24Hour(!is24Hour);

      // Sonra fade-in yapıyoruz
      Animated.timing(fadeAnim, {
        toValue: 1, // Saydamlık tekrar 1'e çıkar
        duration: 300, // 300ms sürede
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.infoContainer}>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleTimeFormat}>
            <MaterialIcons name="swap-horiz" size={24} color="black" />
          </TouchableOpacity>

          {/* Animasyonlu görünüm */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.blockContainer}>
              <Image source={require('../assets/sunrise.png')} style={styles.icon} />
              <CustomText fontFamily="pop" style={styles.dataText}>
                Sunrise: {is24Hour && sunrise ? formatTo24Hour(sunrise) : sunrise || 'N/A'}
              </CustomText>
            </View>
            <View style={styles.blockContainer}>
              <Image source={require('../assets/sunset.png')} style={styles.icon} />
              <CustomText fontFamily="pop" style={styles.dataText}>
                Sunset: {is24Hour && sunset ? formatTo24Hour(sunset) : sunset || 'N/A'}
              </CustomText>
            </View>
          </Animated.View>
        </View>
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
    marginVertical: 5,
  },
  blockContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  infoContainer: {
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
  },
  dataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  toggleButton: {
    position: 'absolute',
    top: -10,
    right: 0,
    padding: 10,
  },
});

export default SunriseSunsetCard;
