import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import Ripple from 'react-native-material-ripple';

const UiToggle = props => {
  const { labelLeft, labelRight } = props;
  const [selectedId, setSelectedId] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState(labelLeft);
  const [focused, setFocused] = useState(false);
  const toggleAnimation = useRef(new Animated.Value(0)).current;
  const focusAnimation = useRef(new Animated.Value(0)).current;

  const onFocusIn = event => {
    setFocused(true);
    Animated.timing(focusAnimation, {
      toValue: 1,
      duration: 40,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const onFocusOut = event => {
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
    setSelectedLabel(labelRight);
    if (selectedId === 0) {
      Animated.timing(toggleAnimation, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      setSelectedId(0);
      setSelectedLabel(labelLeft);
      Animated.timing(toggleAnimation, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
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
    <Animated.View style={[styles.toggleContainer, focusAnimStyle]}>
      <Ripple
        onPress={toggleHandler}
        onPressIn={onFocusIn}
        onPressOut={onFocusOut}
        style={styles.toggleContainerPressable}>
        <Animated.View style={[styles.toggleSwitch, translateAnimStyle]}>
          <Pressable
            onPress={toggleHandler}
            style={styles.toggleSwitchPressable}>
            <Text style={styles.toggleSwitchText}>{selectedLabel}</Text>
          </Pressable>
        </Animated.View>
        <Text style={styles.toggleLeftText}>{labelLeft}</Text>
        <Text style={styles.toggleRightText}>{labelRight}</Text>
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 1,
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
