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
              fontFamily: theme.fontRegular,
            },
          ]}>
          {date.format('dd')[0]}
        </Text>
        <Text
          style={[
            styles.dayOfMonth,
            {
              color: current ? theme.schDaySelectedText : theme.schDayContent,
              fontFamily: theme.fontRegular,
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
    borderRadius: 30,
    height: 80,
    width: 50,
    marginHorizontal: 5,
  },
  container: {
    borderRadius: 30,
    height: 80,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOfWeek: {
    fontSize: 16,
    marginBottom: 3,
  },
  dayOfMonth: {
    fontSize: 18,
  },
});

export default ScheduleHeaderItem;
