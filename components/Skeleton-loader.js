import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonLoader = ({ isLoading, type, style, width, height, borderRadius }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animatedValue.stopAnimation();
    }
  }, [isLoading]);

  const interpolateColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#f5f5f5'], // Colors for skeleton animation
  });

  if (isLoading) {
    return (
      <Animated.View
        style={[
          styles.placeholder,
          {
            width,
            height,
            borderRadius,
            backgroundColor: interpolateColor,
          },
          style,
          type === 'circle' && { borderRadius: width / 2 },
        ]}
      />
    );
  }

  return <View style={styles.placeholder} />;
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#e0e0e0', // Default background color for skeleton loader
  },
});

export default SkeletonLoader;
