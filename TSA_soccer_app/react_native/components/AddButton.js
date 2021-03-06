import React, { forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

// forwardRef allows functional components to have refs
const AddButton = forwardRef((props, ref) => {
  const focusAnimation = useSharedValue(1);
  const scrollAnimation = useSharedValue(1);

  const isScroll = useSharedValue(false); // does scroll animation have priority over focus animation
  const visible = useSharedValue(true);
  const scrollDownAnimInit = useSharedValue(false); // has scroll down animation started

  // get current theme colors from state
  const theme = useSelector(state => state.theme.colors);

  // useImperativeHandle customizes the instance value that is exposed to parent components when using refs
  useImperativeHandle(ref, () => ({
    onShow,
    onHide,
  }));

  const onShow = (animated = true) => {
    if (scrollDownAnimInit.value) {
      visible.value = true;
      scrollDownAnimInit.value = false;

      if (animated) {
        scrollAnimation.value = withTiming(1, {}, () => {
          isScroll.value = false;
        });
      } else {
        scrollAnimation.value = 1;
        isScroll.value = false;
      }
    }
  };

  const onHide = (animated = true) => {
    if (!scrollDownAnimInit.value) {
      isScroll.value = true;
      scrollDownAnimInit.value = true;

      if (animated) {
        scrollAnimation.value = withTiming(0, {}, () => {
          visible.value = false;
        });
      } else {
        scrollAnimation.value = 0;
        visible.value = false;
      }
    }
  };

  const onFocusIn = () => {
    focusAnimation.value = withTiming(0.9);
  };

  const onFocusOut = () => {
    focusAnimation.value = withTiming(1);
  };

  const themeBgClr = {
    backgroundColor: theme.addBtnBg,
  };

  const containerAnimStyle = useAnimatedStyle(() => {
    let styles = {};
    if (visible.value) {
      styles.opacity = scrollAnimation.value;
      if (isScroll.value) {
        styles.transform = [
          {
            scale: scrollAnimation.value,
          },
        ];
      } else {
        styles.transform = [
          {
            scale: focusAnimation.value,
          },
        ];
      }
    } else {
      styles = {
        opacity: 0,
        width: 0,
        height: 0,
      };
    }
    return styles;
  });

  return (
    <Animated.View
      style={[
        styles.addBtnContainer,
        themeBgClr,
        containerAnimStyle,
        { shadowColor: theme.addBtnBg },
      ]}>
      <View style={styles.addBtn}>
        <Ripple
          style={[styles.ripple]}
          onPress={() => {
            if (visible.value) {
              props.onPress();
            }
          }}
          onPressIn={onFocusIn}
          onPressOut={onFocusOut}>
          <Icon name="add-outline" color={theme.addBtnIcon} size={28} />
        </Ripple>
      </View>
    </Animated.View>
  );
});

export default AddButton;

const styles = StyleSheet.create({
  ripple: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    overflow: 'hidden',
  },
  addBtnContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 95,
    right: 25,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 },
    zIndex: 200,
  },
  addBtn: {
    width: 60,
    height: 60,
    borderRadius: 50,
    overflow: 'hidden',
  },
});
