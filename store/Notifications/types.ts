import { ActionType } from "../actionTypes"

export enum NotifiacationsDataKeys {
  'feed',
  'clean',
  'waterHardness'
}

export type Notif = {
  ids: string[];
  message: string;
  days: number;
  hours: number;
  minutes: number;
  enabled: boolean;
  am: boolean;
}

export const NotfTemplate = {
  ids: [],
  message: '',
  days: 1,
  hours: 0,
  minutes: 0,
  enabled: false,
  am: false,
}

export const NotificationsTemplate: NotificationsData = {
  feed: {...NotfTemplate},
  clean: {...NotfTemplate},
  waterHardness: {...NotfTemplate},
}

export type NotificationsData = {
  feed: Notif,
  clean: Notif,
  waterHardness: Notif,
}

export type NotificationsAction = 
{ type: ActionType.GET_NOTIFICATIONS, notifications: NotificationsData } |
{ type: ActionType.SAVE_NOTIFICATIONS, notifications: NotificationsData } |
{ type: ActionType.DELETE_NOTIFICATIONS, key: keyof NotificationsData}
