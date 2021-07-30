import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import MoreScreen from '../screens/MoreScreen';
import LoginScreen from '../screens/LoginScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createStackNavigator();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="More"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="More" component={MoreScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default SettingsNavigator;
