import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  cancelAnimation,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';

// forwardRef allows functional components to have refs
const ScrollTop = forwardRef((props, ref) => {
  const focusAnimation = useSharedValue(1);
  const scrollAnimation = useSharedValue(0);

  // const isScroll = useSharedValue(false); // does scroll animation have priority over focus animation
  const visible = useSharedValue(false);
  // const scrollDownAnimInit = useSharedValue(false); // has scroll down animation started

  // get current theme colors from state
  const theme = useSelector(state => state.theme.colors);

  // useImperativeHandle customizes the instance value that is exposed to parent components when using refs
  useImperativeHandle(ref, () => ({
    onShow,
    onHide,
    cancelAnim,
    hideWithDelay,
  }));

  const onShow = () => {
    scrollAnimation.value = withTiming(1, {}, () => {
      visible.value = true;
    });
  };

  const onHide = () => {
    scrollAnimation.value = withTiming(0, {}, () => {
      visible.value = false;
    });
  };

  const cancelAnim = () => {
    cancelAnimation(scrollAnimation);
  };

  const hideWithDelay = () => {
    scrollAnimation.value = withDelay(
      3000,
      withTiming(0, {}, () => {
        visible.value = false;
      }),
    );
  };

  const onFocusIn = () => {
    focusAnimation.value = withTiming(0.9);
  };

  const onFocusOut = () => {
    focusAnimation.value = withTiming(1);
  };

  const themeBgClr = {
    backgroundColor: theme.primaryBg,
  };

  const containerAnimStyle = useAnimatedStyle(() => {
    let styles = {};
    // if (visible.value) {
    styles.opacity = scrollAnimation.value;
    styles.transform = [
      {
        scale: scrollAnimation.value,
      },
    ];
    return styles;
  });

  return (
    <Animated.View
      style={[styles.addBtnContainer, themeBgClr, containerAnimStyle]}>
      <View style={styles.addBtn}>
        <Ripple
          style={[styles.ripple]}
          onPress={props.onPress}
          onPressIn={onFocusIn}
          onPressOut={onFocusOut}>
          <Icon name="arrow-collapse-up" color={theme.addBtnBg} size={18} />
        </Ripple>
      </View>
    </Animated.View>
  );
});

export default ScrollTop;

const styles = StyleSheet.create({
  ripple: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    overflow: 'hidden',
  },
  addBtnContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    elevation: 5,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { height: 5 },
    zIndex: 200,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
