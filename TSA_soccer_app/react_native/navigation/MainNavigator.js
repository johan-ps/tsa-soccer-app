import React, { useEffect, useCallback, useState } from 'react';
import { useColorScheme, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import MessagesScreen from '../screens/MessagesScreen';
import TeamScreen from '../screens/TeamScreen';
import MoreScreen from '../screens/MoreScreen';
import * as ThemeActions from '../store/actions/ThemeActions';
import TeamRosterNavigator from './TeamRosterNavigator';

const MainNav = createBottomTabNavigator();

const MainNavigator = () => {
  const dispatch = useDispatch(); // use to dispatch an action
  const scheme = useColorScheme(); // get phone's native theme style
  const theme = useSelector(state => state.theme.colors);

  // run function whenever dispatch or scheme changes
  useEffect(() => {
    if (scheme === 'dark') {
      // dispatch(ThemeActions.updateTheme(scheme));
    }
  }, [dispatch, scheme]);

  return (
    <MainNav.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Schedule') {
            iconName = 'calendar';
          } else if (route.name === 'Team') {
            iconName = 'people';
          } else if (route.name === 'Messages') {
            iconName = 'send';
          } else if (route.name === 'More') {
            iconName = 'apps';
          }

          // You can return any component that you like here!
          //return <Ionicons name={iconName} size={size} color={color} />;
          return (
            <View style={styles.tabBarIconContainer}>
              <Icon
                name={iconName}
                color={focused ? theme.primaryIconClr : theme.secondaryIconClr}
                size={focused ? 23 : 21}
              />
              <Text
                numberOfLines={1}
                style={{
                  color: focused
                    ? theme.primaryIconClr
                    : theme.secondaryIconClr,
                  fontSize: focused ? 12 : 10,
                  top: 2,
                }}>
                {route.name}
              </Text>
            </View>
          );
        },
      })}
      tabBarOptions={{
        showLabel: false,
        style: {
          ...styles.tabBar,
          backgroundColor: theme.primaryBgClr,
        },
      }}>
      <MainNav.Screen name="Home" component={HomeScreen} />
      <MainNav.Screen name="Schedule" component={ScheduleScreen} />
      <MainNav.Screen name="Team" component={TeamRosterNavigator} /> 
      <MainNav.Screen name="Messages" component={MessagesScreen} />
      <MainNav.Screen name="More" component={MoreScreen} />
    </MainNav.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        top: 10,
      },
    }),
  },
  tabBar: {
    position: 'relative',
    ...Platform.select({
      android: {
        height: 56,
      },
    }),
  },
});

export default MainNavigator;
