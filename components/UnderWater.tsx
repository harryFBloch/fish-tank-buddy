import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

type Bubbles = {[index:number]: {index: number, active: boolean}}

export const UnderWater = (): ReactElement => {

  const [bubbles, setBubbles] = useState<Bubbles>(() => [...Array(10)].map((k, i) => {
    return {index: i, active: false}
  }))
  const [lastActive, setLastActive] = useState(10);


  useEffect(() => {
    let interval = setInterval(() => {
        const newBubbles = {...bubbles};
        if (lastActive < 10){
          newBubbles[lastActive + 1] = {...newBubbles[lastActive + 1], active: true};
          setLastActive(lastActive + 1);
        } else {
          newBubbles[0] = {...newBubbles[0], active: true};
          setLastActive(0);
        }
        setBubbles({...newBubbles});
    }, 2000);
  
    return () => clearInterval(interval);
  }, []);

  const renderBubble = (active: boolean,  index: number, animCallback: (newbubs: Bubbles) => void): ReactElement => {

    const animate = useRef(new Animated.Value(0)).current
    const [rand, setRand] = useState(0);

    useEffect(() => {
      if(active) {
        setRand(Math.floor(Math.random() * 10) + 1)
        Animated.timing(animate, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: false,
        }).start(() => {
          //setInactive Again
          const newBubbs = {...bubbles, [index]: {...bubbles[index], active: false}}
          animCallback(newBubbs);
        })
      }
    },[active])

    
  const translateY = animate.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').height, 0],
  });

  const translateOpacity = animate.interpolate({
    inputRange: [0, 0.05, 0.95, 1],
    outputRange: [0,100,100,0],
  });

    return (
      <View key={`bubble-${index}`}>
        {active &&
          <Animated.View style={[styles.bubble, {
            left: `${rand}0%`,
            opacity: translateOpacity,
            transform: [{translateY}]}]}></Animated.View>
        }
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {Object.keys(bubbles).map((key) => renderBubble(bubbles[Number(key)].active, Number(key), (newBubbs) => {
        setBubbles(newBubbs)
      }))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(17, 25, 40, 0.5)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 20,
  },
  ocean: {

  },
  bubble: {
    borderRadius: 50,
    width: 25,
    height: 25,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 1,
    borderStyle: 'solid',
    zIndex: 30,
    position: 'relative',
  }
});

export default UnderWater;  