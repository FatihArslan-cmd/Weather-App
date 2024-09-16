const translateWeatherDescription = (description) => {
    const translations = {
      'clear sky': 'Açık hava',
      'few clouds': 'Az bulutlu',
      'scattered clouds': 'Parçalı bulutlu',
      'broken clouds': 'Yer yer açık bulut',
      'shower rain': 'Sağanak yağmur',
      'rain': 'Yağmur',
      'thunderstorm': 'Gök gürültülü fırtına',
      'snow': 'Kar',
      'mist': 'Sis',
      'light rain': 'Hafif Yağmurlu',
      'overcast clouds': 'Kapalı Bulutlu',

    };
  
    return translations[description] || description;
  };
  
  export default translateWeatherDescription;
  