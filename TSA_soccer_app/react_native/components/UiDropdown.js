import React, { useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Modal,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const UiDropdown = props => {
  const [selectedId, setSelectedId] = useState(-1);
  const [selectedLabel, setSelectedLabel] = useState('Select Value...');
  const [showOptions, setShowOptions] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const focusAnimation = useRef(new Animated.Value(0)).current;
  const options = [
    {
      id: 0,
      label: 'Framer',
    },
    {
      id: 1,
      label: 'Sketch',
    },
    {
      id: 2,
      label: 'InVision Studio',
    },
    {
      id: 3,
      label: 'Figma',
    },
    {
      id: 4,
      label: 'Adobe XD',
    },
  ];

  const theme = useSelector(state => state.theme.colors);

  const onFocusIn = () => {
    Animated.timing(focusAnimation, {
      toValue: 1,
      duration: 5,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const onFocusOut = () => {
    Animated.timing(focusAnimation, {
      toValue: 0,
      duration: 5,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShowOptions(true);
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 225,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  const getDropdownXY = event => {
    const layout = event.nativeEvent.layout;
    setOffsetY(layout.height + layout.y);
    setOffsetX(layout.x);
  };

  const positionStyle = {
    top: offsetY,
    left: offsetX,
  };

  const onSelectOptionHandler = option => {
    setSelectedId(option.id);
    setSelectedLabel(option.label);
    setTimeout(() => {
      setShowOptions(false);
    }, 500);
    setTimeout(() => {
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 225,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 350);
  };

  const onCloseHandler = () => {
    setTimeout(() => {
      setShowOptions(false);
    }, 225);
    Animated.timing(dropdownAnimation, {
      toValue: 0,
      duration: 225,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const buttonBorder = {
    borderColor: theme.dropdownBorderClr,
    borderWidth: 2,
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

  const optionsAnimStyles = {
    opacity: dropdownAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        translateY: dropdownAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 10],
        }),
      },
      {
        scaleY: dropdownAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
  };

  const iconAnimStyles = {
    transform: [
      {
        rotate: dropdownAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-180deg'],
        }),
      },
    ],
  };

  const renderOptions = () => {
    if (showOptions) {
      return (
        <Modal animationType="none" transparent={true}>
          <Pressable onPress={onCloseHandler} style={[styles.modalContainer]}>
            <Animated.View
              style={[
                styles.optionsContainer,
                { backgroundColor: theme.dropdownBgClr },
                positionStyle,
                optionsAnimStyles,
              ]}>
              {options.map(option => {
                return (
                  <Ripple
                    onPress={() => {
                      onSelectOptionHandler(option);
                    }}
                    style={[
                      styles.option,
                      option.id === selectedId
                        ? { backgroundColor: theme.dropdownOptSClr }
                        : {},
                    ]}
                    key={option.id}>
                    <Text
                      style={
                        option.id === selectedId
                          ? { color: theme.dropdownOptSTxtClr }
                          : { color: theme.dropdownOptTxtClr }
                      }>
                      {option.label}
                    </Text>
                  </Ripple>
                );
              })}
            </Animated.View>
          </Pressable>
        </Modal>
      );
    } else {
      return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.dropdownContainer,
        { backgroundColor: theme.dropdownBgClr },
        scale,
      ]}
      onLayout={getDropdownXY}>
      <Ripple
        onPressIn={onFocusIn}
        onPressOut={onFocusOut}
        style={[styles.dropdownBtn, showOptions ? buttonBorder : {}]}>
        <Text style={{ color: theme.dropdownSClr }}>{selectedLabel}</Text>
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.dropdownBgClr },
            iconAnimStyles,
          ]}>
          <Icon
            name="chevron-down-outline"
            color={showOptions ? theme.dropdownBorderClr : theme.dropdownSClr}
            size={24}
          />
        </Animated.View>
      </Ripple>
      {renderOptions()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginTop: 100,
    borderRadius: 10,
    height: 50,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 },
  },
  dropdownBtn: {
    borderRadius: 10,
    height: 50,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    // borderColor: '#fff',
    // borderWidth: 2,
    // borderStyle: 'solid',
  },
  selectedText: {
    color: '#A29FAF',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 },
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  option: {
    width: 200,
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectedOption: {
    backgroundColor: '#E9EFFF',
  },
  selectedOptionText: {
    color: '#356EFF',
  },
  optionText: {
    color: '#000000',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
});

export default UiDropdown;
