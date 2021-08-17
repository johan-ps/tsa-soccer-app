import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
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
  const theme = useSelector(state => state.theme.colors);

  useEffect(() => {
    if (showDates) {
      let newDatesArray = [];
      let date = moment();
      while (endDate.diff(date, 'days') >= 0) {
        newDatesArray.push(date.clone());
        date.add(1, 'days');
      }
      setDatesArray(newDatesArray);
    }
  }, [endDate, showDates]);

  useEffect(() => {
    if (showDates) {
      renderScreen();
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.header,
            { color: theme.secondaryText, fontFamily: theme.fontRegular },
          ]}>
          {currentDate.format('MMM YYYY')}
        </Text>
        <TouchableOpacity onPress={onPress} style={styles.viewCalenderLink}>
          <Text style={[{ color: theme.link, fontFamily: theme.fontRegular }]}>
            Calendar
          </Text>
          <Icon name="chevron-forward-outline" size={30} color={theme.link} />
        </TouchableOpacity>
      </View>
      {showDates ? (
        <ScrollView
          contentContainerStyle={styles.dateListInnerContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.dateListContainer}>
          {selectedDate
            ? datesArray.map(date => {
                return (
                  <View key={date.toString()} style={styles.dateContainer}>
                    <ScheduleHeaderItem
                      onPress={() => setSelectedDate(date)}
                      date={date}
                      current={selectedDate.isSame(date, 'day')}
                    />
                    {selectedDate.isSame(date, 'day') ? (
                      <View
                        style={[
                          styles.selected,
                          { backgroundColor: theme.schDayBgSelected },
                        ]}
                      />
                    ) : null}
                  </View>
                );
              })
            : null}
        </ScrollView>
      ) : null}
      {showDates ? (
        <Text
          style={[
            styles.subHeading,
            { color: theme.secondaryText, fontFamily: theme.fontRegular },
          ]}>
          Today
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dateListContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dateListInnerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  dateContainer: {
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  viewCalenderLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    paddingHorizontal: 20,
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
