import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';

const MainNav = createStackNavigator();

const MainNavigator = () => {
  return (
    <MainNav.Navigator>
      <MainNav.Screen name="Home" component={HomeScreen} />
    </MainNav.Navigator>
  );
};

export default MainNavigator;
