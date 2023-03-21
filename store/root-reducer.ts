import { combineReducers } from 'redux';
import Ads from './Ads/reducer';
import Notifications from './Notifications/reducer';

const rootReducer = combineReducers({
  Ads,
  notifications: Notifications,
});

export default rootReducer;