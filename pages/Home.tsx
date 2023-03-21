import { ReactElement, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Dimensions, ImageBackground} from 'react-native';
import { Tab, Text, TabView, Icon } from '@rneui/themed';
import VolumeCalc from '../components/VolumeCalc';
import ConversionCard from '../components/ConversionCard';
import AdMobBannerComponent from '../components/AdmobBanner';
import NotificationsCard from '../components/NotificationsCard';

const images = [require('../assets/images/fishTank1.png'), require('../assets/images/fishTank2.png'), require('../assets/images/fishTank3.png')]

export const Home = (): ReactElement => {
  const [index, setIndex] = useState("0");
  const [animating, setAnimating] = useState(false);
  const animation = useRef(new Animated.Value(1)).current;
  const tabAnimations = {
    "0": {ref: useRef(new Animated.Value(1)).current},
    "1": {ref: useRef(new Animated.Value(0)).current},
    "2": {ref: useRef(new Animated.Value(0)).current}
  }

  const handleTabSwitched = (newIndex: string) => {
    if(newIndex !== index && !animating) {  
      handleChange(newIndex);
      setAnimating(true); 
      Animated.timing(tabAnimations[index as keyof typeof tabAnimations].ref,{
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(tabAnimations[newIndex as keyof typeof tabAnimations].ref,{
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start()
      })
    }
  }

  const handleChange = (newIndex: string) => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 1100,
      useNativeDriver: false,
    }).start(() => {
      setIndex(newIndex)
      Animated.timing(animation, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: false,
      }).start(() => {
        setAnimating(false);
      });
    })
  };

  const translateY = animation.interpolate({
    inputRange: [0, 0.38, 0.55, 0.72, 0.81, 0.9, 0.95, 1],
    outputRange: [500, 0, 65, 0, 28, 0, 8, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.38],
    outputRange: [0, 1],
  });

  const imageFade = animation.interpolate({
    inputRange: [0,0.1, 1],
    outputRange: [0,0, 1],
  });

  return (
    <>
      <Animated.View style={{...styles.imageContainer, opacity: imageFade}}>
        <ImageBackground source={images[Number(index)]} style={styles.imageContainer}>
          <AdMobBannerComponent/>
          <Animated.View style={{transform: [{translateY}], opacity, padding: 16}}>
            {Number(index) === 0 && <VolumeCalc />}
            {Number(index) === 1 && <ConversionCard />}
            {Number(index) === 2 && <NotificationsCard />}
          </Animated.View>
        </ImageBackground>
      </Animated.View>
      
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
  imageContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
  },
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
