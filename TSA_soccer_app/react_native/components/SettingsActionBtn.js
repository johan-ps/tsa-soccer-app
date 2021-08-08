import React from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import {
  UiIcon,
  UiIconButton,
  UiSwitch,
  UiImage,
} from '../components/_components';

const SettingsActionBtn = props => {
  let {
    title,
    data,
    actionType = 'button',
    icon,
    iconBtn,
    value = false,
    imageSrc = null,
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
          <UiImage
            style={styles.leftImg}
            source={imageSrc}
            resizeMode="cover"
            cond={imageSrc && imageSrc !== 'null'}
            alt={<UiIcon {...icon} />}
          />
          <Text style={[styles.settingsBtnTextLeft, { color: props.mainText }]}>
            {title}
          </Text>
        </View>
        <View style={styles.settingsRight}>
          {data ? (
            <Text
              style={[styles.settingsBtnTextRight, { color: props.subText }]}>
              {data}
            </Text>
          ) : null}
          {actionType === 'button' ? (
            <UiIconButton {...iconBtn} onPress={props.onPress} />
          ) : (
            <UiSwitch
              style={toggleScale()}
              trackColor={{ false: '#767577', true: '#E41B23' }}
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
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  settingBtnWrapper: {
    width: '100%',
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
    maxWidth: '50%',
  },
  settingsRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leftImg: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
});

export default SettingsActionBtn;
