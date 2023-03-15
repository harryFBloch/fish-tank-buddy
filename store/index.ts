import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';
import * as adActions from './Ads/actions';
import { AdsAction } from './Ads/types';


export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const actions = {
  ads: adActions,
};

export * from './MiscTypes';
export * from './Ads/types';

export type RootAction = AdsAction; 
export type RootState = StateType<typeof rootReducer>;