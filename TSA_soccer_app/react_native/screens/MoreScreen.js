import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  Switch,
  StatusBar,
  ScrollView,
  Platform,
  TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import {
  SettingsActionBtn,
  UiButton,
  ScreenBoilerplate,
} from '../components/_components';
import * as ThemeActions from '../store/actions/ThemeActions';
import * as userActions from '../store/actions/UserActions';

const MoreScreen = ({ navigation }) => {
  const STYLES = ['light', 'light-content'];

  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const [statusBarStyle, setStatusBarStyle] = useState(STYLES[1]);
  const settingsOptions = [
    {
      id: 0,
      title: 'Notifications',
      mainText: theme.secondaryText,
      subText: theme.secondaryText,
      icon: {
        icon: 'notifications',
        color: theme.name === 'dark' ? '#9ad9ff' : '#1CA5EC',
        type: 'round',
        size: 24,
        darkBg: theme.name === 'dark',
      },
      iconBtn: {
        icon: 'chevron-forward',
        color: theme.actionBtnText,
        backgroundColor: theme.actionBtnBg,
        size: 24,
        darkBg: theme.name === 'dark',
      },
      onPress() {
        navigation.navigate('Notifications');
      },
    },
    {
      id: 1,
      title: 'Dark Mode',
      mainText: theme.secondaryText,
      subText: theme.secondaryText,
      icon: {
        icon: 'moon',
        color: theme.name === 'dark' ? '#bac8ff' : '#5732FB',
        type: 'round',
        size: 24,
        darkBg: theme.name === 'dark',
      },
      iconBtn: {
        icon: 'chevron-forward',
        color: theme.actionBtnText,
        backgroundColor: theme.actionBtnBg,
        size: 24,
        darkBg: theme.name === 'dark',
      },
      data: theme.name === 'dark' ? 'On' : 'Off',
      actionType: 'toggle',
      value: theme.name === 'dark',
      onPress() {
        toggleSwitch();
      },
    },
    {
      id: 2,
      title: 'Help',
      mainText: theme.secondaryText,
      subText: theme.secondaryText,
      icon: {
        icon: 'football',
        color: theme.name === 'dark' ? '#e7a889' : '#FF6B27',
        type: 'round',
        size: 24,
        darkBg: theme.name === 'dark',
      },
      iconBtn: {
        icon: 'chevron-forward',
        color: theme.actionBtnText,
        backgroundColor: theme.actionBtnBg,
        size: 24,
        darkBg: theme.name === 'dark',
      },
      onPress() {},
    },
    {
      id: 3,
      title: userData && userData.authenticated ? 'Log Out' : 'Log In',
      mainText: theme.secondaryText,
      subText: theme.secondaryText,
      icon: {
        icon: userData && userData.authenticated ? 'log-out' : 'log-in',
        color: theme.name === 'dark' ? '#eda3bd' : '#F42D5B',
        type: 'round',
        size: 24,
        darkBg: theme.name === 'dark',
      },
      iconBtn: {
        icon: 'chevron-forward',
        color: theme.actionBtnText,
        backgroundColor: theme.actionBtnBg,
        size: 24,
        darkBg: theme.name === 'dark',
      },
      async onPress() {
        if (userData && userData.authenticated) {
          await dispatch(userActions.logoutUser());
        } else {
          navigation.navigate('Login');
        }
      },
    },
  ];
  const accountOptions = {
    id: 0,
    title:
      userData && userData.authenticated
        ? `${userData.firstName} ${userData.lastName}`
        : 'Not Logged In',
    mainText: theme.secondaryText,
    subText: theme.secondaryText,
    imageSrc: userData.profileImg,
    icon: {
      icon: 'person',
      color: '#aaa6c3',
      type: 'round',
      size: 34,
      darkBg: theme.name === 'dark',
    },
    iconBtn: {
      icon: 'chevron-forward',
      color: theme.actionBtnText,
      backgroundColor: theme.actionBtnBg,
      size: 24,
      darkBg: theme.name === 'dark',
    },
    onPress() {
      if (userData && userData.authenticated) {
        navigation.navigate('Account');
      } else {
        navigation.navigate('Login');
      }
    },
  };

  const toggleSwitch = () => {
    let newTheme;
    if (theme.name === 'dark') {
      newTheme = 'light';
    } else {
      newTheme = 'dark';
    }
    dispatch(ThemeActions.updateTheme(newTheme));
    changeStatusBarStyle(newTheme);
  };

  const changeStatusBarStyle = newTheme => {
    if (newTheme === 'dark') {
      setStatusBarStyle('light-content');
    } else {
      setStatusBarStyle('light');
    }
  };

  return (
    <ScreenBoilerplate
      headingClr={theme.primaryText}
      heading="Preferences"
      style={{ backgroundColor: theme.secondaryBg }}>
      <View>
        <Text
          style={[
            styles.subheading,
            { color: theme.primaryText, fontFamily: theme.fontRegular },
          ]}>
          Account
        </Text>
        <SettingsActionBtn {...accountOptions} />
        <Text
          style={[
            styles.subheading,
            { color: theme.primaryText, fontFamily: theme.fontRegular },
          ]}>
          Settings
        </Text>
        {settingsOptions.map(setting => (
          <SettingsActionBtn key={setting.id} {...setting} />
        ))}
      </View>
    </ScreenBoilerplate>
  );
};

const styles = StyleSheet.create({
  subheading: {
    color: 'white',
    fontSize: 20,
    marginVertical: 20,
  },
});

export default MoreScreen;
