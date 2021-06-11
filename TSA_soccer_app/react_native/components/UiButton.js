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

const UiButton = props => {
  const {
    type = 'primary',
    primaryClr = '#E41B23',
    secondaryClr = '#ffffff',
  } = props;
  const focusAnimation = useRef(new Animated.Value(0)).current;

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
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: primaryClr,
      },
      text: {
        color: primaryClr,
      },
    },
    tertiary: {
      text: {
        color: primaryClr,
      },
    },
  };

  const renderPlatformSpecific = () => {
    if (Platform.OS === 'ios') {
      return (
        <Animated.View style={[styles.buttonWrapper, scale]}>
          <TouchableHighlight
            onPressIn={onFocusIn}
            onPressOut={onFocusOut}
            onPress={props.onPress}
            style={[styles.touchable]}>
            <View style={[styles.textWrapper, typeStyles[type].textWrapper]}>
              <Text style={[styles.label, typeStyles[type].text]}>
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
            background={TouchableNativeFeedback.Ripple('#0000001a', false)}>
            <View style={[styles.textWrapper, typeStyles[type].textWrapper]}>
              <Text style={[styles.label, typeStyles[type].text]}>
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
    height: 48,
    width: 190,
    overflow: 'hidden',
  },
  touchable: {
    borderRadius: 60,
    height: 48,
    width: 190,
    backgroundColor: '#f2f2f2',
  },
  textWrapper: {
    borderRadius: 60,
    height: 48,
    width: 190,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  buttonContainer: {
    borderRadius: 20,
    height: 40,
    width: 140,
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
  shadow: {
    borderRadius: 8,
    backgroundColor: '#000000',
    height: 40,
    width: 140,
    position: 'absolute',
    top: -2,
    bottom: 0,
    left: 0,
    right: 0,
  },
  pressable: {
    height: 35,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#E41B23',
  },
});

export default UiButton;
