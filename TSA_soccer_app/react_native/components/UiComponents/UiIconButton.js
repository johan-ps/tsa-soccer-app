import React from 'react';
import {
  View,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import UiIcon from '../UiComponents/UiIcon';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  withSpring,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

const UiIconButton = props => {
  const {
    icon,
    size = 30,
    color = 'white',
    backgroundColor = 'black',
    type,
    shadow = false,
    darkBg = true,
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
          scale: interpolate(focusAnimation.value, [0, 1], [1, 0.95]),
        },
      ],
    };
  });

  const computeBorderRadius = () => {
    if (type === 'square') {
      return 0;
    } else if (type === 'round') {
      return 50;
    } else {
      return 16;
    }
  };

  const computeShadow = () => {
    if (shadow) {
      return {
        elevation: 20,
        shadowRadius: 10,
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowOffset: { height: 10 },
      };
    } else {
      return {};
    }
  };

  const renderPlatformSpecific = () => {
    if (Platform.OS === 'ios') {
      return (
        <Animated.View
          style={[styles.buttonWrapper, scale, props.style, computeShadow()]}>
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
        <Animated.View
          style={[
            styles.buttonWrapper,
            scale,
            {
              borderRadius: computeBorderRadius(),
              width: size * 2 + 10,
              height: size * 2 + 10,
            },
            computeShadow(),
          ]}>
          <TouchableNativeFeedback
            onPressIn={onFocusIn}
            onPressOut={onFocusOut}
            onPress={props.onPress}
            style={[
              styles.touchable,
              {
                borderRadius: computeBorderRadius(),
                width: size * 2 + 10,
                height: size * 2 + 10,
              },
            ]}
            background={TouchableNativeFeedback.Ripple(
              darkBg ? theme.touchableBgDark : theme.touchableBgLight,
              false,
            )}>
            <View
              style={[
                styles.chatboxContainer,
                {
                  backgroundColor,
                  borderRadius: computeBorderRadius(),
                  width: size * 2 + 10,
                  height: size * 2 + 10,
                },
              ]}>
              <Icon name={icon} size={size} color={color} />
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
      );
    }
  };

  return <View>{renderPlatformSpecific()}</View>;
};

const styles = StyleSheet.create({
  chatboxContainer: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  buttonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 100,
  },
  touchable: {
    borderRadius: 16,
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
