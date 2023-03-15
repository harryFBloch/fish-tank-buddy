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
      return {x: useRef(new Animated.Value(1)).current, y: useRef(new Animated.Value(1)).current}
    })
  );

  const handleSegmentPress = (index: number) => {
    const xValues = [1.25, 0.75, 1.15, 0.95, 1.05, 1];
    const yValues = [0.75, 1.25, 0.85, 1.05, 0.95, 1];
    callback(index)
    Animated.sequence(
      xValues.map((x, xIndex) => {
        return Animated.parallel([
            Animated.timing(animatedValues[index].x, {
              toValue: xValues[xIndex],
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValues[index].y, {
              toValue: yValues[xIndex],
              duration: 200,
              useNativeDriver: true,
            }),
         ])
      })
     
    ).start();
  }

  return (
    <View style={styles.container}>
      {Object.keys(buttons).map((buttonIndex) => 
        <Animated.View style={[styles.segment, selectedIndex === Number(buttonIndex) ? styles.selected : styles.blank, {transform: [{ scaleX: animatedValues[Number(buttonIndex)].x}, {scaleY: animatedValues[Number(buttonIndex)].y}]}]} 
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
    borderColor: 'black',
    borderRadius: 25,
  },
  selected: {
    backgroundColor: 'black',
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
