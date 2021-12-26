import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { UiSwitch } from '../_components';

const NavButton = props => {
  const {
    darkBg = false,
    icon = 'chevron-forward-outline',
    actionType = 'button',
    value = 'false',
    ripple = true,
  } = props;
  const theme = useSelector(state => state.theme.colors);

  const toggleScale = () => {
    if (Platform.OS === 'ios') {
      return { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] };
    } else {
      return { transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] };
    }
  };

  return (
    <View
      style={[
        styles.container,
        styles.marginBottom,
        { backgroundColor: theme.secondaryBg },
      ]}>
      <TouchableNativeFeedback
        onPress={props.onPress}
        style={styles.touchable}
        background={
          ripple
            ? TouchableNativeFeedback.Ripple(
                darkBg ? theme.touchableBgDark : theme.touchableBgLight,
                false,
              )
            : null
        }>
        <View style={[styles.container, styles.contentContainer]}>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.label,
                { fontFamily: theme.fontMedium, color: theme.secondaryText },
              ]}>
              {props.label}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            {actionType === 'button' ? (
              <Icon name={icon} color={theme.secondaryText} size={26} />
            ) : (
              <UiSwitch
                style={toggleScale()}
                trackColor={{ false: '#767577', true: '#E41B23' }}
                onValueChange={props.onToggle}
                value={value}
              />
            )}
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  marginBottom: {
    marginBottom: 20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 62,
    borderRadius: 16,
    overflow: 'hidden',
  },
  touchable: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  contentContainer: {
    paddingHorizontal: 25,
  },
  textContainer: {},
  label: {
    fontSize: 15,
  },
  iconContainer: {},
});

export default NavButton;
