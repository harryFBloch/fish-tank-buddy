import { Notif, NotificationsData, RootState } from "..";
import { ActionType } from "../actionTypes";
import { ThunkDispatchType, ThunkResult } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from "expo-notifications";

export const saveNotifications = (key: keyof NotificationsData, days: number, hour: number, minute: number, am: boolean, enabled: boolean): ThunkResult<Promise<void>> =>
async (dispatch: ThunkDispatchType, getState: () => RootState): Promise<void> => {
    cancelAllNotifs()
    .then(()=> {
        const notifs = getState().notifications
        let newNotifs = {...notifs};
        Object.keys(notifs).forEach((notifKey) => {
            const notif = {...notifs[notifKey as keyof NotificationsData]}
            notif.ids = [];
            if (key === notifKey) {
                notif.enabled = enabled;
                notif.am = am;
                notif.days = days;
                notif.hours = hour;
                notif.minutes = minute;
            }
            if (notif.enabled) {
                getNextDates(notif.days).forEach((date) => {
                    const dateTime = date
                    const hours = key === notifKey ? hour : notif.hours
                    dateTime.setMinutes(key === notifKey ? minute : notif.minutes);
                    dateTime.setHours(am ? hours : hours + 12);
                    scheduleNotifiaction(dateTime, notif.message)
                    .then(id => notif.ids.push(id))
                })
            }
            newNotifs[notifKey as keyof NotificationsData] = notif;
        })
        console.log(newNotifs.feed)
        dispatch({type: ActionType.SAVE_NOTIFICATIONS, notifications: newNotifs})
        AsyncStorage.setItem("notifications", JSON.stringify(getState().notifications))
        .then(() => console.log("Saved notifications locally"))
        .catch(e => console.error(e))
    })
}

const scheduleNotifiaction = async (date: Date, message: string): Promise<string> => {
    const trigger = date
    const res = await Notifications.requestPermissionsAsync()
    if(res.granted) {
        const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Fish Tank Calculator",
                    body: message
                },
                trigger
            })
        return id;         
    } else {
        return Promise.reject("error")
    }
}

const getNextDates = (intervalDays: number): Date[] => {
    const nextDates: Date[] = [];
    let startDate = new Date();
    for (let i = 0; i < 10; i++) {
      const nextDate = new Date(startDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);
      nextDates.push(nextDate);
      startDate = nextDate;
    }
    return nextDates;
}

  
const cancelAllNotifs = async (): Promise<void> => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log("Cancelled all notifications");
    } catch (e) {
        return console.error(e);
    }
}

export const getNotifications = (): ThunkResult<Promise<void>> =>
async (dispatch: ThunkDispatchType, getState: () => RootState): Promise<void> => {
    const notificationsString = await AsyncStorage.getItem("notifications");
    if (notificationsString) {
        const notifications = await JSON.parse(notificationsString);
        dispatch({type: ActionType.GET_NOTIFICATIONS, notifications: notifications})
    }
}