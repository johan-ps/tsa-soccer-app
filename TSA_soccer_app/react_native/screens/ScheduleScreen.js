import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActionSheetIOS,
  Alert,
  Platform,
} from 'react-native';
import { AddButton, UiImage } from '../components/_components';
import moment from 'moment';
import ScheduleHeader from '../components/Schedule/ScheduleHeader';
import ScheduleCardSmall from '../components/Schedule/ScheduleCardSmall';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Events } from '../data/events';
import CalendarCard from '../components/Schedule/CalendarCard';
import AnimScrollView from '../components/AnimScrollView';
const loadingLottieAnim = require('../assets/img/spinning-anim.json');
import * as eventsActions from '../store/actions/EventActions';
import { useFocusEffect } from '@react-navigation/native';
import * as tabbarActions from '../store/actions/TabbarActions';
import * as loaderActions from '../store/actions/LoaderActions';

const ScheduleScreen = ({ navigation, events }) => {
  const addBtnRef = useRef();
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const teams = useSelector(state => state.teams);
  const [currentTeam, setCurrentTeam] = useState(teams[0])
  const userId = userData && userData.id;
  const eventsToday = events.today;
  const eventsUpcoming = events.upcoming;
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshEnabled, setRefreshEnabled] = useState(true);

  useFocusEffect(() => {
    dispatch(tabbarActions.updateVisibility(true));
  });

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

  const loadEventsFromDate = useCallback(
    async (date, isReload = false, teamId = currentTeam && currentTeam.id) => {
      if (!isReload) {
        dispatch(loaderActions.updateLoader(true));
      }
      try {
        await dispatch(
          eventsActions.getEventsFromDate(
            '2021-09-02',
            // moment(date).format('YYYY-MM-DD'),
            userId,
            teamId
          ),
        );
      } catch (err) {
        console.log(err);
      } finally {
        if (!isReload) {
          dispatch(loaderActions.updateLoader(false));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  useEffect(() => {
    loadEventsFromDate(new Date());
  }, [dispatch, navigation])

  useEffect(() => {
    loadEventsFromDate(new Date());
  }, [dispatch, loadEventsFromDate, userId]);

  const onAddClicked = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Add Game', 'Add Practice', 'Add Other'],
          tintColor: 'red',
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark',
        },
        buttonIndex => {
          if (buttonIndex === 0) {
          } else if (buttonIndex === 1) {
            navigation.navigate('CreateEvent', {
              type: 'Game',
              selectedDate: selectedDate,
            });
          } else if (buttonIndex === 2) {
            navigation.navigate('CreateEvent', {
              type: 'Practice',
              selectedDate: selectedDate,
            });
          } else if (buttonIndex === 3) {
            navigation.navigate('CreateEvent', {
              type: 'Other',
              selectedDate: selectedDate,
            });
          }
        },
      );
    } else {
      Alert.alert(
        'Create Event',
        'Select what type of event you would like to create.',
        [
          {
            text: 'Add Game',
            onPress: () => {
              navigation.navigate('CreateEvent', {
                type: 'Game',
              });
            },
          },
          {
            text: 'Add Practice',
            onPress: () => {
              navigation.navigate('CreateEvent', {
                type: 'Practice',
              });
            },
          },
          {
            text: 'Add Other',
            onPress: () => {
              navigation.navigate('CreateEvent', {
                type: 'Other',
              });
            },
          },
        ],
        {
          cancelable: true,
        },
      );
    }
  };

  const onClickEvent = eventId => {
    navigation.navigate('Event', {
      eventId: eventId,
    });
  };

  return (
    <View style={{ backgroundColor: theme.secondaryBg }}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView
        onScroll={onScrollHandler}
        style={styles.container}
        bounces={false}
        scrollEventThrottle={0}
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
            loadEventsFromDate={(date, reload) => loadEventsFromDate(date, reload, currentTeam.id)}
            currentTeam={currentTeam}
            onTeamChange={(team) => {
              setCurrentTeam(team);
              loadEventsFromDate(selectedDate, true, team.id);
            }}
          />
          <View>
            <AnimScrollView
              scrollOffset={0}
              loadingLottieAnim={loadingLottieAnim}
              backgroundColor={theme.secondaryBg}
              enabled={refreshEnabled}
              load={() => loadEventsFromDate(selectedDate, true, currentTeam.id)}
              onlyPullToRefresh={true}>
              <View style={[styles.bodyContainer]}>
                {eventsToday && eventsToday.length > 0 ? (
                  eventsToday.map((event, i) => (
                    <View key={i} style={styles.calendarCardContainer}>
                      <CalendarCard
                        item={event}
                        key={i}
                        onPress={() => onClickEvent(event.id)}
                      />
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
                        No Events Today
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View
                style={
                  eventsUpcoming && eventsUpcoming.length > 0
                    ? null
                    : styles.upcomingEventsContainer
                }>
                {eventsUpcoming && eventsUpcoming.length > 0 ? (
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
                      {eventsUpcoming.map((event, i) => (
                        <View key={i} style={{}}>
                          <ScheduleCardSmall
                            event={event}
                            onPress={() => onClickEvent(event.id)}
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
        <AddButton ref={addBtnRef} onPress={onAddClicked} />
      )}
    </View>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    events: state.events,
  };
}

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

export default connect(mapStateToProps)(ScheduleScreen);
