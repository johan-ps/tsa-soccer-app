import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { UiImage } from '../components/_components';
import { Calendar } from 'react-native-calendars';
import CalendarCard from '../components/Schedule/CalendarCard';
import moment from 'moment';
const loadingLottieAnim = require('../assets/img/spinning-anim.json');
import AnimScrollView from '../components/AnimScrollView';
import DropdownSwitch from '../components/Schedule/DropdownSwitch';
import * as loaderActions from '../store/actions/LoaderActions';
import * as eventActions from '../store/actions/EventActions'

const CalendarScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [createEvent, setCreateEvent] = useState(false);
  const CURRENT_DATE = new Date();
  const [selectedDate, setSelectedDate] = useState(CURRENT_DATE);
  const [markedDates, setMarkedDates] = useState({});
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const userId = userData && userData.id;
  const events = useSelector(state => state.events);
  const eventsToday = events && events.today;
  console.log("Joell eventstoday", eventsToday);
  const eventDates = events && events.dates;
  const options = useMemo(() => {
    return [
      { label: 'Calender', id: 0 },
      { label: 'Daily', id: 1 },
    ];
  }, []);
  const [mode, setMode] = useState(options[0]);
  const dispatch = useDispatch();

  const loadEventsOnDate = useCallback(
    async (date, isReload = false) => {
      console.log("Joell date", date);
      if(!isReload){
        dispatch(loaderActions.updateLoader(true));
      }
      try {
        await dispatch(eventActions.getEventsOnDate(moment.utc(date).format('YYYY-MM-DD'), userId));
      } 
      catch (err) {
        console.log(err);
      } 
      finally {
        if(!isReload){
          dispatch(loaderActions.updateLoader(false));
        }
      }
    }, 
    [dispatch]
  );

  const loadEventDatesForMonth = useCallback(
    async (date) => {
      dispatch(loaderActions.updateLoader(true));
      try {
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const startOfMonth = moment(firstDay).format('YYYY-MM-DD');
        const endOfMonth = moment(lastDay).format('YYYY-MM-DD');
        console.log("Joell startofmonth", startOfMonth);
        console.log("Joell endOfMonth", endOfMonth);
        await dispatch(eventActions.getEventDatesByMonth(startOfMonth, endOfMonth));
      } 
      catch (err) {
        console.log(err);
      } 
      finally {
        dispatch(loaderActions.updateLoader(false));
      }
    }, 
    [dispatch]
  );

  useEffect(() => {
    getSelectedDayEvents(CURRENT_DATE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadEventsOnDate(CURRENT_DATE, false);
  }, [dispatch, loadEventsOnDate]);

  useEffect(() => {
    loadEventDatesForMonth(CURRENT_DATE);
    if(eventDates){
      setMonthDots(eventDates);
    }
  }, [dispatch, loadEventDatesForMonth]);

  // useEffect(() => {
    
  // }, [eventDates])

  const getSelectedDayEvents = date => {
    console.log("Joell date", date);
    let newMarkedDates = { ...markedDates };
    console.log("Joell eventDates", eventDates);
    let hasEvents = false;
    if(eventDates){
      eventDates.forEach(newDate => {
        if(new Date(newDate.date) == new Date(selectedDate)){
          hasEvents = true;
          return;
        }
      })
    }
    console.log("Joell hasEvents", hasEvents);
    if(hasEvents){
      newMarkedDates[selectedDate] = {
        marked: true,
        dotColor: 'red',
      };
    }
    else{
      delete newMarkedDates[selectedDate];
    }
    newMarkedDates[date] = {
      ...newMarkedDates[date],
      selected: true,
      color: 'red',
      textColor: '#FFFFFF',
      startingDay: true,
      endingDay: true,
    };
    console.log("Joell newMarkedDates", newMarkedDates);
    setSelectedDate(date);
    setMarkedDates(newMarkedDates);
    loadEventsOnDate(new Date(date), false);
  };

  const setMonthDots = (dates) => {
    let newMarkedDates = { ...markedDates };
    console.log("Joell before newMarkedDates", newMarkedDates);

    dates.forEach(date => {
      newMarkedDates[moment.utc(date.date).format('YYYY-MM-DD')] = {
        ...newMarkedDates[moment.utc(date.date).format('YYYY-MM-DD')],
        marked: true,
        dotColor: 'red',
      }
    });
    console.log("Joell newMarkedDates", newMarkedDates);
    setMarkedDates(newMarkedDates);
  }

  const onChangeRouteHandler = id => {
    setMode(options[id]);
    if (id === 1) {
      navigation.navigate('Daily');
    } else {
      navigation.navigate('Calender');
    }
  };

  useFocusEffect(() => {
    setMode(options[0]);
  });

  return (
    <SafeAreaView style={{ backgroundColor: theme.schBg }}>
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.team,
            { color: theme.primaryText, fontFamily: theme.fontRegular },
          ]}>
          U8 Markham Houseleague
        </Text>
        <DropdownSwitch
          value={mode}
          options={options}
          onPress={onChangeRouteHandler}
        />
      </View>
      <View style={styles.headerOffsetContainer}>
        <View
          style={[styles.bodyContainer, { backgroundColor: theme.secondaryBg }]}
        />
        <Calendar
          current={CURRENT_DATE}
          style={[
            styles.calenderContainer,
            { width: width - 40, backgroundColor: theme.cardBg },
          ]}
          onDayPress={day => {
            getSelectedDayEvents(day.dateString);
          }}
          disableMonthChange={false}
          renderHeader={date => {
            return (
              <View style={styles.calenderHeaderContainer}>
                <Text
                  style={[
                    styles.calenderHeader,
                    { fontFamily: theme.fontRegular, color: theme.primaryText },
                  ]}>
                  {moment(new Date(date)).format('MMMM') +
                    ', ' +
                    moment(new Date(date)).format('YYYY')}
                </Text>
              </View>
            );
          }}
          theme={{
            todayTextColor: 'red',
            textSectionTitleColor: 'white',
            selectedDayBackgroundColor: 'red',
            textDayFontSize: 18,
            textMonthFontSize: 24,
            textDayHeaderFontSize: 15,
            backgroundColor: theme.cardBg,
            calendarBackground: theme.cardBg,
            arrowColor: 'red',
            textDayFontWeight: '400',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            'stylesheet.calendar.header': {
              month: {
                justifyContent: 'flex-start',
              },
            },
          }}
          markingType={'period'}
          markedDates={markedDates}
        />
      </View>
      <AnimScrollView
        scrollOffset={0}
        loadingLottieAnim={loadingLottieAnim}
        backgroundColor={theme.secondaryBg}
        load={() => {
          loadEventDatesForMonth(moment.utc(CURRENT_DATE).format('MM'), moment.utc(CURRENT_DATE).format('YYYY'));
          loadEventsOnDate(selectedDate, true)
        }}
        onlyPullToRefresh={true}>
        <View style={{ marginTop: 20 }}>
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
      </AnimScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  calenderContainer: {
    borderRadius: 15,
    padding: 10,
    elevation: 20,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 20 },
    zIndex: 10,
  },
  calenderHeaderContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  calenderHeader: {
    fontSize: 24,
  },
  headerOffsetContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bodyContainer: {
    height: 900,
    position: 'absolute',
    width: '100%',
    top: 117,
  },
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  team: {
    fontSize: 18,
  },
  calendarCardContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 15,
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
});

export default CalendarScreen;
