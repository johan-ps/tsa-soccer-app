import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
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
    defaultValue,
    optionSize = 'small',
    onSelect,
  } = props;
  const [selectedId, setSelectedId] = useState(defaultValue || -1);
  const [selectedLabel, setSelectedLabel] = useState(placeholder);
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [width, setWidth] = useState({ width: 170 });
  const dropdownAnimation = useSharedValue(0);
  const focusAnimation = useSharedValue(0);
  const theme = useSelector(state => state.theme.colors);

  const onFocusIn = () => {
    focusAnimation.value = withTiming(1, { duration: 40 });
  };

  const onFocusOut = () => {
    focusAnimation.value = withTiming(0, { duration: 40 }, () => {
      runOnJS(setShowOptions)(true);
      dropdownAnimation.value = withTiming(1, { duration: 225 });
    });
  };

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedValues);
    }
  }, [selectedValues, onSelect]);

  const getDropdownXY = event => {
    const layout = event.nativeEvent.layout;
    setOffsetY(layout.height + layout.y + modalOffsetY);
    setOffsetX(layout.x + modalOffsetX);
    setWidth({ width: layout.width });
  };

  const widthStyle = () => {
    // eslint-disable-next-line no-shadow
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
      const newSelectedLabels = [...selectedLabels];
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
        const index = newSelectedLabels.indexOf(child.label);
        if (index !== -1) {
          newSelectedLabels.splice(index, 1);
        } else {
          newSelectedLabels.push(child.label);
        }
      }

      setSelectedLabels(newSelectedLabels);
      setSelectedValues(newSelectedValues);
      return;
    }
    setSelectedId(option.id);
    setSelectedLabel(option.label);
    dropdownAnimation.value = withTiming(0, { duration: 225 }, () => {
      runOnJS(setShowOptions)(false);
    });
  };

  const onCloseHandler = () => {
    dropdownAnimation.value = withTiming(0, { duration: 225 }, () => {
      runOnJS(setShowOptions)(false);
    });
  };

  const buttonBorder = {
    borderColor: theme.ddBorderClr,
    shadowColor: '#e51b23',
  };

  const scale = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(focusAnimation.value, [0, 1], [1, 0.99]),
        },
      ],
    };
  });

  const optionsAnimStyles = useAnimatedStyle(() => {
    return {
      opacity: dropdownAnimation.value,
      transform: [
        {
          translateY: interpolate(dropdownAnimation.value, [0, 1], [0, 10]),
        },
        {
          scaleY: interpolate(dropdownAnimation.value, [0, 1], [0.9, 1]),
        },
      ],
    };
  });

  const iconAnimStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate:
            interpolate(dropdownAnimation.value, [0, 1], [0, -180]) + 'deg',
        },
      ],
    };
  });

  const renderOptions = () => {
    if (showOptions) {
      return (
        <Modal animationType="none" transparent={true}>
          <Pressable onPress={onCloseHandler} style={[styles.modalContainer]}>
            <Animated.View
              style={[
                styles.optionsContainer,
                width,
                { backgroundColor: theme.ddBgClr },
                positionStyle,
                optionsAnimStyles,
                optionSize === 'large' ? styles.maxHeight : {},
              ]}>
              <ScrollView
                style={[
                  styles.optionsScrollContainer,
                  { backgroundColor: theme.ddBgClr },
                  optionSize === 'large' ? styles.maxHeight : {},
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
                            ? { backgroundColor: theme.ddOptSClr }
                            : {},
                        ]}>
                        <Text
                          style={[
                            option.id === selectedId
                              ? { color: theme.ddOptSTxtClr }
                              : { color: theme.ddOptTxtClr },
                            group
                              ? { fontFamily: theme.fontBold }
                              : { fontFamily: theme.fontRegular },
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
                            color={theme.ddBorderClr}
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
                                    ? { backgroundColor: theme.ddOptSClr }
                                    : {},
                                ]}
                                key={child.id}>
                                <Text
                                  style={[
                                    multiselect &&
                                    selectedValues[option.id] &&
                                    selectedValues[option.id].children &&
                                    selectedValues[option.id].children[
                                      child.id
                                    ] === true
                                      ? { color: theme.ddOptSTxtClr }
                                      : { color: theme.ddOptTxtClr },
                                    { fontFamily: theme.fontRegular },
                                  ]}>
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
                                    color={theme.ddBorderClr}
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
        { backgroundColor: theme.ddBgClr },
        showOptions ? buttonBorder : {},
        scale,
        props.style,
      ]}
      onLayout={getDropdownXY}>
      <Ripple
        onPressIn={onFocusIn}
        onPressOut={onFocusOut}
        style={[styles.dropdownBtn]}>
        {selectedLabels.length === 0 && (
          <Text style={{ color: theme.ddSClr }}>{selectedLabel}</Text>
        )}
        <View horizontal={true} style={styles.selectLabelsContainer}>
          {selectedLabels.map(label => (
            <View
              style={[
                styles.selectLabels,
                { backgroundColor: theme.ddSelectLabelBg },
              ]}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: theme.fontRegular,
                  color: theme.ddSelectLabelText,
                }}>
                {label}
              </Text>
            </View>
          ))}
        </View>
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.ddBgClr },
            iconAnimStyles,
          ]}>
          <Icon
            name="chevron-down-outline"
            color={showOptions ? theme.ddBorderClr : theme.ddSClr}
            size={24}
          />
        </Animated.View>
      </Ripple>
      {renderOptions()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  maxHeight: {
    maxHeight: 320,
  },
  selectLabels: {
    width: 70,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    padding: 2,
  },
  selectLabelsContainer: {
    flexDirection: 'row',
    padding: 0,
    width: 140,
  },
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
