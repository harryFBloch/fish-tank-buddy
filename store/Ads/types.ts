import { ActionType } from "../actionTypes"

export type Ads = {
  pauseAds: boolean,
  showInter: boolean,
  requestNonPersonalizedAdsOnly: boolean,
}

export const AdsTemplate: Ads = {
  pauseAds: false, 
  showInter: false,
  requestNonPersonalizedAdsOnly: false,
}

export type AdsAction = 
{ type: ActionType.SHOW_INTER } |
{ type: ActionType.CLOSE_INTER } |
{ type: ActionType.SET_TRACKING, requestNonPersonalizedAdsOnly: boolean }
