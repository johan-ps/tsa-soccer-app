import React, { useState, useCallback, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActionSheetIOS
} from 'react-native';
import { AddButton, UiImage } from '../components/_components';
import moment from 'moment';
import ScheduleHeader from '../components/Schedule/ScheduleHeader';
import ScheduleCardSmall from '../components/Schedule/ScheduleCardSmall';
import { useSelector, useDispatch } from 'react-redux';
import { Events } from '../data/events';
import CalendarCard from '../components/Schedule/CalendarCard';
import AnimScrollView from '../components/AnimScrollView';
const loadingLottieAnim = require('../assets/img/spinning-anim.json');

import * as eventsActions from '../store/actions/EventActions';

const ScheduleScreen = ({ navigation }) => {
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const events = useSelector(state => state.events);
  console.log('Joell events', events);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
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
      await dispatch(eventsActions.getEventsFromDate(moment(date).format('YYYY-MM-DD')));
      // await dispatch(eventsActions.getEvents());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

 showAlertWithThreeOptions = (title,message,options,callback) => {
    Alert.alert(title, message,  [
      { text: options[0], onPress: () => {callback(0)}},
      { text: options[1], onPress: () => {callback(1)}},
      { text: options[2], onPress: () => {callback(2)}},
    ], {
      cancelable: false,
    });
  }
  
  /**
   * This will open the action sheet for users with three options
   */
  openActionSheetwithOptions = (options, textColor, destructiveButtonIndex=3, callback) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: options,
          cancelButtonIndex: 0,
          tintColor: textColor,
          destructiveButtonIndex : destructiveButtonIndex
        },
        (buttonIndex) => {
          callback(buttonIndex)
        }
      );
    } else {
      this.showAlertWithThreeOptions('', '', options, (choice)=>{callback(choice)})
    }
  }

  useEffect(() => {
    loadEventsFromDate(new Date());
  }, [dispatch, loadEventsFromDate]);

  onAddClicked = () => {
    let eventType = 1;
    openActionSheetwithOptions(['Cancel', 'Game', 'Practice', 'Other'], 'red', 3, (index) => setEventType(index));
    navigation.navigate('CreateEvent');
  }


  return (
    <View style={{ backgroundColor: theme.secondaryBg }}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView
        onScroll={onScrollHandler}
        style={styles.container}
        bounces={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}>
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
            onChange={aDate => setSelectedDate(aDate)}
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
                {events.length > 0 ? (
                  events.map((event, i) => (
                    <View key={i} style={styles.calendarCardContainer}>
                      <CalendarCard item={event} key={i} />
                    </View>
                  ))
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      marginTop: 20,
                    }}>
                    <UiImage
                      cond={true}
                      style={styles.emptyImg}
                      source={require('../assets/img/no-events.png')}
                      resizeMode="contain"
                    />
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.heading,
                          {
                            color: theme.secondaryText,
                            fontFamily: theme.fontBold,
                          },
                        ]}>
                        No Result Found
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={styles.upcomingEventsContainer}>
                {events.length > 0 ? (
                  <View>
                    <Text
                      style={[
                        styles.subHeading,
                        { color: theme.cardTextHeading },
                      ]}>
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
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.noDataSubHeading,
                      {
                        color: theme.primaryText,
                        fontFamily: theme.fontRegular,
                      },
                    ]}>
                    No upcoming events scheduled for the selected date
                  </Text>
                )}
              </View>
            </AnimScrollView>
          </View>
        </View>
      </ScrollView>
      {userData && userData.accessLevel > 0 && (
        <AddButton
          onPress={() => {}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  upcomingEventsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImg: {
    height: 200,
    width: 200,
    borderRadius: 20,
  },
  textContainer: {
    width: '90%',
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 40,
  },
  noDataSubHeading: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 30,
    width: '75%',
  },
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
