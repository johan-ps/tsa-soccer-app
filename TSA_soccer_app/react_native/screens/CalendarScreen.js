import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import CalendarCard from '../components/Schedule/CalendarCard';
import { Events } from '../data/events';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

const CalendarScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [createEvent, setCreateEvent] = useState(false);
  const CURRENT_DATE = new Date();
  const [selectedDate, setSelectedDate] = useState(CURRENT_DATE);
  const [markedDates, setMarkedDates] = useState({});
  const theme = useSelector(state => state.theme.colors);

  useEffect(() => {
    getSelectedDayEvents(moment().format('YYYY-MM-DD'));
  }, []);

  const getSelectedDayEvents = date => {
    let newMarkedDates = { ...markedDates };
    delete newMarkedDates[selectedDate];
    newMarkedDates[date] = {
      selected: true,
      color: 'red',
      textColor: '#FFFFFF',
      startingDay: true,
      endingDay: true,
    };
    setSelectedDate(date);
    setMarkedDates(newMarkedDates);
  };

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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Schedule');
          }}
          style={styles.viewCalenderLink}>
          <Text style={[{ color: theme.link, fontFamily: theme.fontRegular }]}>
            Calendar
          </Text>
          <Icon name="chevron-forward-outline" size={30} color={theme.link} />
        </TouchableOpacity>
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
        <View style={{ marginTop: 20 }}>
          <CalendarCard item={Events[0]} />
        </View>
      </View>
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
  viewCalenderLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarScreen;
