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
import { SettingsActionBtn, UiButton } from '../components/_components';
import * as ThemeActions from '../store/actions/ThemeActions';

// TODO: Edit Profile, Change Theme,

const MoreScreen = ({ navigation }) => {
  const STYLES = ['default', 'light-content'];

  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const [statusBarStyle, setStatusBarStyle] = useState(STYLES[1]);
  const settingsOptions = [
    {
      id: 0,
      title: 'Notifications',
      icon: {
        icon: 'notifications',
        color: '#96d8ff',
        backgroundColor: '#243e83',
        type: 'round',
        size: 24,
      },
      iconBtn: {
        icon: 'chevron-forward',
        color: '#e3e2ed',
        backgroundColor: '#45426d',
        size: 24,
      },
      onPress() {},
    },
    {
      id: 1,
      title: 'Dark Mode',
      icon: {
        icon: 'moon',
        color: '#bbc6ff',
        backgroundColor: '#3b3c86',
        type: 'round',
        size: 24,
      },
      iconBtn: {
        icon: 'chevron-forward',
        color: '#e3e2ed',
        backgroundColor: '#45426d',
        size: 24,
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
      icon: {
        icon: 'football',
        color: '#f9b994',
        backgroundColor: '#4f3a5c',
        type: 'round',
        size: 24,
      },
      iconBtn: {
        icon: 'chevron-forward',
        color: '#e3e2ed',
        backgroundColor: '#45426d',
        size: 24,
      },
      onPress() {},
    },
    {
      id: 3,
      title: userData && userData.accessLevel > 0 ? 'Log Out' : 'Log In',
      icon: {
        icon: userData && userData.accessLevel > 0 ? 'log-out' : 'log-in',
        color: '#eda3bd',
        backgroundColor: '#533159',
        type: 'round',
        size: 24,
      },
      iconBtn: {
        icon: 'chevron-forward',
        color: '#e3e2ed',
        backgroundColor: '#45426d',
        size: 24,
      },
      onPress() {
        navigation.navigate('Login');
      },
    },
  ];

  const toggleSwitch = () => {
    let newTheme;
    if (theme.name === 'dark') {
      newTheme = 'default';
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
      setStatusBarStyle('default');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#2f2c55' }]}>
      <StatusBar
        //animated={true}
        //backgroundColor="#61dafb"
        barStyle={statusBarStyle}
        //hidden={hidden}
      />
      <View style={styles.headerContainer}>
        <Image
          style={styles.profilePicture}
          source={{
            uri: userData.imageUrl,
          }}
        />
        <Text style={[styles.title, { color: theme.cardHClr }]}>
          {`${userData.name.first} ${userData.name.last}`}
        </Text>
        {settingsOptions.map(setting => (
          <SettingsActionBtn key={setting.id} {...setting} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 16,
    width: '100%',
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderColor: 'grey',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 20,
    height: 45,
  },
  options: {
    color: 'black',
    fontSize: 16,
    paddingLeft: 10,
  },
  profilePicture: {
    width: 200,
    height: 200,
    borderRadius: 35,
  },
  title: {
    fontSize: 28,
    paddingTop: 10,
    paddingBottom: 5,
    marginBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  editProfile: {
    borderRadius: 20,
    color: 'white',
    padding: 12,
  },
  editProfileButton: {
    backgroundColor: '#e84343',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeading: {
    fontSize: 14,
    width: '100%',
    padding: 8,
    backgroundColor: '#F0F0F0',
    color: '#696969',
  },
});

export default MoreScreen;
