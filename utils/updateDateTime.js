import * as Localization from 'expo-localization';

const updateDateTime = (setDateTime) => {
  const now = new Date();
  const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
  setDateTime(now.toLocaleString(Localization.locale, options));
};

export default updateDateTime;
