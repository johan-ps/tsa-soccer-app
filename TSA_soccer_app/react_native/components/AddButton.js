import React from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/Ionicons';
import Colours from '../constants/colour-themes/light_theme';

const AddButton = props => {
  const focusAnimation = new Animated.Value(0);

  Animated.timing(focusAnimation, {
    toValue: 0,
    duration: 0,
    useNativeDriver: true,
  }).start();

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

  const scale = {
    transform: [
      {
        scale: focusAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.98],
        }),
      },
    ],
  };

  const buttonStyle = {
    backgroundColor: Colours.primaryColor1,
    opacity: focusAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.8],
    }),
  };
  return (
    <Ripple
      style={[styles.ripple]}
      onPress={props.onPress}
      onPressIn={onFocusIn}
      onPressOut={onFocusOut}>
      <Animated.View style={[styles.addBtn, buttonStyle, scale]}>
        <Icon name="ios-add" color="white" size={28} />
      </Animated.View>
    </Ripple>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  ripple: {
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
  addBtn: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    overflow: 'hidden',
  },
});
