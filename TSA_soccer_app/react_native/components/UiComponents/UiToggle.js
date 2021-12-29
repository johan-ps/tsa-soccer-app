import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useSelector } from 'react-redux';

const UiToggle = props => {
  const { labelLeft, labelRight, value, onInputChange } = props;
  const theme = useSelector(state => state.theme.colors);
  const selectedLabel = value || labelLeft;
  const [selectedId, setSelectedId] = useState(0);
  const [focused, setFocused] = useState(false);
  const toggleAnimation = useRef(new Animated.Value(0)).current;
  const focusAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if(selectedLabel === labelRight){
      toggleHandler();
    }
  }, []);

  const onFocusIn = () => {
    setFocused(true);
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
    }).start(() => {
      setFocused(false);
    });
  };

  const toggleHandler = () => {
    setSelectedId(1);
    if (selectedId === 0) {
      Animated.timing(toggleAnimation, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
      onInputChange(labelRight);
    } else {
      setSelectedId(0);
      Animated.timing(toggleAnimation, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
      onInputChange(labelLeft);
    }
  };

  const translateAnimStyle = {
    transform: [
      {
        translateX: toggleAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 100],
        }),
      },
    ],
  };

  const focusAnimStyle = {
    transform: [
      {
        scale: focusAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.98],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.toggleContainer,
        focusAnimStyle,
        { backgroundColor: theme.inputBg },
      ]}>
      <Ripple
        onPress={toggleHandler}
        onPressIn={onFocusIn}
        onPressOut={onFocusOut}
        style={styles.toggleContainerPressable}>
        <Animated.View
          style={[
            styles.toggleSwitch,
            translateAnimStyle,
            { backgroundColor: theme.inputBg },
          ]}>
          <Pressable
            onPress={toggleHandler}
            style={[
              styles.toggleSwitchPressable,
              { backgroundColor: theme.inputBg },
            ]}>
            <Text style={[styles.toggleSwitchText, { color: theme.inputText }]}>
              {selectedLabel}
            </Text>
          </Pressable>
        </Animated.View>
        <Text
          style={[styles.toggleLeftText, { color: theme.inputPlaceholder }]}>
          {labelLeft}
        </Text>
        <Text
          style={[styles.toggleRightText, { color: theme.inputPlaceholder }]}>
          {labelRight}
        </Text>
      </Ripple>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    borderRadius: 60,
    width: 210,
    height: 41,
    backgroundColor: '#F1F0F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 10,
    shadowColor: '#000000',
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 1,
    zIndex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  toggleContainerPressable: {
    borderRadius: 60,
    width: 210,
    height: 41,
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleSwitch: {
    position: 'absolute',
    left: 5,
    top: 3,
    bottom: 0,
    width: 100,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 60,
    elevation: 2,
    zIndex: 2,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 2 },
  },
  toggleSwitchPressable: {
    width: 100,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 60,
  },
  toggleSwitchText: {
    color: '#6B6B6B',
  },
  toggleLeftText: {
    color: '#A4A0B1',
  },
  toggleRightText: {
    color: '#A4A0B1',
  },
});

export default UiToggle;
