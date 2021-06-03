import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

// forwardRef allows functional components to have refs
const AddButton = forwardRef((props, ref) => {
  // using useRef provides a current property that is persistent throughout the component's lifecycle
  const focusAnimation = useRef(new Animated.Value(0)).current;
  const scrollAnimation = useRef(new Animated.Value(1)).current;

  const [isScroll, setIsScroll] = useState(false); // does scroll animation have priority over focus animation
  const [scrollDownAnimInit, setScrollDownAnimInit] = useState(false); // has scroll down animation started

  // get current theme colors from state
  const theme = useSelector(state => state.theme.colors);

  // useImperativeHandle customizes the instance value that is exposed to parent components when using refs
  useImperativeHandle(ref, () => ({
    onScrollUp,
    onScrollDown,
    setIsScroll,
  }));

  const onScrollUp = () => {
    if (scrollDownAnimInit) {
      setScrollDownAnimInit(false);
      Animated.timing(scrollAnimation, {
        toValue: 1,
        duration: 225,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setIsScroll(false);
      });
    }
  };

  const onScrollDown = () => {
    setIsScroll(true);
    if (!scrollDownAnimInit) {
      setScrollDownAnimInit(true);
      Animated.timing(scrollAnimation, {
        toValue: 0,
        duration: 225,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  const onFocusIn = () => {
    Animated.timing(focusAnimation, {
      toValue: 1,
      duration: 225,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const onFocusOut = () => {
    Animated.timing(focusAnimation, {
      toValue: 0,
      duration: 225,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // scrolling scaling animation
  const scaleFull = {
    transform: [
      {
        scale: scrollAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  // scrolling opacity animation
  const opacity = {
    opacity: scrollAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  // focus scaling animation
  const scale = {
    transform: [
      {
        scale: focusAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.95],
        }),
      },
    ],
  };

  const themeStyles = {
    backgroundColor: theme.primaryBtnBgClr,
  };

  return (
    <Animated.View
      style={[
        styles.addBtn,
        themeStyles,
        isScroll ? scaleFull : scale,
        opacity,
      ]}>
      <Ripple
        style={[styles.ripple]}
        onPress={props.onPress}
        onPressIn={onFocusIn}
        onPressOut={onFocusOut}>
        <Icon name="ios-add" color={theme.primaryBtnClr} size={28} />
      </Ripple>
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
  addBtn: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'space-around',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 25,
    right: 25,
    elevation: 10,
    shadowRadius: 10,
    shadowColor: '#F02A4B',
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 },
  },
});
