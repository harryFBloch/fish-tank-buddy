import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Notifications from "expo-notifications";
import Home from './pages/Home';
import { Provider } from 'react-redux';
import store from './store';


export default function App() {

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, [])

  return (
    <Provider store={store}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled' automaticallyAdjustKeyboardInsets={true}>
        <Home/>
        <StatusBar style="auto" />
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
