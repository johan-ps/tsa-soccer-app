import { ThemeProvider } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import ScheduleHeaderItem from './ScheduleHeaderItem';

const ScheduleHeader = props => {
  const { onPress, showDates = true, renderScreen } = props;
  const currentDate = moment();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const endDate = moment().add(7, 'days');
  const [datesArray, setDatesArray] = useState([]);

  useEffect(() => {
    if(showDates){
      let newDatesArray = [];
      let date = moment();
      while (endDate.diff(date, 'days') >= 0) {
        newDatesArray.push(date.clone());
        date.add(1, 'days');
      }
      setDatesArray(newDatesArray);
    }
  }, []);

  useEffect(() => {
    if(showDates){
      renderScreen();
    }
  });


  return (
    <View style={[styles.container, { backgroundColor: '#d4d4d4' }]}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ justifyContent: 'flex-end', width: '50%' }}>
          <Text style={styles.header}>{showDates ? currentDate.format('MMM YYYY') : 'Calender'}</Text>
        </View>
        <TouchableOpacity
          onPress={onPress}
          style={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            width: 100,
            height: 50,
            paddingRight: 10,
            zIndex: 100,
            position: 'relative',
            left: 60,
          }}>
          <Icon
            name="calendar-sharp"
            size={30}
            color="black"
            style={{ zIndex: 0 }}
          />
        </TouchableOpacity>
      </View>
      {showDates ? (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.headerContainer}>
          {selectedDate
            ? datesArray.map(date => {
                return (
                  <View
                    key={date.toString()}
                    style={{ alignItems: 'center', marginRight: 10 }}>
                    <ScheduleHeaderItem
                      onPress={() => setSelectedDate(date)}
                      date={date}
                      current={selectedDate.isSame(date, 'day')}
                    />
                    {selectedDate.isSame(date, 'day') ? (
                      <View style={styles.selected} />
                    ) : null}
                  </View>
                );
              })
            : null}
        </ScrollView>
      ) : null}
      {showDates ? <Text style={styles.subHeading}>Today</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
  },
  selected: {
    backgroundColor: '#cf4444',
    height: 10,
    width: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default ScheduleHeader;
