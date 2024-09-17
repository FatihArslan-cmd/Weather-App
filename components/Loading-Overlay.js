import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Wave } from 'react-native-animated-spinkit';

const LoadingOverlay = ({ loading }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={loading}
    >
      <View style={styles.loadingOverlay}>
        <Wave size={48} color="#02CCFE" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default LoadingOverlay;