import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Home from './pages/Home';


export default function App() {

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled' automaticallyAdjustKeyboardInsets={true}>
      <Home/>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
