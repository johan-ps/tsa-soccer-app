import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { AddButton, UiButton } from '../components/_components';
import CreateEvent from '../components/CreateEvent';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

const CalendarScreen = () => {
  const [createEvent, setCreateEvent] = useState(false);

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calender}
        theme={{
          todayTextColor: '#00adf5',
          textDayFontSize: 20,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 18,
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

export default CalendarScreen;
      