import React from 'react';
import { StyleSheet } from 'react-native';
import ScheduleEventNavigator from '../navigation/ScheduleEventNavigator';
import CalendarScreen from '../screens/CalendarScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const ScheduleTopNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          height: 0,
          width: 0,
        },
      }}>
      <Tab.Screen name="Schedule" component={ScheduleEventNavigator} />
      <Tab.Screen name="Calender" component={CalendarScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default ScheduleTopNavigator;
