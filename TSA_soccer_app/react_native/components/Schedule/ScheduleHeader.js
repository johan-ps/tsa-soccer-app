import React, { useEffect, useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import ScheduleHeaderItem from './ScheduleHeaderItem';
import DropdownSwitch from './DropdownSwitch';
import TeamSelect from './TeamSelect';

const ScheduleHeader = props => {
  const {
    onPress,
    showDates = true,
    value,
    onChange,
    loadEventsFromDate,
    currentTeam,
    onTeamChange
  } = props;
  const currentDate = moment();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const endDate = moment().add(7, 'days');
  const [datesArray, setDatesArray] = useState([]);
  const theme = useSelector(state => state.theme.colors);
  const [mode, setMode] = useState(0);
  const options = useMemo(() => {
    return [
      { label: 'Daily', id: 0 },
      { label: 'Calender', id: 1 },
    ];
  }, []);

  useEffect(() => {
    setSelectedDate(props.value);
  }, [props.value])

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
    if (value) {
      setSelectedDate(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO :: reload dates on press
  const onChangeRouteHandler = id => {
    if (props.onPress) {
      setMode(options[id]);
      if (id === 0) {
        props.onPress('Daily', id);
      } else {
        props.onPress('Calender', id);
      }
    }
  };

  const onSelectDate = date => {
    onChange(date);
    loadEventsFromDate(date);
  };

  useFocusEffect(() => {
    setMode(options[0]);
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.schBg }]}>
      <TeamSelect current={currentTeam} onSelect={onTeamChange} title="Select Teams"/>
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.header,
            { color: theme.schText, fontFamily: theme.fontBold },
          ]}>
          {currentDate.format('MMMM')}
        </Text>
        <DropdownSwitch
          options={options}
          value={mode}
          onPress={onChangeRouteHandler}
        />
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
                    onPress={() => onSelectDate(date)}
                    date={date}
                    current={moment(selectedDate).isSame(date, 'day')}
                  />
                  {moment(selectedDate).isSame(date, 'day') ? (
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
    ...Platform.select({
      ios: {
        marginTop: 20,
      },
    }),
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
