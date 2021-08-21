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
  const { onPress, showDates = true } = props;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.schBg }]}>
      <Text
        style={[
          styles.team,
          { color: theme.primaryText, fontFamily: theme.fontRegular },
        ]}>
        U8 Markham Houseleague
      </Text>
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.header,
            { color: theme.schText, fontFamily: theme.fontBold },
          ]}>
          {currentDate.format('MMMM')}
        </Text>
        <TouchableOpacity onPress={onPress} style={styles.viewCalenderLink}>
          <Text style={[{ color: theme.link, fontFamily: theme.fontRegular }]}>
            Calendar
          </Text>
          <Icon name="chevron-forward-outline" size={30} color={theme.link} />
        </TouchableOpacity>
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginLeft: 10,
    paddingTop: 50,
    paddingLeft: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
  },
  team: {
    fontSize: 18,
    marginBottom: 20,
  },
  dateListContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  dateListInnerContainer: {},
  dateContainer: {
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    paddingRight: 20,
  },
  viewCalenderLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
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
