import React from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import { UiIcon, UiIconButton } from '../components/_components';

const SettingsActionBtn = props => {
  let {
    title,
    data,
    actionType = 'button',
    icon,
    iconBtn,
    value = false,
  } = props;

  const toggleScale = () => {
    if (Platform.OS === 'ios') {
      return { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] };
    } else {
      return { transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] };
    }
  };

  return (
    <View style={styles.settingsContainer}>
      <View style={styles.settingBtnWrapper}>
        <View style={styles.settingsLeft}>
          <UiIcon {...icon} />
          <Text style={styles.settingsBtnTextLeft}>{title}</Text>
        </View>
        <View style={styles.settingsRight}>
          {data ? (
            <Text style={styles.settingsBtnTextRight}>{data}</Text>
          ) : null}
          {actionType === 'button' ? (
            <UiIconButton {...iconBtn} onPress={props.onPress} />
          ) : (
            <Switch
              style={toggleScale()}
              trackColor={{ false: '#767577', true: '#767577' }}
              onValueChange={props.onPress}
              value={value}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  settingBtnWrapper: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingsBtnTextLeft: {
    color: '#cfcdeb',
    marginLeft: 20,
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  settingsBtnTextRight: {
    color: '#8c8ab2',
    marginRight: 20,
    fontFamily: 'Roboto-Regular',
  },
  settingsLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  settingsRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default SettingsActionBtn;
