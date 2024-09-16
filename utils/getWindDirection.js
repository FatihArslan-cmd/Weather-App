const getWindDirection = (degree) => {
    if (degree >= 0 && degree <= 22.5) return 'Kuzey';
    if (degree > 22.5 && degree <= 67.5) return 'Kuzeydoğu';
    if (degree > 67.5 && degree <= 112.5) return 'Doğu';
    if (degree > 112.5 && degree <= 157.5) return 'Güneydoğu';
    if (degree > 157.5 && degree <= 202.5) return 'Güney';
    if (degree > 202.5 && degree <= 247.5) return 'Güneybatı';
    if (degree > 247.5 && degree <= 292.5) return 'Batı';
    if (degree > 292.5 && degree <= 337.5) return 'Kuzeybatı';
    if (degree > 337.5 && degree <= 360) return 'Kuzey';
    return 'Bilinmiyor';
  };
  
  export default getWindDirection;
  