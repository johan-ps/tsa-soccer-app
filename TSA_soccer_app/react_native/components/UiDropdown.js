import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Modal,
  ScrollView,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const UiDropdown = props => {
  const {
    modalOffsetX = 0,
    modalOffsetY = 0,
    options = [],
    placeholder = 'Select Value...',
    size = 'small',
    multiselect = false,
    group = false,
    icon = false,
  } = props;
  const [selectedId, setSelectedId] = useState(-1);
  const [selectedLabel, setSelectedLabel] = useState(placeholder);
  const [selectedValues, setSelectedValues] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [width, setWidth] = useState({ width: 170 });
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const focusAnimation = useRef(new Animated.Value(0)).current;
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
    setOffsetY(layout.height + layout.y + modalOffsetY);
    setOffsetX(layout.x + modalOffsetX);
    setWidth({ width: layout.width });
  };

  const widthStyle = () => {
    let width = '48.5%';
    if (size === 'large') {
      width = '100%';
    } else if (size === 'medium') {
      width = '70%';
    }
    return { width };
  };

  const positionStyle = {
    top: offsetY,
    left: offsetX,
  };

  const onSelectOptionHandler = (option, child = null) => {
    if (multiselect) {
      const newSelectedValues = { ...selectedValues };
      if (selectedValues[option.id] === undefined) {
        newSelectedValues[option.id] = {
          selected: false,
          children: {},
        };
        if (child) {
          newSelectedValues[option.id].children[child.id] = false;
        }
      }
      newSelectedValues[option.id].children = {
        ...newSelectedValues[option.id].children,
      };
      if (child) {
        newSelectedValues[option.id].children[child.id] =
          !newSelectedValues[option.id].children[child.id];
      }
      setSelectedValues(newSelectedValues);
      console.log(newSelectedValues);
      return;
    }
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
    shadowColor: '#e51b23',
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
          outputRange: [0, 5],
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
                width,
                { backgroundColor: theme.dropdownBgClr },
                positionStyle,
                optionsAnimStyles,
              ]}>
              <ScrollView
                style={[
                  styles.optionsScrollContainer,
                  { backgroundColor: theme.dropdownBgClr },
                ]}>
                {options.map(option => {
                  return (
                    <View key={option.id}>
                      <Ripple
                        onPress={() => {
                          onSelectOptionHandler(option);
                        }}
                        style={[
                          styles.option,
                          (multiselect &&
                            selectedValues[option.id] &&
                            selectedValues[option.id].selected === true) ||
                          (!multiselect && option.id === selectedId)
                            ? { backgroundColor: theme.dropdownOptSClr }
                            : {},
                        ]}>
                        <Text
                          style={[
                            option.id === selectedId
                              ? { color: theme.dropdownOptSTxtClr }
                              : { color: theme.dropdownOptTxtClr },
                            group ? { fontWeight: 'bold' } : {},
                          ]}>
                          {option.label}
                        </Text>
                        {(multiselect &&
                          selectedValues[option.id] &&
                          selectedValues[option.id].selected === true) ||
                        (!multiselect && option.id === selectedId) ? (
                          <Icon
                            name="checkmark-outline"
                            size={20}
                            color="red"
                          />
                        ) : null}
                      </Ripple>
                      {option.children
                        ? option.children.map(child => {
                            return (
                              <Ripple
                                onPress={() => {
                                  onSelectOptionHandler(option, child);
                                }}
                                style={[
                                  styles.option,
                                  multiselect &&
                                  selectedValues[option.id] &&
                                  selectedValues[option.id].children &&
                                  selectedValues[option.id].children[
                                    child.id
                                  ] === true
                                    ? { backgroundColor: theme.dropdownOptSClr }
                                    : {},
                                ]}
                                key={child.id}>
                                <Text
                                  style={
                                    multiselect &&
                                    selectedValues[option.id] &&
                                    selectedValues[option.id].children &&
                                    selectedValues[option.id].children[
                                      child.id
                                    ] === true
                                      ? { color: theme.dropdownOptSTxtClr }
                                      : { color: theme.dropdownOptTxtClr }
                                  }>
                                  {child.label}
                                </Text>
                                {multiselect &&
                                selectedValues[option.id] &&
                                selectedValues[option.id].children &&
                                selectedValues[option.id].children[child.id] ===
                                  true ? (
                                  <Icon
                                    name="checkmark-outline"
                                    size={20}
                                    color="red"
                                  />
                                ) : null}
                              </Ripple>
                            );
                          })
                        : null}
                    </View>
                  );
                })}
              </ScrollView>
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
        widthStyle(),
        { backgroundColor: theme.dropdownBgClr },
        showOptions ? buttonBorder : {},
        scale,
        props.style,
      ]}
      onLayout={getDropdownXY}>
      <Ripple
        onPressIn={onFocusIn}
        onPressOut={onFocusOut}
        style={[styles.dropdownBtn]}>
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
    borderRadius: 10,
    height: 50,
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 2 },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#A8A4B8',
    overflow: 'hidden',
  },
  dropdownBtn: {
    borderRadius: 10,
    height: 50,
    width: '100%',
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
  optionsScrollContainer: {
    width: '100%',
    maxHeight: 160,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  optionsContainer: {
    width: 170,
    maxHeight: 160,
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
    width: '100%',
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
