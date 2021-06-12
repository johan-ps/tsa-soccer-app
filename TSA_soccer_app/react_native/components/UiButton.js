import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';

const UiButton = props => {
  const {
    type = 'primary',
    size = 'large',
    primaryClr = '#E41B23',
    secondaryClr = '#ffffff',
    border = false,
    darkBg = false,
  } = props;
  const focusAnimation = useRef(new Animated.Value(0)).current;
  const theme = useSelector(state => state.theme.colors);

  const onFocusIn = () => {
    Animated.timing(focusAnimation, {
      toValue: 1,
      duration: 40,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const onFocusOut = () => {
    Animated.timing(focusAnimation, {
      toValue: 0,
      duration: 40,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // focus scaling animation
  const scale = {
    transform: [
      {
        scale: focusAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.97],
        }),
      },
    ],
  };

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
        fontFamily: 'Roboto-Medium',
      },
    },
    medium: {
      button: {
        height: 40,
        width: 150,
      },
      text: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
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
        fontFamily: 'Roboto-Bold',
      },
    },
  };

  const renderPlatformSpecific = () => {
    if (Platform.OS === 'ios') {
      return (
        <Animated.View style={[styles.buttonWrapper,  scale]}>
          <TouchableHighlight
            onPressIn={onFocusIn}
            onPressOut={onFocusOut}
            onPress={props.onPress}
            style={[styles.touchable, sizeStyles[size]]}>
            <View
              style={[
                styles.textWrapper,
                typeStyles[type].textWrapper,
                sizeStyles[size].button,
              ]}>
              <Text
                style={[
                  styles.label,
                  sizeStyles[size].text,
                  typeStyles[type].text,
                ]}>
                {props.label}
              </Text>
            </View>
          </TouchableHighlight>
        </Animated.View>
      );
    } else {
      return (
        <Animated.View style={[styles.buttonWrapper, scale]}>
          <TouchableNativeFeedback
            onPressIn={onFocusIn}
            onPressOut={onFocusOut}
            onPress={props.onPress}
            style={[styles.touchable]}
            background={TouchableNativeFeedback.Ripple(
              darkBg ? theme.touchableBgDark : theme.touchableBgLight,
              false,
            )}>
            <View
              style={[
                styles.textWrapper,
                typeStyles[type].textWrapper,
                sizeStyles[size].button,
              ]}>
              <Text
                style={[
                  styles.label,
                  sizeStyles[size].text,
                  typeStyles[type].text,
                ]}>
                {props.label}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
      );
    }
  };

  return <View>{renderPlatformSpecific()}</View>;
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
