import React, { useState, useEffect, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

type InheritedProps = {
  frontCard: ReactNode,
  backCard: ReactNode,
  flip: boolean,
}

const FlipCard = ({ frontCard, backCard, flip }: InheritedProps) => {
  const [animation, setAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: flip ? 180 : 0,
      duration: 1000,
      useNativeDriver: true
    }).start(); 
  }, [flip]);

  const frontInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg']
  });

  const backInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg']
  });

  const zFrontInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0]
  });

  const zBackInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: [0, 1]
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    zIndex: zFrontInterpolate
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    zIndex: zBackInterpolate
  };

  return (
    <View style={styles.container}>
      <View>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          {frontCard}
        </Animated.View>
        <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
          {backCard}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  card: {
    backfaceVisibility: 'hidden',
    left: 0,
    width: '100%',
    zIndex: 10,
    elevation: 10,
    top: '30%',
  },
  backCard: {
    transform: [{ rotateY: '180deg' }],
    position: 'absolute',
    zIndex: -1,
  },
  text: {
    fontSize: 24,
  },
  cardFront: {

  },
  test: {
    backgroundColor: 'blue',
    padding: 16,
    zIndex: 1
  }
});

export default FlipCard;
