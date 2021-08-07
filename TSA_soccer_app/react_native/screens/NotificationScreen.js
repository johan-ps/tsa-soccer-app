import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SettingsActionBtn,
  ScreenBoilerplate,
} from '../components/_components';

const NotificationScreen = ({ navigation }) => {
  const theme = useSelector(state => state.theme.colors);
  const [shlToggle, setShlToggle] = useState(false);
  const [mhlToggle, setMhlToggle] = useState(false);
  const [ctToggle, setCtToggle] = useState(false);
  const settingsOptions = [
    {
      id: 0,
      title: 'Scarborough House League',
      mainText: theme.secondaryText,
      subText: theme.secondaryText,
      icon: {
        icon: 'football',
        color: theme.name === 'dark' ? '#bac8ff' : '#5732FB',
        type: 'round',
        size: 24,
        darkBg: theme.name === 'dark',
      },
      data: shlToggle ? 'On' : 'Off',
      actionType: 'toggle',
      value: shlToggle,
      onPress() {
        setShlToggle(!shlToggle);
      },
    },
    {
      id: 1,
      title: 'Markham House League',
      mainText: theme.secondaryText,
      subText: theme.secondaryText,
      icon: {
        icon: 'football',
        color: theme.name === 'dark' ? '#bac8ff' : '#5732FB',
        type: 'round',
        size: 24,
        darkBg: theme.name === 'dark',
      },
      data: mhlToggle ? 'On' : 'Off',
      actionType: 'toggle',
      value: mhlToggle,
      onPress() {
        setMhlToggle(!mhlToggle);
      },
    },
    {
      id: 2,
      title: 'Competitive Team',
      mainText: theme.secondaryText,
      subText: theme.secondaryText,
      icon: {
        icon: 'football',
        color: theme.name === 'dark' ? '#bac8ff' : '#5732FB',
        type: 'round',
        size: 24,
        darkBg: theme.name === 'dark',
      },
      data: ctToggle ? 'On' : 'Off',
      actionType: 'toggle',
      value: ctToggle,
      onPress() {
        setCtToggle(!ctToggle);
      },
    },
  ];

  return (
    <ScreenBoilerplate
      headingClr={theme.primaryText}
      heading="Notification Preferences"
      navLeft
      style={{ backgroundColor: theme.navBg }}
      navActionLeft={() => {
        navigation.goBack();
      }}>
      <View>
        {settingsOptions.map(setting => (
          <SettingsActionBtn key={setting.id} {...setting} />
        ))}
      </View>
    </ScreenBoilerplate>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: '#2f2c55',
    padding: 40,
    paddingTop: 50,
  },
  heading: {},
  nav: {},
  headingText: {
    color: 'white',
    fontFamily: 'Roboto-Medium',
    fontSize: 40,
    marginTop: 50,
    lineHeight: 40,
  },
  options: {
    marginTop: 40,
  },
});

export default NotificationScreen;
