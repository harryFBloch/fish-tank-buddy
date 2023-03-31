import { ReactElement, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, ScrollView } from 'react-native';
import { Button, Card, Image, Input } from '@rneui/themed';
import {BlurView} from '@react-native-community/blur';
import FloatingLabel from '../components/FloatingLabel';
import { Segment } from '../components/Segment';
import { FishSizes, Results, ResultsTemplate, TankShapes } from '../store/MiscTypes';
import { Switch } from '@rneui/base';
import { actions } from '../store';
import { ThunkDispatchType } from '../store/types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AdMobInter from './AdmobInter';
import FlipCard from './FlipCard';

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.ads.showInter
}, dispatch);

type Props = ReturnType<typeof mapDispatchToProps>

export const VolumeCalc = ({ showInter }: Props): ReactElement => {

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

  const [flip, setFlip] = useState(false)


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

  const calculateMultiSideVolume = (): { volume: number, surfaceArea: number, waterVolume: number, fishSizes: FishSizes, area: number } => {
    const baseArea = (sides * width * height) / 2;
    const lateralArea = sides * width * height;
    const surfaceArea = 2 * baseArea + lateralArea;
    const volume = baseArea * height;
    const waterVolume = baseArea * (height - (imperial ? 2 : 5));
    return { volume, surfaceArea, waterVolume, fishSizes: calculateFishCount(volume), area: baseArea};
  }

  function calculateSubstrateAmount(): number {
    let volume: number;
    let substrateAmount: number;
  
    if (tabIndex === 0) {
      // Calculate volume of rectangular tank
      volume = width * 2 * depth;
    } else if (tabIndex === 1) {
      // Calculate volume of circular tank
      const radius = diameter / 2;
      volume = Math.PI * radius ** 2 * diameter;
    } else {
      // Calculate volume of multi-sided tank
      const apothem = width / (2 * Math.tan(Math.PI / sides));
      const perimeter = sides * width;
      volume = (apothem * perimeter) * width;
    }
  
    // Convert to inches or metric unit
    if (!imperial) {
      substrateAmount = volume / 1000; // 1 liter = 1000 cubic centimeters
    } else {
      substrateAmount = volume / 231; // 1 Gallon = 231 cubic inches
    }
  
    // Round to 2 decimal places and return result
    return Math.round(substrateAmount * 100) / 100;
  }

  const calculateResults = (): Results => {
    switch (tabIndex){
      case 0:
        return {
          fishSizes: calculateFishCount(depth * width * height - (imperial ? 2 : 5)),
          area: depth * width,
          waterVolume: depth * width * height - (imperial ? 2 : 5),
          volume: depth * width * height, 
          surfaceArea: (2 * depth * width) + (2 *depth * height) + (2 * width * height),
          substrateAmount: depth * width * (imperial ? 2 : 5),
        }

      //circle
      case 1:
        return {
          waterVolume: Math.PI * Math.pow(diameter/2, 2) * (height - (imperial ? 2 : 5)),
          area: Math.PI * Math.pow(diameter/2, 2),
          volume: Math.PI * Math.pow(diameter/2, 2) * height,
          surfaceArea: Math.pow(2 * Math.PI * (diameter/2), 2) + 2 * Math.PI * (diameter/2) * height,
          substrateAmount: depth * width * (imperial ? 2 : 5),
          fishSizes: calculateFishCount( Math.PI * Math.pow(diameter/2, 2) * (height - (imperial ? 2 : 5))),
      }
      //multi side
      case 2:
        return {...calculateMultiSideVolume(),
          surfaceArea: (2 * depth * width) + (2 *depth * height) + (2 * width * height),
          substrateAmount: depth * width * (imperial ? 2 : 5),
        }
      default:
        return ResultsTemplate
    }
  }

  const calculateFishCount = (volume: number): FishSizes => {
    return {
      smallfish: {min: calculateFishAmount(volume, 1), max: calculateFishAmount(volume, 5)},
      mediumfish: {min: calculateFishAmount(volume, 6), max: calculateFishAmount(volume, 10)},
      largefish: {min: calculateFishAmount(volume, 10), max: calculateFishAmount(volume, 15)},
    }
  }


  const calculateFishAmount = (volume: number, fishSize: number): number => {
    const gallons = volume / 231; // Convert cubic inches to gallons
    const maxFishSize = gallons * 2; // Calculate maximum fish size based on tank volume
    const fishAmount = Math.floor(maxFishSize / fishSize); // Calculate number of fish that can be kept
    return fishAmount;
  }    

  function kilogramsToPounds(kilograms: number): number {
    return kilograms * 2.20462;
  }
  
  function squareCmToSquareIn(squareCm: number): number {
    return squareCm * 0.155;
  }

  function calculateWaterWeight(waterVol: number): number {
    const density =  imperial ? 8.345 : 1; // 8.345 lb/gal and 1 kg/L are the densities of water
    const weightInPounds = waterVol * density; // 2.20462 lb/kg is the conversion factor
    const weightInKilos = waterVol * density;
    return imperial ? +(weightInPounds).toFixed(2) : +(weightInKilos).toFixed(2);
  }
  

  const calculateSubstrateWeight = (area: number): number  => {
    let a = area;
    if (!imperial) a = squareCmToSquareIn(a)
    const b = (a / 10)
    const kilograms = b / 2.2;
    return imperial ? +(kilogramsToPounds(kilograms)).toFixed(2) : +(kilograms).toFixed(2);
  }
  

  const handleCalculateButton = () => {
    setResults({...calculateResults()});
    showInter()
    .then(() => {
     
    })
  }

  const convertResults = (): {volume: number, substrate: number, waterVolume: number} => {
    if(imperial) {
      return {volume: +(results.volume/231).toFixed(2), waterVolume: +(results.waterVolume/231).toFixed(2), substrate: +(results.substrateAmount/231).toFixed(2)}
    } else {
      return {volume: +(results.volume/1000).toFixed(2), waterVolume: +(results.waterVolume/1000).toFixed(2), substrate: +(results.substrateAmount/1000).toFixed(2)}
    }
  }

  useEffect(() => {
    
  }, [results])

  const handleInterCallBack = () => {
    setFlip(!flip);
  }

  const renderResultsCard = () =>{
    const convertedResults = convertResults();
    return (
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.whiteFont}>Here Are Your Results</Card.Title>
        <Card.Divider/>
        <View>
          <View style={styles.resultsContainer}>
            <Text style={styles.whiteFont}>Total Tank Volume: </Text> 
            <Text style={{...styles.whiteFont}}>{convertedResults.volume} {imperial ? 'Gallons' : "Liters"}</Text>
          </View>
          <View style={styles.resultsContainer}>
            <Text style={styles.whiteFont}>Water Volume: </Text> 
            <Text style={{...styles.whiteFont}}>{convertedResults.waterVolume} {imperial ? 'Gallons' : "Liters"}</Text>
          </View>
          <View style={styles.resultsContainer}>
            <Text style={styles.whiteFont}>Water Weight: </Text> 
            <Text style={{...styles.whiteFont}}>{calculateWaterWeight(convertedResults.waterVolume)} {imperial ? 'Pounds' : "Kilos"}</Text>
          </View>
          <View style={styles.resultsContainer}>
            <Text style={styles.whiteFont}>Substrate Weight(2in):: </Text> 
            <Text style={{...styles.whiteFont}}>{calculateSubstrateWeight(results.area)} {imperial ? 'Pounds' : "Kilos"}</Text>
          </View>
          <View style={styles.fishSizeOuterContainer}>
            <View style={styles.fishSizeContainer}>
              <Text style={styles.fishSizeLabel}>Small 1cm-5cm</Text>
              <Text style={styles.fishSizeResutlts}>min: {results.fishSizes.smallfish.min}, max: {results.fishSizes.smallfish.max}</Text>
            </View>
            <View style={styles.fishSizeContainer}>
              <Text style={styles.fishSizeLabel}>Medium 5cm-10cm</Text>
              <Text style={styles.fishSizeResutlts}>min: {results.fishSizes.mediumfish.min}, max: {results.fishSizes.mediumfish.max}</Text>
            </View>
            <View style={styles.fishSizeContainer}>
              <Text style={styles.fishSizeLabel}>Large 10cm-15cm</Text>
              <Text style={styles.fishSizeResutlts}>min: {results.fishSizes.largefish.min}, max: {results.fishSizes.largefish.max}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.note}>"1 inch per 2 gallon" rule is just a general guideline and other factors such as the species of fish, their activity level, and the filtration and maintenance of the tank should also be considered when determining how many fish to keep in a tank.</Text>
        <Button style={{...styles.button, ...styles.bottomMargin }} onPress={() => {
          resetInputs();
          setFlip(!flip)
          }}>Back</Button>
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

  const renderFrontCardHeader = (): ReactElement => {
    return (
      <Card containerStyle={styles.card}>
          <Card.Title style={styles.whiteFont}>Fish Tank Calculator</Card.Title>
          <Segment selectedIndex={tabIndex} callback={handleSelectShapeCallback} buttons={{
            0: 'Rectangle',
            1: 'Cylinder',
            2: 'Multi Side',
          }}/>
          {renderTankShape()}
          {renderInputs()}
      </Card>
    )
  }

  return (
      <>
        <AdMobInter callBack={handleInterCallBack}/>
        <FlipCard flip={flip} frontCard={<>{renderFrontCardHeader()}</>} backCard={renderResultsCard()}/>
      </>
  )
}

export default connect(null,mapDispatchToProps)(VolumeCalc);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginTop: 16,
    height: 150,
    width: 150,
  },
  button: {
    marginTop: 16,
    marginBottom: 16,
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
    backgroundColor: 'rgba(17, 25, 40, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.125)',
  },
  card: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    padding: 4,
  },
  lightFont: {
    color: '#616B76',
  },
  whiteFont: {
    color: 'white',
  },
  fishSizeContainer: {
    backgroundColor: '#616B76',
    display: 'flex',
    justifyContent: 'center',
    width: '30%',
    padding: 4,
    borderRadius: 8,
  },
  fishSizeOuterContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 8,
    marginTop: 8,
  },
  fishSizeLabel: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  },
  fishSizeResutlts: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
  },
  note: {
    textAlign: 'center',
    color: 'white',
    fontSize: 10,
  },
  bottomMargin: {
    marginBottom: 16,
  },
  resultsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
  }

});
