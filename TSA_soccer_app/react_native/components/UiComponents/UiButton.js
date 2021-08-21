import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';

const UiButton = props => {
  const {
    type = 'primary',
    size = 'large',
    primaryClr,
    secondaryClr,
    border = false,
    darkBg = false,
    icon = null,
    label = null,
    width,
    borderRadius,
    height,
  } = props;
  const focusAnimation = useSharedValue(0);
  const theme = useSelector(state => state.theme.colors);

  const onFocusIn = () => {
    if (type !== 'tertiary') {
      focusAnimation.value = withTiming(1, { duration: 40 });
    }
  };

  const onFocusOut = () => {
    if (type !== 'tertiary') {
      focusAnimation.value = withSpring(0, {
        damping: 100,
        mass: 10,
        stiffness: 1000,
        overshootClamping: true,
        restDisplacementThreshold: 0,
        restSpeedThreshold: 0,
      });
    }
  };

  // focus scaling animation
  const scale = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(focusAnimation.value, [0, 1], [1, 0.99]),
        },
      ],
    };
  });

  const typeStyles = {
    primary: {
      textWrapper: {
        backgroundColor: primaryClr,
      },
      text: {
        color: secondaryClr,
      },
    },
    secondary: {
      textWrapper: {
        backgroundColor: secondaryClr,
        borderWidth: border ? 2 : 0,
        borderStyle: 'solid',
        borderColor: primaryClr,
      },
      text: {
        color: primaryClr,
      },
    },
    tertiary: {
      textWrapper: {
        backgroundColor: secondaryClr,
      },
      text: {
        color: primaryClr,
      },
    },
  };

  const sizeStyles = {
    small: {
      button: {
        height: 48,
        width: 190,
      },
      text: {
        fontSize: 14,
        fontFamily: theme.fontMedium,
      },
    },
    medium: {
      button: {
        height: 40,
        width: 150,
      },
      text: {
        fontSize: 16,
        fontFamily: theme.fontMedium,
      },
    },
    large: {
      button: {
        height: 48,
        width: 190,
      },
      text: {
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: theme.fontBold,
      },
    },
  };

  const renderPlatformSpecific = () => {
    if (Platform.OS === 'ios') {
      return (
        <Animated.View
          style={[
            styles.buttonWrapper,
            scale,
            props.style,
            width ? { width } : {},
            height ? { height } : {},
            borderRadius ? { borderRadius } : {},
          ]}>
          <TouchableHighlight
            onPressIn={onFocusIn}
            onPressOut={onFocusOut}
            onPress={props.onPress}
            style={[
              styles.touchable,
              sizeStyles[size],
              width ? { width } : {},
              height ? { height } : {},
              borderRadius ? { borderRadius } : {},
            ]}>
            <View
              style={[
                styles.textWrapper,
                typeStyles[type].textWrapper,
                sizeStyles[size].button,
                width ? { width } : {},
                height ? { height } : {},
                borderRadius ? { borderRadius } : {},
              ]}>
              <Text
                style={[
                  styles.label,
                  sizeStyles[size].text,
                  typeStyles[type].text,
                ]}>
                {label}
              </Text>
            </View>
          </TouchableHighlight>
        </Animated.View>
      );
    } else {
      return (
        <Animated.View
          style={[
            styles.buttonWrapper,
            scale,
            props.style,
            label ? {} : styles.iconOnly,
            borderRadius ? { borderRadius } : {},
          ]}>
          <TouchableNativeFeedback
            onPressIn={onFocusIn}
            onPressOut={onFocusOut}
            onPress={props.onPress}
            style={[styles.touchable, borderRadius ? { borderRadius } : {}]}
            background={TouchableNativeFeedback.Ripple(
              darkBg ? theme.touchableBgDark : theme.touchableBgLight,
              false,
            )}>
            <View
              style={[
                styles.textWrapper,
                typeStyles[type].textWrapper,
                sizeStyles[size].button,
                icon ? styles.iconWrapper : {},
                width ? { width } : {},
                height ? { height } : {},
                borderRadius ? { borderRadius } : {},
              ]}>
              {icon ? (
                <Icon
                  name={icon}
                  color={typeStyles[type].text.color}
                  size={20}
                />
              ) : null}
              <Text
                style={[
                  styles.label,
                  sizeStyles[size].text,
                  typeStyles[type].text,
                  icon && label ? styles.iconText : {},
                ]}>
                {props.label}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
      );
    }
  };

  return (
    <View style={[width ? { width } : {}]}>{renderPlatformSpecific()}</View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 60,
    overflow: 'hidden',
  },
  touchable: {
    borderRadius: 60,
  },
  textWrapper: {
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOnly: {
    width: 120,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    flexDirection: 'row',
  },
  iconText: {
    paddingLeft: 10,
  },
  buttonContainer: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 },
    position: 'relative',
    overflow: 'hidden',
  },
  pressable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {},
});

export default UiButton;
