import React, { useEffect, useCallback, useState } from 'react';
import { useColorScheme } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import HomeScreen from '../screens/HomeScreen';
import * as ThemeActions from '../store/actions/ThemeActions';

const MainNav = createStackNavigator();

const MainNavigator = () => {
  const dispatch = useDispatch(); // use to dispatch an action
  const scheme = useColorScheme(); // get phone's native theme style

  // run function whenever dispatch or scheme changes
  useEffect(() => {
    if (scheme === 'dark') {
      dispatch(ThemeActions.updateTheme(scheme));
    }
  }, [dispatch, scheme]);

  return (
    <MainNav.Navigator>
      <MainNav.Screen name="Home" component={HomeScreen} />
    </MainNav.Navigator>
  );
};

export default MainNavigator;
