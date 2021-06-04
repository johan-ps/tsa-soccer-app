import React, { useRef } from 'react';
import { Text, StyleSheet, Animated, Easing, Pressable } from 'react-native';

const UiButton = props => {
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

  // focus opacity animation
  const opacity = {
    opacity: focusAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.1],
    }),
  };

  const bgClr = {
    backgroundColor: props.bgColor,
  };

  const txtClr = {
    color: props.textColor,
  };

  return (
    <Animated.View style={[styles.buttonContainer, bgClr, scale]}>
      <Pressable
        style={[styles.pressable]}
        onPressIn={onFocusIn}
        onPressOut={onFocusOut}
        onPress={props.onPress}>
        <Text style={[styles.label, txtClr]}>{props.label}</Text>
        <Animated.View style={[styles.shadow, opacity]} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10,
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
    borderRadius: 10,
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
    fontWeight: '500',
    fontSize: 15,
  },
});

export default UiButton;
