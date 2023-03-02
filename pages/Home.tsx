import { ReactElement, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { Button, Card, Image } from '@rneui/themed';
import { Segment } from '../components/Segment';
import { TankShapes } from '../store/types';

export const Home = (): ReactElement => {

  const [tabIndex, setTabIndex] = useState(0);
  const selectedShape = Object.values(TankShapes)[tabIndex];
  const imageAnimation = useRef(new Animated.Value(1)).current

  const renderTankShape = (): ReactElement => {
    return (
      <View style={styles.container}>
        <Animated.View style={{transform: [{scale: imageAnimation}]}}>
          <Image style={styles.image} source={selectedShape.image}/>
        </Animated.View>
      </View>
    )
  };

  useEffect(() => {
    Animated.timing(imageAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      
    }).start();
  }, [tabIndex])

  const handleSelectShapeCallback = (index: number) => {
      Animated.timing(imageAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        
      }).start(() => {
        setTabIndex(index);
      })
    
  }


  return (
    <Card>
      <Card.Title>Fish Tank Calculator</Card.Title>
      <Card.Divider/>
      <Segment selectedIndex={tabIndex} callback={handleSelectShapeCallback}/>
      {renderTankShape()}
    </Card>
  
  )
}

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  image: {
    marginTop: 16,
    height: 150,
    width: 150,
  },
});
