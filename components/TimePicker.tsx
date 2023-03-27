import React, { ReactElement, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Button, Switch } from '@rneui/themed';
import { Notif } from '../store';

type Props = {
  callback: (days: number, hours: number, minutes: number, am: boolean, enabled: boolean) => void;
  notif: Notif
}

const TimePicker = ({ callback, notif }: Props) => {
  const [days, setDays] = useState(notif.days);
  const [selectedHour, setSelectedHour] = useState<number>(notif.hours);
  const [selectedMinute, setSelectedMinute] = useState<number>(notif.minutes);
  const [am, setAm] = useState(notif.am);
  const [enabled, setEnabled] = useState(notif.enabled);

  useEffect(() => {
    setEnabled(notif.enabled);
    setDays(notif.days);
    setSelectedHour(notif.hours);
    setSelectedMinute(notif.minutes);
    setAm(notif.am);
  }, [notif])

  const handleHourPress = (hour: number) => {
    console.log({hour})
    setSelectedHour(Number(hour));
  };

  const handleMinutePress = (minute: number) => {
    setSelectedMinute(minute);
  };

  const handleAmPress = (am: boolean) => {
    setAm(am);
  }

  const renderHours = (): ReactElement[] => {
    const hours: ReactElement[] = []
    for (let i = 1; i <= 12; i++) {
      hours.push(<Picker.Item label={String(i)} value={i} key={`${i}-hour`}/>)
    }
    return hours
  }

  const renderMinutes = (): ReactElement[] => {
    const hours: ReactElement[] = []
    for (let i = 0; i <= 60; i++) {
      hours.push(<Picker.Item label={String(i)} value={i} key={`${i}-minute`}/>)
    }
    return hours
  }

  const renderPickerDays = (): ReactElement[] => {
    let days: ReactElement[] = [];
      for (let i = 1; i <= 30; i++) {
        days.push(<Picker.Item label={String(i)} value={i} key={`${i} - days`} style={styles.pickerItem}/>);
      }
    return days
  }

  return (
    <View>
      <View style={styles.amContainer}>
        <Text style={styles.amLabel}>{enabled === true ? 'Disable' : 'Enable'}:</Text>
        <Switch value={enabled} onChange={() => setEnabled(!enabled)}/>
      </View>
      {enabled === true &&
      <>
      <View style={styles.amContainer}>
        <Text style={styles.amLabel}>{am === true ? 'AM' : 'PM'}:</Text>
        <Switch value={am} onChange={() => setAm(!am)}/>
      </View>

      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Text style={styles.whiteText}>Every</Text>
          <Picker style={styles.picker} selectedValue={days} onValueChange={(e) => setDays(Number(e))} itemStyle={styles.pickerItem}>
            {renderPickerDays()}
          </Picker>
          <Text style={{...styles.whiteText, marginRight: 8}}>Days.</Text>
        </View>

        <View style={styles.rowContainer}>
          <Text style={styles.whiteText}>At:</Text>
          <Picker style={styles.picker} selectedValue={selectedHour} itemStyle={styles.pickerItem} onValueChange={(e) => setSelectedHour(Number(e))}>
            {renderHours()}
          </Picker>
          <Text style={styles.whiteText}>:</Text>
          <Picker style={styles.picker} selectedValue={selectedMinute} itemStyle={styles.pickerItem} onValueChange={handleMinutePress}>
            {renderMinutes()}
          </Picker>
        </View>
      </View>
      <Button onPress={() => callback(days, Number(selectedHour), Number(selectedMinute), am, enabled)}>Set Notification</Button>
      </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  picker: {
    padding: 0,
    margin: 0,
    width: 90,
    marginLeft: -10,
    marginRight: -10,
    color: 'white',
  },
  pickerItem: {
    fontSize: 14,
    height: 44,
    marginLeft: 5,
    marginRight: 5,
    color: 'white',
  },
  amContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  amLabel: {
    marginRight: 8,
    color: 'white',
  },
  rowContainer:{
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whiteText: {
    color: 'white',
  }
});

export default TimePicker;
