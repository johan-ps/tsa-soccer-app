import React from 'react';
import {
  View,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import UiIcon from './UiIcon';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  withSpring,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';

const UiIconButton = props => {
  const {
    icon,
    size = 30,
    color = 'white',
    backgroundColor = 'black',
    type,
    shadow = false,
    darkBg = false,
  } = props;
  const theme = useSelector(state => state.theme.colors);
  const focusAnimation = useSharedValue(0);
  const onFocusIn = () => {
    focusAnimation.value = withTiming(1, { duration: 40 });
  };

  const onFocusOut = () => {
    focusAnimation.value = withSpring(0, {
      damping: 100,
      mass: 10,
      stiffness: 1000,
      overshootClamping: true,
      restDisplacementThreshold: 0,
      restSpeedThreshold: 0,
    });
  };

  const scale = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(focusAnimation.value, [0, 1], [1, 0.99]),
        },
      ],
    };
  });

  const renderPlatformSpecific = () => {
    if (Platform.OS === 'ios') {
      return (
        <Animated.View style={[styles.buttonWrapper, scale, props.style]}>
          <TouchableHighlight
            onPressIn={onFocusIn}
            onPressOut={onFocusOut}
            onPress={props.onPress}
            style={styles.touchable}>
            <UiIcon {...props} />
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
            <UiIcon {...props} />
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

export default UiIconButton;
