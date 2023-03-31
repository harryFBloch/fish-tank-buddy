import { Button, Card } from '@rneui/base';
import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import FloatingLabel from './FloatingLabel';
import {Picker} from '@react-native-picker/picker';
import { Segment } from './Segment';
import { BiCarbResultsData, VolumeConversion } from '../store/MiscTypes';
import { calculateBicarbonateLevels, convertVolumeUnits } from '../utils/Conversions';
import { ThunkDispatchType } from '../store/types';
import { bindActionCreators } from 'redux';
import { actions } from '../store';
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

type InheritedProps = {
  showInterCallback: () => void;
}

type Props = ReturnType<typeof mapDispatchToProps>

export const ConversionCard = ({showInter}: Props): ReactElement => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState("dKH");
  const [input, setInput] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if(selectedIndex === 1) {
      setSelectedUnit('ml')
    }else{
      setSelectedUnit('dKH');
    }
  }, [selectedIndex])

  const handleInterCallBack = () => {
    setFlip(!flip);
    setShowResults(true);
  }

  const handleBackPress = () => {
    setFlip(!flip);
    setInterval(() => {
      setShowResults(false);
    }, 2000)
  }

  const handleSegmentPress = (newIndex: number) => {
    setSelectedIndex(newIndex);
  }

  const renderConversionInputs = (): ReactElement => (
    <Card containerStyle={styles.transparent}>
      <Card.Title style={styles.resultsTitle} >Volume Conversion</Card.Title>
      <Segment selectedIndex={selectedIndex} callback={handleSegmentPress} buttons={{
            0: "Carbonate Hardness",
            1: "Measurements"
          }}/>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <FloatingLabel label={String(selectedUnit)} value={String(input)} onChangeText={(e) => setInput(Number(e))} />
        </View>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={selectedUnit}
            onValueChange={(e) => setSelectedUnit(e)}
            itemStyle={styles.whiteFont}
          >
            <Picker.Item label="drops" value="drops"/>
            <Picker.Item label="fluid Oz" value="fluidOz"/>
            <Picker.Item label="liter" value="liter"/>
            <Picker.Item label="ml" value="ml"/>
            <Picker.Item label="cup" value="cup"/>
            <Picker.Item label="pint" value="pint"/>
            <Picker.Item label="quart" value="quart"/>
            <Picker.Item label="tablespoon" value="tablespoon"/>
            <Picker.Item label="teaspoon" value="teeaspoon"/>
            <Picker.Item label="US Gallon" value="usGallon"/>
            <Picker.Item label="UK Gallon" value="ukGallon"/>

          </Picker>
        </View>
      </View>
      <Button onPress={showInter}>Calculate</Button>
    </Card>
  )

  const renderConversionResults = (volumeConversions: VolumeConversion): ReactElement => (
    <Card containerStyle={styles.transparent}>
      <Card.Title style={styles.resultsTitle} >Volume Conversion Results</Card.Title>
      <View>
        <Text style={styles.resultsText}>drops: {volumeConversions.drops}</Text>
        <Text style={styles.resultsText}>fluid Oz: {volumeConversions.fluidOz}</Text>
        <Text style={styles.resultsText}>liter: {volumeConversions.liter}</Text>
        <Text style={styles.resultsText}>ml: {volumeConversions.ml}</Text>
        <Text style={styles.resultsText}>cup: {volumeConversions.cup}</Text>
        <Text style={styles.resultsText}>pint: {volumeConversions.pint}</Text>
        <Text style={styles.resultsText}>quart: {volumeConversions.quart}</Text>
        <Text style={styles.resultsText}>tablespoon: {volumeConversions.tablespoon}</Text>
        <Text style={styles.resultsText}>teaspoon: {volumeConversions.teaspoon}</Text>
        <Text style={styles.resultsText}>US Gallon: {volumeConversions.usGallon}</Text>
        <Text style={styles.resultsText}>UK Gallon: {volumeConversions.fluidOz}</Text>

      </View>
      <Button onPress={handleBackPress}>Back</Button>
    </Card>
  )

  const renderHardness = (): ReactElement => {
    return (
      <Card containerStyle={styles.transparent}>
        <Card.Title style={styles.resultsTitle} >Bicarbonate Hardness</Card.Title>
        <Segment selectedIndex={selectedIndex} callback={handleSegmentPress} buttons={{
          0: "Carbonate Hardness",
          1: "Measurements"
        }}/>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <FloatingLabel label={String(selectedUnit)} value={String(input)} onChangeText={(e) => setInput(Number(e))} />
          </View>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={selectedUnit}
              onValueChange={(e) => setSelectedUnit(e)}
              itemStyle={styles.whiteFont}
            >
              <Picker.Item label="ppm" value="ppm"/>
              <Picker.Item label="dKH" value="dKH"/>
              <Picker.Item label="ml Per Liter" value="mlPerLiter"/>
            </Picker>
          </View>
        </View>
        <Button onPress={showInter}>Calculate</Button>
      </Card>
    )
  }

  const renderHardnessResults = (results: BiCarbResultsData): ReactElement => (
    <Card containerStyle={styles.transparent}>
      <Card.Title style={styles.resultsTitle} >Bicarbonate Hardness Results</Card.Title>
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>dKH: {results.dKH}</Text>
        <Text style={styles.resultsText}>ppm: {results.ppm}</Text>
        <Text style={styles.resultsText}>Ml Per Liter: {results.mlPerLiter}</Text>
      </View>
      <Button onPress={handleBackPress}>Back</Button>
    </Card>
  )

  const switchCard = (): ReactElement => {
    switch (selectedIndex){
      case 0:
        return <FlipCard frontCard={renderHardness()} backCard={showResults ? renderHardnessResults(calculateBicarbonateLevels(input, selectedUnit)) : <></>} flip={flip}/>
      case 1:
        return <FlipCard frontCard={renderConversionInputs()} backCard={showResults ? renderConversionResults(convertVolumeUnits(input, selectedUnit)) : <></>} flip={flip}/>
      default:
        return <></>
    }
}

  return (
    <SafeAreaView style={styles.safeArea}>
      <AdMobInter callBack={handleInterCallBack}/>
      {switchCard()}
    </SafeAreaView>
  )
}

export default connect(null, mapDispatchToProps)(ConversionCard);

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 8,
  },
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 8,
  },
  inputContainer: {
    width: '50%',
  },
  resultsTitle: {
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    color: 'white',
  },
  resultsContainer: {
    padding: 8,
    marginBottom: 8,
  },
  resultsText: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 18,
    color: '#616B76',
    textAlign: 'center',
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
  },
  transparent: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  }
});