import { Button } from '@rneui/themed';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';

interface Props {
  selectedIndex: number;
  callback: (newIndex: number) => void;
  buttons: {[index: number]: string};
}

export const Segment = ({selectedIndex, callback, buttons}: Props): ReactElement => {

  const [animatedValues, setAnimatedValues] = useState(
    Object.values(buttons).map(() => {
      return {value: useRef(new Animated.Value(0)).current}
    })
  );

  const handleSegmentPress = (index: number) => {
    callback(index)
    Animated.timing(animatedValues[index].value, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      animatedValues[index].value.setValue(0)
    });
  }

  return (
    <View style={styles.container}>
      {Object.keys(buttons).map((buttonIndex) => 
        <Animated.View style={[styles.segment, selectedIndex === Number(buttonIndex) ? styles.selected : styles.blank, 
          {
          transform: [{ scaleX: animatedValues[Number(buttonIndex)].value.interpolate({
            inputRange: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84,1],
            outputRange: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1, 1],
          })}, {scaleY: animatedValues[Number(buttonIndex)].value.interpolate({
            inputRange: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84,1],
            outputRange: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1, 1],
          })}]}]} 
          key={buttonIndex + buttons[Number(buttonIndex)]} 
          onTouchStart={() => handleSegmentPress(Number(buttonIndex))}>
          <Text style={selectedIndex === Number(buttonIndex) ? styles.selectedLabel : styles.label}>{buttons[Number(buttonIndex)]}</Text>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  segment: {
    padding: 8,
    margin: 0,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 25,
    backgroundColor: '#616B76',
  },
  selected: {
    backgroundColor: '#52B067',
    color: 'white',
    borderColor: 'grey',
  },
  label: {
    color: 'black',
  },
  selectedLabel: {
    color: 'white',
  },
  blank: {

  },
});
