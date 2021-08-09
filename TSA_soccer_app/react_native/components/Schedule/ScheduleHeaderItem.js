import { ThemeProvider } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

const ScheduleHeaderItem = props => {
  const { onPress, current, date } = props;
  const theme = useSelector(state => state.theme.colors);

  return (
    <TouchableHighlight
      onPress={onPress}
      style={[
        styles.touchableContainer,
        { backgroundColor: current ? '#ed2f2f' : theme.primaryBg },
      ]}
      underlayColor="#DDDDDD">
      <View style={{ alignItems: 'center', width: 50 }}>
        <View style={styles.container}>
          <Text
            style={[styles.dayOfWeek, { color: current ? 'white' : 'red' }]}>
            {date.format('dd')[0]}
          </Text>
          <Text
            style={[
              styles.dayOfMonth,
              { color: current ? 'white' : theme.secondaryText },
            ]}>
            {date.format('D')}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    borderRadius: 30,
    height: 80,
    width: 50,
  },
  container: {
    borderRadius: 30,
    height: 80,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOfWeek: {
    color: 'white',
    fontSize: 16,
    marginBottom: 3,
  },
  dayOfMonth: {
    color: 'white',
    fontSize: 18,
  },
});

export default ScheduleHeaderItem;
