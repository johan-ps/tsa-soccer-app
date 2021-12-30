import React, { useEffect, useCallback, useState } from 'react';
import { useColorScheme, Platform, NativeModules } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import { Text, View, StyleSheet } from 'react-native';
import { changeNavigationBarColor } from 'react-native-navigation-bar-color';

import AnnouncementScreen from '../screens/AnnouncementScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MoreScreen from '../screens/MoreScreen';
import * as ThemeActions from '../store/actions/ThemeActions';
import TeamRosterNavigator from './TeamRosterNavigator';
import * as userActions from '../store/actions/UserActions';
import ScheduleEventNavigator from './ScheduleEventNavigator';
import SettingsNavigator from './SettingsNavigator';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import AnnouncementNavigator from './AnnouncementNavigator';

const MainNav = createBottomTabNavigator();

const MainNavigator = () => {
  const { NavigationBarColor } = NativeModules;
  const dispatch = useDispatch(); // use to dispatch an action
  const scheme = useColorScheme(); // get phone's native theme style
  const theme = useSelector(state => state.theme.colors);
  const tabBarVisible = useSelector(state => state.tabbar.visible);

  // useEffect(() => {
  //   // update theme
  //   if (scheme === 'dark') {
  //     dispatch(ThemeActions.updateTheme(scheme));
  //   }
  // }, [dispatch, scheme]);

  useEffect(() => {
    // update android system nav colour
    if (Platform.OS === 'android') {
      NavigationBarColor.changeNavigationBarColor(
        theme.bottomNavBg,
        theme.name !== 'dark',
        true,
      );
    }
  }, [NavigationBarColor, theme.bottomNavBg, theme.name]);

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
            iconName = 'appstore-o';
          }

          return (
            <View style={styles.tabBarIconContainer}>
              <Icon
                name={iconName}
                color={
                  focused ? theme.bottomNavIconSelect : theme.bottomNavIcon
                }
                size={25}
              />
            </View>
          );
        },
        tabBarVisible: tabBarVisible,
      })}
      tabBarOptions={{
        showLabel: false,
        style: {
          ...styles.tabBar,
          backgroundColor: theme.bottomNavBg,
        },
        keyboardHidesTabBar: true,
      }}>
      <MainNav.Screen name="Home" component={AnnouncementNavigator} />
      <MainNav.Screen name="Schedule" component={ScheduleEventNavigator} />
      {/* <MainNav.Screen name="Team" component={TeamRosterNavigator} /> */}
      {/* <MainNav.Screen name="Messages" component={MessagesScreen} /> */}
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
    height: 60,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    ...Platform.select({
      ios: {
        height: 90,
        paddingBottom: 30,
      },
    }),
  },
});

export default MainNavigator;
