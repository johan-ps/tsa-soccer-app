import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import EventScreen from '../screens/EventScreen';
import ScheduleScreen from '../screens/ScheduleScreen';

const Stack = createStackNavigator();

const ScheduleEventNavigator = () => {

  return (
    <Stack.Navigator 
      initialRouteName="Schedule" 
      screenOptions={{
        headerShown: false
      }}
    > 
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  
});

export default ScheduleEventNavigator;
