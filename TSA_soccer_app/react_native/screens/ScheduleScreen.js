import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { AddButton, UiButton } from '../components/_components';
import CreateEvent from '../components/CreateEvent';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import ScheduleCard from '../components/ScheduleCard';
import ScheduleHeader from '../components/ScheduleHeader';
import moment from 'moment';
import ScheduleCardSmall from '../components/ScheduleCardSmall';
import CalenderScreen from '../screens/CalendarScreen';

const ScheduleScreen = ({ navigation }) => {
  const [createEvent, setCreateEvent] = useState(false);
  const [viewCalender, setViewCalender] = useState(false);

  // useEffect(() => {
  //   console.log(viewCalender);
  // }, [viewCalender]);
  return (
    <View>
      {viewCalender ? (
        <View>
          <SafeAreaView>
            {/* <CalenderScreen /> */}
          </SafeAreaView>
        </View>
      ) : (
        <View>
          <SafeAreaView>
            <View style={styles.container}>
              <ScheduleHeader />
              <View style={styles.bodyContainer}>
                <ScheduleCard onPress={() => navigation.navigate('Event')} />
              </View>
              <Text style={styles.subHeading}>Upcoming</Text>
              <View
                style={{
                  justifyContent: 'center',
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 20,
                }}>
                <ScheduleCardSmall
                  onPress={() => navigation.navigate('Event')}
                />
              </View>
            </View>
          </SafeAreaView>
          {/* <AddButton
            onPress={() => {
              setCreateEvent(true);
            }}
          />
          <CreateEvent
            visible={createEvent}
            onClose={() => {
              setCreateEvent(false);
            }}
          /> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  calender: {
    height: '100%',
    width: 500,
    marginTop: 100,
  },
  bodyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    marginLeft: 20,
  },
});

export default ScheduleScreen;
