import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Card } from 'react-native-paper';
import CustomText from './CustomText';
import { MaterialIcons } from '@expo/vector-icons'; // Simge için MaterialIcons kütüphanesini kullanabilirsiniz.

const formatTo24Hour = (time) => {
  if (!time || typeof time !== 'string' || !time.includes(':')) {
    return 'Invalid time'; // or handle error as needed
  }

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

// Zaman farkını dakika cinsinden hesapla
const getTimeDifference = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  return endTotalMinutes - startTotalMinutes;
};

const SunriseSunsetCard = ({ sunrise, sunset }) => {
  const [is24Hour, setIs24Hour] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [dayLength, setDayLength] = useState(null);
  const [remainingDaylight, setRemainingDaylight] = useState(null);

  const toggleTimeFormat = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIs24Hour(!is24Hour);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    if (sunrise && sunset) {
      const sunrise24 = formatTo24Hour(sunrise); // 12 saat formatı da olsa 24 saate çevir
      const sunset24 = formatTo24Hour(sunset); // 12 saat formatı da olsa 24 saate çevir

      // Gün uzunluğunu hesapla
      const totalDaylightMinutes = getTimeDifference(sunrise24, sunset24);
      const hours = Math.floor(totalDaylightMinutes / 60);
      const minutes = totalDaylightMinutes % 60;
      setDayLength(`${hours}h ${minutes}m`);

      // Kalan gün ışığını hesapla
      const now = new Date();
      const currentTime = `${now.getHours()}:${now.getMinutes()}`;
      const remainingMinutes = getTimeDifference(currentTime, sunset24);

      if (remainingMinutes > 0) {
        const remHours = Math.floor(remainingMinutes / 60);
        const remMinutes = remainingMinutes % 60;
        setRemainingDaylight(`${remHours}h ${remMinutes}m`);
      } else {
        setRemainingDaylight('It is night');
      }
    }
  }, [sunrise, sunset, is24Hour]);

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

            {/* Gün uzunluğu */}
            <View style={styles.blockContainer}>
              <CustomText fontFamily="pop" style={styles.dataText}>
                Day Length: {dayLength || 'N/A'}
              </CustomText>
            </View>

            {/* Kalan gün ışığı */}
            <View style={styles.blockContainer}>
              <CustomText fontFamily="pop" style={styles.dataText}>
                Remaining Daylight: {remainingDaylight || 'N/A'}
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
