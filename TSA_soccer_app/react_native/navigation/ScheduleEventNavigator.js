import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import EventScreen from '../screens/EventScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import ScheduleNavigator from '../navigation/ScheduleNavigator';
import CreateEvent from '../components/Schedule/CreateEvent';

const Stack = createStackNavigator();

const ScheduleEventNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Schedule"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Schedule" component={ScheduleNavigator} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEvent} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default ScheduleEventNavigator;
