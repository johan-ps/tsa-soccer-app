import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AnnouncementScreen from '../screens/AnnouncementScreen';
import ModifyAnnouncementScreen from '../screens/ModifyAnnouncementScreen';

const Stack = createStackNavigator();

const AnnouncementNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Announcements"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Announcements" component={AnnouncementScreen} />
      <Stack.Screen
        name="ModifyAnnouncement"
        component={ModifyAnnouncementScreen}
      />
    </Stack.Navigator>
  );
};

export default AnnouncementNavigator;
