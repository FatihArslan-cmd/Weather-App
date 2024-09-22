import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Switch, Divider, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  
  const navigation = useNavigation();

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);

  return (
    <LinearGradient colors={['#87CEEB', '#00BFFF']} style={styles.gradient}>
      <View style={styles.container}>
        {/* Back Icon */}
        <IconButton
          icon="arrow-left"
          size={29}
          color="#fff"
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        />

        {/* Subheader */}
        <CustomText style={styles.subheader} fontFamily="pop">Settings</CustomText>

        {/* Dark Theme */}
        <Card style={styles.card}>
          <Card.Title
            title={<CustomText fontFamily="pop">Dark Theme</CustomText>}
            subtitle={<CustomText fontFamily="pop">Toggle between dark and light theme</CustomText>}
            left={() => <Icon name="moon" size={24} color="#000" />}
            right={() => (
              <Switch
                value={isDarkTheme}
                onValueChange={toggleTheme}
                color="#f5b406"
              />
            )}
          />
        </Card>
        <Divider style={styles.divider} />

        {/* Notifications */}
        <Card style={styles.card}>
          <Card.Title
            title={<CustomText fontFamily="pop">Enable Notifications</CustomText>}
            subtitle={<CustomText fontFamily="pop">Receive notifications about weather updates</CustomText>}
            left={() => <Icon name="notifications" size={24} color="#000" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                color="#f5b406"
              />
            )}
          />
        </Card>
        <Divider style={styles.divider} />

        <CustomText style={styles.subheader} fontFamily="pop">Account</CustomText>

        {/* Change Language */}
        <Card style={styles.card} onPress={() => console.log('Change Language')}>
          <Card.Title
            title={<CustomText fontFamily="pop">Change Language</CustomText>}
            subtitle={<CustomText fontFamily="pop">Choose your preferred language</CustomText>}
            left={() => <Icon name="globe-outline" size={24} color="#000" />}
            right={() => <Icon name="chevron-forward" size={24} color="#000" />}
          />
        </Card>
        <Divider style={styles.divider} />

        {/* Privacy Policy */}
        <Card style={styles.card} onPress={() => console.log('Privacy Policy')}>
          <Card.Title
            title={<CustomText fontFamily="pop">Privacy Policy</CustomText>}
            subtitle={<CustomText fontFamily="pop">Review our privacy policy</CustomText>}
            left={() => <Icon name="document-text-outline" size={24} color="#000" />}
            right={() => <Icon name="chevron-forward" size={24} color="#000" />}
          />
        </Card>
        <Divider style={styles.divider} />

        <CustomText style={styles.subheader} fontFamily="pop">Support</CustomText>

        {/* Help & Support */}
        <Card style={styles.card} onPress={() => console.log('Help & Support')}>
          <Card.Title
            title={<CustomText fontFamily="pop">Help & Support</CustomText>}
            subtitle={<CustomText fontFamily="pop">Get help or contact support</CustomText>}
            left={() => <Icon name="help-circle-outline" size={24} color="#000" />}
            right={() => <Icon name="chevron-forward" size={24} color="#000" />}
          />
        </Card>
        <Divider style={styles.divider} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',  // Center vertically
    alignItems: 'center',      // Center horizontally
  },
  backIcon: {
    position: 'absolute',
    top: 40, // Adjust as needed
    left: 10, // Adjust as needed
  },
  subheader: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  card: {
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '90%',  // Adjust width to be centered within the screen
  },
  divider: {
    marginVertical: 4,
    width: '90%',  // Adjust divider width to match cards
  },
});

export default SettingsScreen;
