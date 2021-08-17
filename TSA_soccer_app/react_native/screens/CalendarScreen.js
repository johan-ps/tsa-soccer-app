import React, { useState, useEffect } from 'react';
import {useSelector} from 'react-redux'
import { Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import CalendarCard from '../components/Schedule/CalendarCard';
import { Events } from '../data/events';
import moment from 'moment';


const CalendarScreen = () => {
  const { width } = useWindowDimensions();
  const [createEvent, setCreateEvent] = useState(false);
  const CURRENT_DATE = new Date();
  const [selectedDate, setSelectedDate] = useState(CURRENT_DATE);
  const [markedDates, setMarkedDates] = useState({});
  const theme = useSelector(state => state.theme.colors);


  useEffect(() => {
    getSelectedDayEvents(moment().format('YYYY-MM-DD'))
  }, [])

  const getSelectedDayEvents = date => {
    let newMarkedDates = {...markedDates};
    delete newMarkedDates[selectedDate];
    newMarkedDates[date] = { selected: true, color: 'red', textColor: '#FFFFFF', startingDay: true, endingDay: true};
    setSelectedDate(date);
    setMarkedDates(newMarkedDates)
  };

  return (
    <View style={{ marginTop: 20, alignItems: 'center', backgroundColor: 'transparent'}}>
      <View style={{backgroundColor: '#f5f5f5', height: 900, position: 'absolute', width: '100%', top: 117}}/>
      <Calendar
        current={CURRENT_DATE}
        style={{width: width - 40, height: 370, backgroundColor: 'white', borderRadius: 15}}
        onDayPress={day => {
          getSelectedDayEvents(day.dateString);
        }}
        disableMonthChange={false}
        renderHeader={(date) => {
          return (
            <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
              <Text style={{fontWeight: '500', fontSize: 24}}>{moment(new Date(date)).format('MMMM') + ', ' + moment(new Date(date)).format('YYYY')}</Text>
            </View>
          )
        }}
        theme={{
          todayTextColor: 'red',
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
              justifyContent: 'flex-start'
            }
          }
        }}
        markingType={'period'}
        markedDates={markedDates}
      />
      <View style={{marginTop: 20}}>
        <CalendarCard item={Events[0]}/>
      </View>
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
      