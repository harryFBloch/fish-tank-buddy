import { ReactElement, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { TankShapes } from '../store/types';

interface Props {
  selectedIndex: number;
  callback: (newIndex: number) => void;
}

export const Segment = ({selectedIndex, callback}: Props): ReactElement => {

  const [animatedValues, setAnimatedValues] = useState(
    Object.values(TankShapes).map(() => {
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
      {Object.values(TankShapes).map((shape) => 
        <Animated.View style={[styles.segment, selectedIndex === shape.index ? styles.selected : styles.blank, {transform: [{ scaleX: animatedValues[shape.index].x}, {scaleY: animatedValues[shape.index].y}]}]} 
          key={shape.index + shape.name} 
          onTouchStart={() => handleSegmentPress(shape.index)}>

          <Text style={selectedIndex === shape.index ? styles.selectedLabel : styles.label}>{shape.name}</Text>
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
    justifyContent: 'space-between',
  },
  segment: {
    padding: 16,
    margin: 8,
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

  }
});
