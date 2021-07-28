import React, { useEffect, useCallback, useState } from 'react';
import { useColorScheme, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import AnnouncementScreen from '../screens/AnnouncementScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import MessagesScreen from '../screens/MessagesScreen';
import TeamScreen from '../screens/TeamScreen';
import MoreScreen from '../screens/MoreScreen';
import * as ThemeActions from '../store/actions/ThemeActions';
import TeamRosterNavigator from './TeamRosterNavigator';
import ScheduleTopNavigator from './ScheduleTopNavigator';
import * as userActions from '../store/actions/UserActions';
import ScheduleEventNavigator from './ScheduleEventNavigator';
import SettingsNavigator from './SettingsNavigator';

const MainNav = createBottomTabNavigator();

const MainNavigator = () => {
  const dispatch = useDispatch(); // use to dispatch an action
  const scheme = useColorScheme(); // get phone's native theme style
  const theme = useSelector(state => state.theme.colors);

  const loadUserData = useCallback(async () => {
    try {
      await dispatch(userActions.getUserData());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  // run function whenever dispatch or scheme changes
  useEffect(() => {
    if (scheme === 'dark') {
      dispatch(ThemeActions.updateTheme(scheme));
    }
    loadUserData();
  }, [dispatch, scheme, loadUserData]);

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
              {/* <Text
                numberOfLines={1}
                style={{
                  color: focused
                    ? theme.primaryIconClr
                    : theme.secondaryIconClr,
                  fontSize: focused ? 12 : 10,
                  top: 2,
                }}>
                {route.name}
              </Text> */}
            </View>
          );
        },
      })}
      tabBarOptions={{
        showLabel: false,
        style: {
          ...styles.tabBar,
          backgroundColor: theme.primaryBg,
        },
        keyboardHidesTabBar: true,
      }}>
      <MainNav.Screen name="Home" component={AnnouncementScreen} />
      <MainNav.Screen name="Schedule" component={ScheduleEventNavigator} />
      <MainNav.Screen name="Team" component={TeamRosterNavigator} />
      <MainNav.Screen name="Messages" component={MessagesScreen} />
      <MainNav.Screen name="More" component={SettingsNavigator} />
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
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    position: 'absolute',
    left: 7,
    right: 7,
    bottom: 5,
    height: 70,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        marginBottom: 10,
      },
    }),
  },
});

export default MainNavigator;
