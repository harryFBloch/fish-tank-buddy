import { ReactElement, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Dimensions} from 'react-native';
import { Tab, Text, TabView, Icon } from '@rneui/themed';
import VolumeCalc from '../components/VolumeCalc';
import ConversionCard from '../components/ConversionCard';
import AdMobBannerComponent from '../components/AdmobBanner';

export const Home = (): ReactElement => {
  const [index, setIndex] = useState("0");
  const tabAnimations = {
    "0": {ref: useRef(new Animated.Value(1)).current},
    "1": {ref: useRef(new Animated.Value(0)).current},
    "2": {ref: useRef(new Animated.Value(0)).current}
  }

  const handleTabSwitched = (newIndex: string) => {
    if(newIndex !== index) {   
      Animated.timing(tabAnimations[index as keyof typeof tabAnimations].ref,{
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIndex(newIndex)
        Animated.timing(tabAnimations[newIndex as keyof typeof tabAnimations].ref,{
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start()
      })
    }
  }

  return (
    <>
      <AdMobBannerComponent/>
      {Number(index) === 0 && <VolumeCalc />}
      {Number(index) === 1 && <ConversionCard />}
      
      <View style={styles.tabBarContainer}>
        {Object.keys(tabAnimations).map((key) => 
          <Animated.View style={{...styles.tab,
            backgroundColor: tabAnimations[key as keyof typeof tabAnimations].ref.interpolate({
              inputRange: [0, 1],
              outputRange: ['grey', 'blue'],
            }),
            transform: [{scale: tabAnimations[key as keyof typeof tabAnimations].ref.interpolate({
              inputRange: [0, 1],
              outputRange: [1.2, 1],
            })}]}}
            key={key}
            onTouchStart={() => handleTabSwitched(key)}>
            <Icon name="home"/>
            <Text style={styles.tabLabel}>Volume</Text>
          </Animated.View>
        )}
      </View>
    </>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  tabBarContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    backgroundColor: 'blue',
  },
  tab: {
    padding: 8,
    width: '30%',
    height: '100%',
    paddingBottom: 16,
  }, 
  tabLabel: {
    textAlign: 'center',
  }
});
