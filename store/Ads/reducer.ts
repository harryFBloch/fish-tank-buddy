import { ActionType } from "../actionTypes";
import { RootAction } from "..";
import { Ads, AdsTemplate} from './types';

const initialState: Ads =  AdsTemplate;

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  let newState = {...state}
  switch (action.type) {
    case ActionType.SET_TRACKING:
      return {...state, requestNonPersonalizedAdsOnly: action.requestNonPersonalizedAdsOnly}
    case ActionType.SHOW_INTER:
      return {...state, showInter: true}
    case ActionType.CLOSE_INTER:
      return {...state, showInter: false}
    default:
      return state;
  }
}