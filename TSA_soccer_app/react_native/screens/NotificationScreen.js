import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SettingsActionBtn } from '../components/_components';

const NotificationScreen = ({ navigation }) => {
  const [shlToggle, setShlToggle] = useState(false);
  const [mhlToggle, setMhlToggle] = useState(false);
  const [ctToggle, setCtToggle] = useState(false);
  const settingsOptions = [
    {
      id: 0,
      title: 'Scarborough House League',
      icon: {
        icon: 'football',
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
      icon: {
        icon: 'football',
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
      icon: {
        icon: 'football',
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
      data: ctToggle ? 'On' : 'Off',
      actionType: 'toggle',
      value: ctToggle,
      onPress() {
        setCtToggle(!ctToggle);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.nav}>
          <Icon
            name="chevron-back-outline"
            color="white"
            size={35}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <Text style={styles.headingText}>Notification Preferences</Text>
      </View>
      <ScrollView style={styles.options}>
        {settingsOptions.map(setting => (
          <SettingsActionBtn key={setting.id} {...setting} />
        ))}
      </ScrollView>
    </View>
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
  }
});

export default NotificationScreen;
