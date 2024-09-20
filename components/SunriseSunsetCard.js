import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Card } from 'react-native-paper';
import CustomText from './CustomText';
import { MaterialIcons } from '@expo/vector-icons';

// Helper function to convert Unix timestamp to time with timezone support


const SunriseSunsetCard = ({ sunrise, sunset, timezone }) => {
  const [is24Hour, setIs24Hour] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [dayLength, setDayLength] = useState(null);
  const [remainingDaylight, setRemainingDaylight] = useState(null);
  const convertUnixToTime = (unixTimestamp, is24Hour) => {
    const clientOffset = new Date().getTimezoneOffset();
    const offsetTimestamp = unixTimestamp + clientOffset * 60 + timezone;
    const date = new Date(offsetTimestamp * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    if (!is24Hour) {
      hours = hours % 12;
      hours = hours ? hours : 12; // If 0, make it 12 (midnight in 12-hour format)
    }
  
    return {
      timeString: `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes} ${!is24Hour ? ampm : ''}`,
      hours: is24Hour ? date.getHours() : (date.getHours() % 12) + (date.getHours() >= 12 ? 12 : 0),
      minutes: minutes,
    };
  };
  const getTimeDifference = (startHours, startMinutes, endHours, endMinutes) => {
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
  
    return endTotalMinutes - startTotalMinutes;
  };
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
      const { hours: sunriseHours, minutes: sunriseMinutes } = convertUnixToTime(sunrise, is24Hour, timezone);
      const { hours: sunsetHours, minutes: sunsetMinutes } = convertUnixToTime(sunset, is24Hour, timezone);

      // Calculate day length
      const totalDaylightMinutes = getTimeDifference(sunriseHours, sunriseMinutes, sunsetHours, sunsetMinutes);
      const hours = Math.floor(totalDaylightMinutes / 60);
      const minutes = totalDaylightMinutes % 60;
      setDayLength(`${hours}h ${minutes}m`);

      // Calculate remaining daylight
      const now = new Date();
      const currentTimeData = convertUnixToTime(Math.floor(now.getTime() / 1000), is24Hour, timezone);
      const remainingMinutes = getTimeDifference(currentTimeData.hours, currentTimeData.minutes, sunsetHours, sunsetMinutes);

      if (remainingMinutes > 0) {
        const remHours = Math.floor(remainingMinutes / 60);
        const remMinutes = remainingMinutes % 60;
        setRemainingDaylight(`${remHours}h ${remMinutes}m`);
      } else {
        setRemainingDaylight('It is night');
      }
    }
  }, [sunrise, sunset, is24Hour, timezone]);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.infoContainer}>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleTimeFormat}>
            <MaterialIcons name="swap-horiz" size={24} color="black" />
          </TouchableOpacity>

          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.blockContainer}>
              <Image source={require('../assets/sunrise.png')} style={styles.icon} />
              <CustomText fontFamily="pop" style={styles.dataText}>
                Sunrise: {convertUnixToTime(sunrise, is24Hour, timezone).timeString || 'N/A'}              </CustomText>
            </View>
            <View style={styles.blockContainer}>
              <Image source={require('../assets/sunset.png')} style={styles.icon} />
              <CustomText fontFamily="pop" style={styles.dataText}>
                Sunset: {convertUnixToTime(sunset, is24Hour, timezone).timeString || 'N/A'}
              </CustomText>
            </View>
            <View style={styles.blockContainer}>
              <CustomText fontFamily="pop" style={styles.dataText}>
                Day Length: {dayLength || 'N/A'}
              </CustomText>
            </View>
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