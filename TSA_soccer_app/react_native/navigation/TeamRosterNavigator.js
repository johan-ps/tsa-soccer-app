import React, { useEffect, useCallback, useState } from 'react';
import { useColorScheme, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import PatientProfileScreen from '../screens/PlayerProfileScreen'
import TeamScreen from '../screens/TeamScreen';

const Stack = createStackNavigator();

const TeamRosterNavigator = () => {

  return (
    <Stack.Navigator 
      initialRouteName="Team" 
      screenOptions={{
        headerShown: false
      }}
    > 
      <Stack.Screen name="Team" component={TeamScreen} />
      <Stack.Screen name="PlayerProfile" component={PatientProfileScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  
});

export default TeamRosterNavigator;
