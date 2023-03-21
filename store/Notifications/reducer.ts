import { ActionType } from "../actionTypes";
import { RootAction } from "..";
import { NotificationsData, NotificationsTemplate} from './types';

const initialState: NotificationsData =  NotificationsTemplate;

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  let newState = {...state}
  switch (action.type) {
    case ActionType.GET_NOTIFICATIONS:
      return {...action.notifications}
    case ActionType.SAVE_NOTIFICATIONS:
      return {...action.notifications}
    case ActionType.DELETE_NOTIFICATIONS:
      return {...state, [action.key]: []}
    default:
      return state;
  }
}