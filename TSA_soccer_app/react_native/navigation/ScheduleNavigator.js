import React from 'react';
import { StyleSheet } from 'react-native';
import ScheduleScreen from '../screens/ScheduleScreen';
import CalendarScreen from '../screens/CalendarScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const SchNav = createBottomTabNavigator();

const ScheduleTopNavigator = () => {
  return (
    <SchNav.Navigator
      screenOptions={() => ({
        tabBarVisible: false,
      })}>
      <SchNav.Screen name="Schedule" component={ScheduleScreen} />
      <SchNav.Screen name="Calender" component={CalendarScreen} />
    </SchNav.Navigator>
  );
};

const styles = StyleSheet.create({});

export default ScheduleTopNavigator;
