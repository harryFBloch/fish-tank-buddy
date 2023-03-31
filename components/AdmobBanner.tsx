import React, {ReactElement, useEffect, useState} from 'react';
import mobileAds, { MaxAdContentRating, TestIds, BannerAd, BannerAdSize, MobileAds } from 'react-native-google-mobile-ads';
import { PermissionResponse, requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { SafeAreaView, StatusBar, Platform } from 'react-native';


export const AdMobBannerComponent = (): ReactElement => {
  const [trackingStatus, setTrackingStatus] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    requestTrackingPermissionsAsync()
    .then((status: PermissionResponse) => {
      setTrackingStatus(status.granted);
    })
    mobileAds().initialize()
    .then((res) => {
      setLoaded(true);
      console.log('ads initialized', {res});
      // mobileAds().openAdInspector()
    })
    .catch((e) => console.log({AdmobInitError: e}))
  },[])
  return (
    <SafeAreaView style={{ position: 'absolute', top: 0}}>
      {loaded &&
        <BannerAd unitId={'ca-app-pub-6336588907969710/3487816655'} size={BannerAdSize.BANNER}
          requestOptions={{requestNonPersonalizedAdsOnly: !trackingStatus}}
        />
        // <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.BANNER}
        //   requestOptions={{requestNonPersonalizedAdsOnly: !trackingStatus}}
        // />
      }
    </SafeAreaView>
  )
}

export default AdMobBannerComponent