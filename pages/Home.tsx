import { ReactElement, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, ScrollView } from 'react-native';
import { Button, Card, Image, Input } from '@rneui/themed';
import { Segment } from '../components/Segment';
import { Results, ResultsTemplate, TankShapes } from '../store/types';

export const Home = (): ReactElement => {

  const [showResults, setShowResults] = useState(false)
  const [tabIndex, setTabIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [diameter, setDiameter] = useState(0);
  const [depth, setDepth] = useState(0);
  const selectedShape = Object.values(TankShapes)[tabIndex];
  const [results, setResults] = useState(ResultsTemplate);
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
  
  console.log({tabIndex, depth, width, height})
  const calculateResults = (): Results => {
    switch (tabIndex){
      case 0:
        return {volume: depth * width * height, 
          surfaceArea: (2 * depth * width) + (2 *depth * height) + (2 * width * height)}
      case 1:
        return {volume: Math.PI * Math.pow(diameter/2, 2) * height,
        surfaceArea: Math.pow(2 * Math.PI * (diameter/2), 2) + 2 * Math.PI * (diameter/2) * height}
      case 2:
        return ResultsTemplate
      default:
        return ResultsTemplate
    }
  }

  const handleCalculateButton = () => {
    console.log(calculateResults())
    setResults({...calculateResults()});
    setShowResults(true);
  }

  const renderResultsCard = () =>{
    return (
      <Card>
        <Card.Title>Here Are Your Results</Card.Title>
        <Card.Divider/>
        <View>
          <Text>Water Volume: {results.volume}</Text>
          <Text>Water Surface Area: {results.volume}</Text>
        </View>
        <Button onPress={() => setShowResults(false)}>Back</Button>
      </Card>
    )
  }

  const renderRectangleInputs = (): ReactElement => {
    return (
      <View>
        <Input value={height !== 0 ? String(height) : ""} placeholder="Height" keyboardType="number-pad" onChangeText={(e) => {setHeight(Number(e))}}/>
        <Input value={width !== 0 ? String(width) : ""} placeholder="Width" keyboardType="number-pad" onChangeText={(e) => setWidth(Number(e))}/>
        <Input value={depth !== 0 ? String(depth) : ""} placeholder="Depth" keyboardType="number-pad" onChangeText={(e) => setDepth(Number(e))}/>
        <Button onPress={handleCalculateButton}>Calculate</Button>
      </View>
    )
  }

  const renderCylinderInputs = (): ReactElement => {
    return (
      <View>
        <Input value={height !== 0 ? String(height) : ""} placeholder="Height" keyboardType="number-pad" onChangeText={(e) => {setHeight(Number(e))}}/>
        <Input value={diameter !== 0 ? String(diameter) : ""} placeholder="Diameter" keyboardType="number-pad" onChangeText={(e) => setDiameter(Number(e))}/>
        <Input value={depth !== 0 ? String(depth) : ""} placeholder="Depth" keyboardType="number-pad" onChangeText={(e) => setDepth(Number(e))}/>
        <Button onPress={handleCalculateButton}>Calculate</Button>
      </View>
    )
  }

  const renderInputs = ():ReactElement => {
    switch (tabIndex){
      case 0:
        return renderRectangleInputs();
      case 1:
        return renderCylinderInputs();
      case 2:
        return <></>
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
});
