import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

const UiSwitch = props => {
  const { trackColor, onValueChange, value } = props;
  const [enabled, setEnabled] = useState(value);
  const anim = useSharedValue(value ? 1 : 0);
  const toggleAnim = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(anim.value, [0, 1], [5, 26]),
        },
      ],
    };
  });

  const onToggleHandler = () => {
    if (anim.value === 0) {
      anim.value = withSpring(
        1,
        {
          damping: 100,
          mass: 10,
          stiffness: 1000,
          overshootClamping: true,
          restDisplacementThreshold: 0,
          restSpeedThreshold: 0,
        },
        () => {
          runOnJS(setEnabled)(true);
        },
      );
      props.onValueChange();
    } else {
      anim.value = withSpring(
        0,
        {
          damping: 100,
          mass: 10,
          stiffness: 1000,
          overshootClamping: true,
          restDisplacementThreshold: 0,
          restSpeedThreshold: 0,
        },
        () => {
          runOnJS(setEnabled)(false);
        },
      );
      props.onValueChange();
    }
  };

  return (
    <Pressable
      onPress={onToggleHandler}
      style={[styles.container, { backgroundColor: trackColor[enabled + ''] }]}>
      <Animated.View style={[styles.toggle, toggleAnim]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 35,
    backgroundColor: 'grey',
    borderRadius: 20,
    justifyContent: 'center',
    elevation: 5,
  },
  toggle: {
    width: 28,
    height: 28,
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 3,
  },
});

export default UiSwitch;
