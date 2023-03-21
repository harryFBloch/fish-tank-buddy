import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Animated } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const FloatingLabel = ({ label, value, onChangeText }: Props): ReactElement => {

  const [focused, setFoocused] = useState(false);
  const animatedIsFocused = new Animated.Value(value === '' ? 0 : 1);

  useEffect(() => {
    if (focused) {
      Animated.timing(animatedIsFocused, {
        toValue: focused || value ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [focused])

  const labelStyle = {
    position: "absolute" as "absolute",
    left: 0,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 14],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ["#aaa", "#616B76"],
    }),
  };

  const handleFocus = () => {
    setFoocused(true);
  }

  const handleBlur = () => {
    setFoocused(false);
  }

  return (
    <View style={{ paddingTop: 18 }}>
    <Animated.Text style={labelStyle}>{label}</Animated.Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={{ height: 26, fontSize: 20, borderBottomWidth: 1, borderBottomColor: "#555", color: 'white'}}
      onFocus={handleFocus}
      onBlur={handleBlur}
      keyboardType="numeric"
    />
    </View>
  )
}

export default FloatingLabel;