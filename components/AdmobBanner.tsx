import React, {ReactElement, useEffect, useState} from 'react';
import mobileAds, { MaxAdContentRating, TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { PermissionResponse, requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { SafeAreaView, StatusBar, Platform } from 'react-native';


export const AdMobBannerComponent = (): ReactElement => {
  const [trackingStatus, setTrackingStatus] = useState(true);

  useEffect(() => {
    requestTrackingPermissionsAsync()
    .then((status: PermissionResponse) => {
      setTrackingStatus(status.granted);
    })
    mobileAds().initialize()
    .then(() => {
      console.log('ads initialized');
    })
    .catch((e) => console.log({AdmobInitError: e}))
  },[])
  return (
    <SafeAreaView style={{ position: 'absolute', top: 16}}>
      <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.BANNER}
        requestOptions={{requestNonPersonalizedAdsOnly: !trackingStatus}}
      />
    </SafeAreaView>
  )
}
//write a function returning two days from now

export default AdMobBannerComponent

