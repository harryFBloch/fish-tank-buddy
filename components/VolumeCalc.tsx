import { ReactElement, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, ScrollView } from 'react-native';
import { Button, Card, Image, Input } from '@rneui/themed';
import {BlurView} from '@react-native-community/blur';
import FloatingLabel from '../components/FloatingLabel';
import { Segment } from '../components/Segment';
import { Results, ResultsTemplate, TankShapes } from '../store/MiscTypes';
import { Switch } from '@rneui/base';
import { actions } from '../store';
import { ThunkDispatchType } from '../store/types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.ads.showInter
}, dispatch);

type Props = ReturnType<typeof mapDispatchToProps>

export const VolumeCalc = ({ showInter }: Props): ReactElement => {

  const [showResults, setShowResults] = useState(false)
  const [tabIndex, setTabIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [diameter, setDiameter] = useState(0);
  const [depth, setDepth] = useState(0);
  const [sides, setSides] = useState(0);
  const [gravelDepth, setGravelDepth] = useState(2);

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

  const calculateGravelAmountSquare = (): number => {
   if (imperial) {
    return (width * depth * gravelDepth)/12
   } else {
    return (width * depth * gravelDepth)
   }
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
    showInter()
    .then(() => {
      setResults({...calculateResults()});
      setShowResults(true);
      resetInputs();
    })
  }

  const convertResults = (): {volume: number, surfaceArea: number} => {
    if(imperial) {
      return {volume: +(results.volume/231).toFixed(2), surfaceArea: +(results.surfaceArea/1728).toFixed(2)}
    } else {
      return {volume: +(results.volume/1000).toFixed(2), surfaceArea: +(results.surfaceArea).toFixed(2)}
    }
  }

  const renderResultsCard = () =>{
    const convertedResults = convertResults();
    return (
      <Card>
        <Card.Title>Here Are Your Results</Card.Title>
        <Card.Divider/>
        <View>
          <Text>Water Volume: {convertedResults.volume} {imperial ? 'Gallons' : "Liters"}</Text>
          <Text>Water Surface Area: {convertedResults.surfaceArea} {imperial ? 'Ft' + "\u00B2" : 'CM' + '\u00B2'}</Text>
        </View>
        <Button style={styles.button} onPress={() => setShowResults(false)}>Back</Button>
      </Card>
    )
  }

  const renderImperialSwitch = (): ReactElement => {
    return (
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
    )
  }

  const renderRectangleInputs = (): ReactElement => {
    return (
      <View>
        {renderImperialSwitch()}
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
        {renderImperialSwitch()}
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
        {renderImperialSwitch()}
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
      <BlurView style={styles.glass} blurType="dark" blurAmount={10}>
        <Card containerStyle={styles.card}>
        <Card.Title style={styles.whiteFont}>Fish Tank Calculator</Card.Title>
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
      </BlurView>
  )
}

export default connect(null,mapDispatchToProps)(VolumeCalc);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
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
    color: 'white',
  },
  glass: {
    backgroundColor: 'rgba(17, 25, 40, 0.35)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.125)',
  },
  card: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  lightFont: {
    color: '#616B76',
  },
  whiteFont: {
    color: 'white',
  }

});
