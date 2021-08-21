import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const ScheduleHeaderItem = props => {
  const { onPress, current, date } = props;
  const theme = useSelector(state => state.theme.colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.touchableContainer,
        { backgroundColor: current ? theme.schDayBgSelected : theme.schDayBg },
      ]}>
      <View style={styles.container}>
        <Text
          style={[
            styles.dayOfWeek,
            {
              color: current ? theme.schDaySelectedText : theme.schDayHeader,
              fontFamily: theme.fontMedium,
            },
          ]}>
          {date.format('ddd').toUpperCase()}
        </Text>
        <Text
          style={[
            styles.dayOfMonth,
            {
              color: current ? theme.schDaySelectedText : theme.schDayContent,
              fontFamily: theme.fontLight,
            },
          ]}>
          {date.format('D')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    borderRadius: 20,
    height: 75,
    width: 60,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    borderRadius: 20,
    height: 75,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOfWeek: {
    fontSize: 14,
    marginTop: 5,
  },
  dayOfMonth: {
    fontSize: 24,
  },
});

export default ScheduleHeaderItem;
