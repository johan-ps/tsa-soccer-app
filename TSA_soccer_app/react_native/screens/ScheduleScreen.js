import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { AddButton, UiButton } from '../components/_components';
import CreateEvent from '../components/CreateEvent';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import ScheduleCard from '../components/ScheduleCard';
import moment from 'moment';

const ScheduleScreen = ({ navigation }) => {
  const [createEvent, setCreateEvent] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{moment().format('MMM YYYY')}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <ScheduleCard onPress={() => navigation.navigate('Event')} />
      </View>
      <AddButton
        onPress={() => {
          setCreateEvent(true);
        }}
      />
      <CreateEvent
        visible={createEvent}
        onClose={() => {
          setCreateEvent(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 50,
  },
  header: {
    fontSize: 20,
  },
  calender: {
    height: '100%',
    width: 500,
    marginTop: 100,
  },
  headerContainer: {
    paddingLeft: 40,
  },
  bodyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
});

export default ScheduleScreen;
