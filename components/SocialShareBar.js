import React from 'react';
import { View, TouchableOpacity, StyleSheet, Share } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, Text } from 'react-native-paper'; // Paper Card bileşeni
import CustomText from './CustomText';
const shareApp = async () => {
  try {
    const result = await Share.share({
      message: 'Hava durumu uygulamasını kullanarak güncel bilgileri takip edebilirsin!',
      url: 'https://example.com', // Uygulamanın linki
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Paylaşılan platform:', result.activityType);
      } else {
        console.log('Başarıyla paylaşıldı');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('Paylaşım iptal edildi');
    }
  } catch (error) {
    console.error('Paylaşım hatası:', error.message);
  }
};

const SocialShareBar = () => {
  return (
    <Card style={styles.card}>
       <CustomText style={styles.title} fontFamily="pop">Uygulamayı paylaş</CustomText>
      <Card.Content>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={shareApp}>
            <Icon name="whatsapp" size={33} color="#25D366" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareApp}>
            <Icon name="instagram" size={33} color="#E1306C" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareApp}>
            <Icon name="twitter" size={33} color="#1DA1F2" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title:{
   textAlign:'center',
   marginVertical:5
  },
  icon: {
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginLeft: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SocialShareBar;
