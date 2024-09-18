import React from 'react';
import { View, StyleSheet,Image } from 'react-native';
import { Card } from 'react-native-paper';
import CustomText from './CustomText';

const SunriseSunsetCard = ({ sunrise, sunset }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.infoContainer}>
          <View style={styles.blockContainer}>
        <Image source={require('../assets/sunrise.png')} style={styles.icon} />
          <CustomText fontFamily="pop" style={styles.dataText}>
            Sunrise: {sunrise || 'N/A'}
          </CustomText>
          </View>
          <View style={styles.blockContainer}>
          <Image source={require('../assets/sunset.png')} style={styles.icon} />
          <CustomText fontFamily="pop" style={styles.dataText}>
            Sunset: {sunset || 'N/A'}
          </CustomText>
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
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginVertical: 5,
  },
  blockContainer:{
   flexDirection:'row',
   marginVertical:5
  },
  infoContainer: {
    alignItems: 'center',
  },
  icon:{
   width:50,
   height:50,
   marginHorizontal:5
  },
  dataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop:10
  },
});

export default SunriseSunsetCard;
