import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import MessagesScreen from '../screens/MessagesScreen';
import TeamScreen from '../screens/TeamScreen';
import MoreScreen from '../screens/MoreScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, View, StyleSheet } from 'react-native';

const MainNav = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <MainNav.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'Schedule') {
            iconName = 'calendar'
          } else if (route.name === 'Team') {
            iconName = 'people'
          } else if (route.name === 'Messages') {
            iconName = 'send'
          } else if (route.name === 'More') {
            iconName = 'apps'
          }

          // You can return any component that you like here!
          //return <Ionicons name={iconName} size={size} color={color} />;
          return <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
            <Icon name={iconName} color={focused ? 'red' : 'grey'} size={focused ? 23 : 21} />
            <Text style={{color: focused ? 'red' : 'grey', fontSize: focused ? 12 : 10, top: 2}}>{route.name}</Text>
          </View>
        },
      })}
      tabBarOptions={{
        showLabel:false,
        style: {
          position: 'relative',
          backgroundColor: 'white',
        }
      }}
    >
      <MainNav.Screen name="Home" component={HomeScreen} />
      <MainNav.Screen name="Schedule" component={ScheduleScreen} />
      <MainNav.Screen name="Team" component={TeamScreen} />
      <MainNav.Screen name="Messages" component={MessagesScreen} />
      <MainNav.Screen name="More" component={MoreScreen} />
    </MainNav.Navigator>
  );
};

export default MainNavigator;
