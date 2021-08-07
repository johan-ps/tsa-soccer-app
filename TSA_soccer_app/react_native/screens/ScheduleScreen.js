import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
} from 'react-native';
import { AddButton, UiButton } from '../components/_components';
import CreateEvent from '../components/CreateEvent';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import ScheduleCard from '../components/ScheduleCard';
import ScheduleHeader from '../components/ScheduleHeader';
import moment from 'moment';
import ScheduleCardSmall from '../components/ScheduleCardSmall';
import CalenderScreen from '../screens/CalendarScreen';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

const ScheduleScreen = ({ navigation }) => {
  const [createEvent, setCreateEvent] = useState(false);
  const [viewCalender, setViewCalender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true)
  const theme = useSelector(state => state.theme.colors);

  return (
    <View style={{ backgroundColor: theme.cardBg }}>
      {viewCalender ? (
        <View>
          <SafeAreaView>
            <ScheduleHeader onPress={() => setViewCalender(!viewCalender)} />
            <CalenderScreen
              minDate={moment().subtract(1, 'day')}
              onDayPress={day => {
                console.log('selected day', day);
              }}
              renderHeader={date => {
                return <View />;
              }}
              enableSwipeMonths={true}
            />
          </SafeAreaView>
        </View>
      ) : (
        <View>
          <SafeAreaView>
            <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
              <ScheduleHeader onPress={() => setViewCalender(!viewCalender)} />
              <View style={styles.bodyContainer}>
                <ScheduleCard onPress={() => navigation.navigate('Event')} />
              </View>
              <Text
                style={[styles.subHeading, { color: theme.cardTextHeading }]}>
                Upcoming
              </Text>
              <ScrollView
                horizontal={true}
                showsVerticalScrollIndicator={false}
                style={{
                  height: 200,
                  marginLeft: 20,
                  paddingTop: 20,
                  marginRight: 20,
                }}>
                <View
                  style={{
                    paddingRight: 20,
                  }}>
                  <ScheduleCardSmall
                    setShowAddButton={setShowAddButton}
                    onPress={() => navigation.navigate('Event')}
                  />
                </View>
                <View
                  style={{
                    paddingRight: 20,
                  }}>
                  <ScheduleCardSmall
                    setShowAddButton={setShowAddButton}
                    onPress={() => navigation.navigate('Event')}
                  />
                </View>
                <View
                  style={{
                    paddingRight: 20,
                  }}>
                  <ScheduleCardSmall
                    setShowAddButton={setShowAddButton}
                    onPress={() => navigation.navigate('Event')}
                  />
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </View>
      )}
      { showAddButton &&
      <AddButton
        onPress={() => {
          navigation.navigate('CreateEvent');
        }}
      />
      }
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
  notchOffsetContainer: {
    height: 70,
    zIndex: 100,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
  },
});

export default ScheduleScreen;
