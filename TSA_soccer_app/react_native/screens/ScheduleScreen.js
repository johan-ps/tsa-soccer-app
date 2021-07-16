import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { AddButton, UiButton } from '../components/_components';
import CreateEvent from '../components/CreateEvent';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

const ScheduleScreen = ({ navigation }) => {
  const [createEvent, setCreateEvent] = useState(false);

  return (
    <View style={styles.container}>
      <UiButton label="Create" onPress={() => {}} />
      <UiButton
        label="Open Event"
        onPress={() => navigation.navigate('Event')}
      />
      <Text style={styles.text}>Schedule</Text>
      <AddButton
        onPress={() => {
          setCreateEvent(true);
        }}
      />
      <CreateEvent
        visible={createEvent}
        onClose={() => {
          setTimeout(() => {
            setCreateEvent(false);
          }, 100);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    color: 'red',
  },
  calender: {
    height: '100%',
    width: 500,
    marginTop: 100,
  },
});

export default ScheduleScreen;
