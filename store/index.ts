import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';
import * as adActions from './Ads/actions';
import { AdsAction } from './Ads/types';
import * as notificationActions from './Notifications/actions';
import { NotificationsAction } from './Notifications/types';


export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const actions = {
  ads: adActions,
  notifications: notificationActions,
};

export * from './MiscTypes';
export * from './Ads/types';
export * from './Notifications/types';

export type RootAction = AdsAction | NotificationsAction;  
export type RootState = StateType<typeof rootReducer>;