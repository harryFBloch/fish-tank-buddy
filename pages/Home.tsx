import { ReactElement, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, ScrollView } from 'react-native';
import { Button, Card, Image, Input } from '@rneui/themed';
import FloatingLabel from '../components/FloatingLabel';
import { Segment } from '../components/Segment';
import { Results, ResultsTemplate, TankShapes } from '../store/types';
import { Switch } from '@rneui/base';

export const Home = (): ReactElement => {

  const [showResults, setShowResults] = useState(false)
  const [tabIndex, setTabIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [diameter, setDiameter] = useState(0);
  const [depth, setDepth] = useState(0);
  const [sides, setSides] = useState(0);

  const [imperial, setImperial] = useState(true);
  const selectedShape = Object.values(TankShapes)[tabIndex];
  const [results, setResults] = useState(ResultsTemplate);


  const imageAnimation = useRef(new Animated.Value(1)).current
  const unitAnimation = useRef(new Animated.Value(1)).current
  const [unitLabelImperial, setUnitLabelImperial] = useState(true);

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

  const handleSwitchUnit = () => {
    setImperial(!imperial);
      Animated.timing(unitAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        setUnitLabelImperial(!unitLabelImperial)
        Animated.timing(unitAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
      })
  }

  const handleSelectShapeCallback = (index: number) => {
      Animated.timing(imageAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        
      }).start(() => {
        setTabIndex(index);
        resetInputs();
      })
  }

  const calculateMultiSideVolume = (): { volume: number, surfaceArea: number } => {
    const baseArea = (sides * width * height) / 2;
    const lateralArea = sides * width * height;
    const surfaceArea = 2 * baseArea + lateralArea;
    const volume = baseArea * height;
    return { volume, surfaceArea };
  }
  
  const calculateResults = (): Results => {
    switch (tabIndex){
      case 0:
        return {volume: depth * width * height, 
          surfaceArea: (2 * depth * width) + (2 *depth * height) + (2 * width * height)}
      case 1:
        return {volume: Math.PI * Math.pow(diameter/2, 2) * height,
        surfaceArea: Math.pow(2 * Math.PI * (diameter/2), 2) + 2 * Math.PI * (diameter/2) * height}
      case 2:
        return calculateMultiSideVolume()
      default:
        return ResultsTemplate
    }
  }

  const handleCalculateButton = () => {
    console.log(calculateResults())
    setResults({...calculateResults()});
    setShowResults(true);
    resetInputs();
  }

  const renderResultsCard = () =>{
    return (
      <Card>
        <Card.Title>Here Are Your Results</Card.Title>
        <Card.Divider/>
        <View>
          <Text>Water Volume: {results.volume}</Text>
          <Text>Water Surface Area: {results.surfaceArea}</Text>
        </View>
        <Button onPress={() => setShowResults(false)}>Back</Button>
      </Card>
    )
  }

  const renderRectangleInputs = (): ReactElement => {
    return (
      <View>
        <View style={styles.switchContainer}>
          <Animated.Text style={{...styles.switchLabel, opacity: unitAnimation, 
            letterSpacing: unitAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-2, 0.5],
            })}}>
            {unitLabelImperial ? 'Imperial (in)' : 'Metric (cm)'}
          </Animated.Text>
          <Switch value={imperial} onValueChange={handleSwitchUnit}/>
        </View>
        <FloatingLabel value={height !== 0 ? String(height) : ""} label="Height" onChangeText={(e) => {setHeight(Number(e))}}/>
        <FloatingLabel value={width !== 0 ? String(width) : ""} label="Width" onChangeText={(e) => setWidth(Number(e))}/>
        <FloatingLabel value={depth !== 0 ? String(depth) : ""} label="Depth" onChangeText={(e) => setDepth(Number(e))}/>
        <Button style={styles.button} onPress={handleCalculateButton}>Calculate</Button>
      </View>
    )
  }

  const renderCylinderInputs = (): ReactElement => {
    return (
      <View>
        <FloatingLabel value={height !== 0 ? String(height) : ""} label="Height" onChangeText={(e) => {setHeight(Number(e))}}/>
        <FloatingLabel value={diameter !== 0 ? String(diameter) : ""} label="Diameter" onChangeText={(e) => setDiameter(Number(e))}/>
        <FloatingLabel value={depth !== 0 ? String(depth) : ""} label="Depth" onChangeText={(e) => setDepth(Number(e))}/>
        <Button style={styles.button} onPress={handleCalculateButton}>Calculate</Button>
      </View>
    )
  }

  const renderMultiInputs = (): ReactElement => {
    return (
      <View>
        <FloatingLabel value={sides !== 0 ? String(sides) : ""} label="Number of Sides" onChangeText={(e) => setSides(Number(e))}/>
        <FloatingLabel value={width !== 0 ? String(width) : ""} label="Width" onChangeText={(e) => setWidth(Number(e))}/>
        <FloatingLabel value={height !== 0 ? String(height) : ""} label="Height" onChangeText={(e) => {setHeight(Number(e))}}/>
        <Button style={styles.button} onPress={handleCalculateButton}>Calculate</Button>
      </View>
    )
  }

  const resetInputs = () => {
    setDepth(0);
    setHeight(0);
    setWidth(0);
    setDiameter(0);
  }

  const renderInputs = ():ReactElement => {
    switch (tabIndex){
      case 0:
        return renderRectangleInputs();
      case 1:
        return renderCylinderInputs();
      case 2:
        return renderMultiInputs();
      default:
        return <></>
    }
  }

  return (
      <Card >
        <Card.Title>Fish Tank Calculator</Card.Title>
        <Card.Divider/>
        <Segment selectedIndex={tabIndex} callback={handleSelectShapeCallback} buttons={{
          0: 'Rectangle',
          1: 'Cylinder',
          2: 'Multi Side',
        }}/>
        {renderTankShape()}
        {!showResults && renderInputs()}
        {showResults && renderResultsCard()}
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
  button: {
    marginTop: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchLabel: {
    fontWeight: 'bold',
    marginRight: 16,
  }
});
