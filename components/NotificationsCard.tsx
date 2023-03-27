import { BlurView } from '@react-native-community/blur';
import { Picker } from '@react-native-picker/picker';
import { Button, Card } from '@rneui/base';
import React, {ReactElement, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, NotificationsData, RootState, NotifiacationsDataKeys } from '../store';
import { ThunkDispatchType } from '../store/types';
import { Segment } from './Segment';
import TimePicker from './TimePicker';

interface ReduxStateProps {
  notifications: NotificationsData
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  notifications: state.notifications,
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  saveNotifications: (key: keyof NotificationsData, days: number, hour: number, minute: number, am: boolean, enabled: boolean) => Promise<void>
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  saveNotifications: actions.notifications.saveNotifications
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const NotificationsCard = ({ notifications, saveNotifications}: Props): ReactElement => {

  const [selectedIndex, setSelectedIndex] = useState(0);

  const notificationContent = {
    title: 'Notification Title',
    body: 'This is the notification body',
    data: { /* Optional data object */ },
    ios: {
      sound: true, // Play a sound when the notification is displayed
    },
  }

  const hanldeToggleSegment = (newIndex: number) => {
    setSelectedIndex(newIndex);
  }

  const handleSendNotification = (days: number, hours: number, minutes: number, am: boolean, enabled: boolean) => {
    //key: keyof NotificationsData, days: number, hour: number, minute: number, am: boolean, enabled: boolean
   saveNotifications( NotifiacationsDataKeys[selectedIndex] as keyof NotificationsData,days, hours, minutes, am, enabled);
  }

  const notif = notifications[NotifiacationsDataKeys[selectedIndex] as keyof NotificationsData];
  
  return (
    <BlurView style={styles.glass} blurType="dark" blurAmount={10}>
      <Card containerStyle={styles.container}>
        <Card.Title style={styles.whiteFont}>Reminders</Card.Title>
        <Segment selectedIndex={selectedIndex} callback={hanldeToggleSegment} buttons={[
          "Feed", "Clean", "Carbonate"
        ]}/>
        <View style={styles.pickerContainer}>
          <TimePicker callback={handleSendNotification} notif={notif}/>
        </View>
      </Card>
    </BlurView>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsCard);


const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderWidth: 0,
  },
  pickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  picker: {
    padding: 0,
    margin: 0,
    width: 80,
  },
  pickerItem: {
    fontSize: 14,
  },
  glass: {
    backgroundColor: 'rgba(17, 25, 40, 0.35)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.125)',
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
  },
  lightFont: {
    color: '#616B76',
  },
  whiteFont: {
    color: 'white',
  }
});