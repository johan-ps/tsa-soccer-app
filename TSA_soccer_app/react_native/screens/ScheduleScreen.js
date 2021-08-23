import React, { useState, useCallback, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { AddButton } from '../components/_components';
import ScheduleHeader from '../components/Schedule/ScheduleHeader';
import ScheduleCardSmall from '../components/Schedule/ScheduleCardSmall';
import { useSelector, useDispatch } from 'react-redux';
import { Events } from '../data/events';
import CalendarCard from '../components/Schedule/CalendarCard';
import AnimScrollView from '../components/AnimScrollView';
const loadingLottieAnim = require('../assets/img/spinning-anim.json');

import * as eventsActions from '../store/actions/EventActions'

const ScheduleScreen = ({ navigation }) => {
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const events = useSelector(state => state.events);
  console.log("Joell events", events);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(true);
  const [refreshEnabled, setRefreshEnabled] = useState(true);

  const onScrollHandler = ({ nativeEvent }) => {
    if (nativeEvent.contentOffset.y <= 0) {
      if (!refreshEnabled) {
        setRefreshEnabled(true);
      }
    } else {
      if (refreshEnabled) {
        setRefreshEnabled(false);
      }
    }
  };

  const loadEventsFromDate = useCallback(async date => {
    try {
      // await dispatch(eventsActions.getEventsFromDate(date));
      await dispatch(eventsActions.getEvents());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);


  const onRegionChange = region => {
    setRegion(region);
  };

  useEffect(() => {
    loadEventsFromDate(new Date());
  }, [dispatch, loadEventsFromDate]);



  return (
    <View style={{ backgroundColor: theme.secondaryBg }}>
      <StatusBar barStyle={'dark-content'}/>
      <ScrollView onScroll={onScrollHandler} style={styles.container} bounces={false} alwaysBounceHorizontal={false} alwaysBounceVertical={false}>
          <View
            style={[
              styles.container,
              styles.tabBarOffset,
              { backgroundColor: theme.secondaryBg },
            ]}>
            <ScheduleHeader
              onPress={route => {
                navigation.navigate(route);
              }}
              value={selectedDate}
              onChange={(aDate) => setSelectedDate(aDate)}
              loadEventsFromDate={loadEventsFromDate}
            />
            <View>
              <AnimScrollView
                scrollOffset={0}
                loadingLottieAnim={loadingLottieAnim}
                backgroundColor={theme.secondaryBg}
                enabled={refreshEnabled}
                load={() => loadEventsFromDate(new Date())}
                onlyPullToRefresh={true}>
                <View style={[styles.bodyContainer]}>
                  {events.length > 0 ?
                    events.map((event, i) => (
                      <View key={i} style={styles.calendarCardContainer}>
                        <CalendarCard item={event} key={i} />
                      </View>
                    ))
                    :
                    <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 20}}>
                      <Text style={{fontWeight: '200'}}>No events scheduled for the selected date</Text>
                    </View>
                  }
                </View>
                <Text
                  style={[styles.subHeading, { color: theme.cardTextHeading }]}>
                  Upcoming
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cardListInnerContainer}>
                  {events.map((event, i) => (
                      <View key={i} style={{}}>
                        <ScheduleCardSmall
                          event={event}
                          onPress={() => navigation.navigate('Event')}
                        />
                      </View>
                  ))}
                </ScrollView>
                {events.length === 0 ?
                  <View style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                    <Text style={{fontWeight: '200'}}>No upcoming events scheduled</Text>
                  </View>
                  :
                  null
                }
              </AnimScrollView>
            </View>
          </View>
      </ScrollView>
      {/* {userData && userData.accessLevel > 0 && ( */}
        <AddButton
          onPress={() => {
            navigation.navigate('CreateEvent');
          }}
        />
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarCardContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  tabBarOffset: {
    marginBottom: 75,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  bodyContainer: {
    marginBottom: 20,
  },
  cardListInnerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '500',
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
