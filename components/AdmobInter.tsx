import React, {ReactElement, useEffect, useState} from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { PermissionResponse, requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { connect } from 'react-redux';
import { actions, RootState } from '../store';
import { ThunkDispatchType } from '../store/types';
import { bindActionCreators } from 'redux';

interface ReduxStateProps {
  showInter: boolean,
  requestNonPersonalizedAdsOnly: boolean,
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  showInter: state.Ads.showInter,
  requestNonPersonalizedAdsOnly: state.Ads.requestNonPersonalizedAdsOnly
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  closeInter: () => Promise<void>
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  closeInter: actions.ads.closeInter
}, dispatch);

type inheritedProps = {
  callBack: () => void
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & inheritedProps


export const AdMobInter = ({showInter, requestNonPersonalizedAdsOnly, closeInter, callBack}: Props): ReactElement => {

  const [interAd, setInterAd] = useState<InterstitialAd>();
  const [loaded, setLoaded] = useState(false);
  const adUnitId = 'ca-app-pub-6336588907969710/9646030896';
  // const adUnitId = TestIds.INTERSTITIAL;


  useEffect(() => {
    requestTrackingPermissionsAsync()
    .then(() => {
      const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: requestNonPersonalizedAdsOnly,
      keywords: ['fish tank', 'aquarium'],
      });
      setInterAd(interstitial);
      const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        setLoaded(true);
      });
  
      interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        console.log('Error ADMOB', {error})
        if(showInter){
          closeInter();
          callBack();
        }
      })
  
      interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('ADMOB inter closed');
        interstitial.load();
        closeInter();
        callBack();
      })
  
      // Start loading the interstitial straight away
      interstitial.load();
      return unsubscribe;
    })

  },[])

  useEffect(() => {
    if(showInter && loaded) {
      interAd?.show()
      .then(() => {
        console.log('ADMOB inter shown then')
      })
      .catch((error) => {
        console.log('ADMOB inter shown catch', {error})
      })
    }else if (showInter && !loaded) {
      closeInter();
      callBack();

    }
  }, [showInter, loaded])

  return (
    <></>
  )
}
//write a function returning two days from now

export default connect(mapStateToProps, mapDispatchToProps)(AdMobInter);

