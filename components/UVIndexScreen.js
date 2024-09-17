import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import CustomText from './CustomText';

const getUVIndexDetails = (uvIndex) => {
  if (uvIndex <= 2) {
    return { text: 'Düşük', color: '#00C853', recommendation: 'Güneş koruyucu kullanmanıza gerek yok.' };
  } else if (uvIndex <= 5) {
    return { text: 'Orta', color: '#FFEB3B', recommendation: 'Güneş koruyucu kullanmanız tavsiye edilir.' };
  } else if (uvIndex <= 7) {
    return { text: 'Yüksek', color: '#FF9800', recommendation: 'Güneş koruyucu kullanın ve gölgede kalın.' };
  } else if (uvIndex <= 10) {
    return { text: 'Çok Yüksek', color: '#F44336', recommendation: 'Güneş koruyucu kullanın, mümkünse dışarı çıkmayın.' };
  } else {
    return { text: 'Aşırı Yüksek', color: '#D32F2F', recommendation: 'Dışarı çıkmaktan kaçının ve koruyucu önlemler alın.' };
  }
};

const UVIndexScreen = ({ uvIndex }) => {
  const uvIndexDetails = uvIndex ? getUVIndexDetails(uvIndex) : null;

  return (
    <Card style={styles.card}>
      <Card.Content>
        {uvIndex && uvIndexDetails ? (
          <View>
            <View style={styles.infoContainer}>
              <View style={{ flexDirection: 'column' }}>
                <CustomText fontFamily="pop" style={styles.dataText}>
                  UV Endeksi: {uvIndex}
                </CustomText>
                <CustomText fontFamily="pop" style={[styles.title, { color: uvIndexDetails.color }]}>
                  Risk: {uvIndexDetails.text}
                </CustomText>
                <CustomText fontFamily="lato" style={styles.recommendationText}>
                  {uvIndexDetails.recommendation}
                </CustomText>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.dataText}>UV endeksi verisi yok.</Text>
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
  infoContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    flexDirection: 'column',
    padding: 10,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  dataText: {
    fontSize: 16,
    textAlign:'center'
  },
  recommendationText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default UVIndexScreen;
