import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';

const HomeTabNav = createStackNavigator();

const HomeTabNavigator = () => {
  return (
    <HomeTabNav.Navigator>
      <HomeTabNav.Screen name="Home" component={HomeScreen} />
      <HomeTabNav.Screen name="Schedule" component={ScheduleScreen} />
    </HomeTabNav.Navigator>
  );
};

export default HomeTabNavigator;
