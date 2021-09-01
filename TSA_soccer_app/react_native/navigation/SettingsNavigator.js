import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MoreScreen from '../screens/MoreScreen';
import LoginScreen from '../screens/LoginScreen';
import NotificationScreen from '../screens/NotificationScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

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
      <Stack.Screen name="Account" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
