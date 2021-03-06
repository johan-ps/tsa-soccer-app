import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Dimensions,
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
import ErrorMessage from './ErrorMessage';

const updateSelectedValues = (initValue, options) => {
  let selectedVals = {};
  let newSelectedValues = {};
  let newSelectedLabels = [];

  if (initValue) {
    initValue.forEach(val => {
      selectedVals[val] = true;
    });

    if (options && options.length > 0) {
      options.forEach(groupOpt => {
        newSelectedValues[groupOpt.id] = {
          selected: false,
          children: {},
        };
        if (groupOpt.children) {
          groupOpt.children.forEach(child => {
            newSelectedValues[groupOpt.id].children[child.id] =
              !!selectedVals[child.id];
            if (selectedVals[child.id]) {
              newSelectedLabels.push(child.label);
            }
          });
        }
      });
    }
  }

  return [newSelectedValues, newSelectedLabels];
};

const UiDropdown = forwardRef((props, ref) => {
  const {
    options = [],
    placeholder = 'Select Value...',
    size = 'small',
    multiselect = false,
    group = false,
    defaultValue,
    optionSize = 'small',
    onSelect,
    isValid = true,
    errCode,
    existingValues = [],
    initialValue,
  } = props;
  const [selectedId, setSelectedId] = useState(defaultValue || -1);
  const [selectedLabel, setSelectedLabel] = useState(placeholder);
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState({ width: 170 });
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const dropdownAnimation = useSharedValue(0);
  const focusAnimation = useSharedValue(0);
  const theme = useSelector(state => state.theme.colors);
  const ddBtn = useRef();

  useImperativeHandle(ref, () => ({
    reset,
  }));

  const reset = () => {
    setSelectedValues([]);
    setSelectedLabels([]);
  };

  const onFocusIn = () => {
    focusAnimation.value = withTiming(1, { duration: 40 });
  };

  const onFocusOut = () => {
    focusAnimation.value = withTiming(0, { duration: 40 }, () => {
      // runOnJS(setShowOptions)(true);
      // dropdownAnimation.value = withTiming(1, { duration: 225 });
    });
  };

  useEffect(() => {
    const [newSelectedValues, newSelectedLabels] = updateSelectedValues(
      initialValue,
      options,
    );
    setSelectedValues(newSelectedValues);
    setSelectedLabels(newSelectedLabels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  useEffect(() => {
    const [newSelectedValues, newSelectedLabels] = updateSelectedValues(
      existingValues,
      options,
    );
    setSelectedValues(newSelectedValues);
    setSelectedLabels(newSelectedLabels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (onSelect && multiselect) {
      onSelect(selectedValues);
    }
  }, [selectedValues, onSelect, multiselect]);

  const getDropdownXY = event => {
    const layout = event.nativeEvent.layout;
    setWidth({ width: layout.width });
    setHeight(layout.height);
  };

  const onOpenHandler = useCallback(() => {
    // eslint-disable-next-line no-shadow
    ddBtn.current.measure((fx, fy, width, height, px, py) => {
      setOffsetX(windowWidth - px - width);
      setOffsetY(py);
      setHeight(height);
    });
    setShowOptions(true);
    setTimeout(() => {
      dropdownAnimation.value = withTiming(1, { duration: 225 });
    }, 50);
  }, [dropdownAnimation, windowWidth]);

  const widthStyle = useMemo(() => {
    // eslint-disable-next-line no-shadow
    let width = '48.5%';
    if (size === 'large') {
      width = '100%';
    } else if (size === 'medium') {
      width = '70%';
    }
    return { width };
  }, [size]);

  const positionStyle = useMemo(() => {
    return {
      top: offsetY + height,
      left: offsetX,
    };
  }, [offsetX, offsetY, height]);

  const onSelectOptionHandler = useCallback(
    (option, child = null) => {
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
      if (child) {
        setSelectedId(child.id);
        setSelectedLabel(child.label);
        if (onSelect) {
          onSelect(child.id);
        }
      } else {
        setSelectedId(option.id);
        setSelectedLabel(option.label);
      }
      dropdownAnimation.value = withTiming(0, { duration: 225 }, () => {
        runOnJS(setShowOptions)(false);
      });
    },
    [dropdownAnimation, multiselect, onSelect, selectedLabels, selectedValues],
  );

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
                { backgroundColor: theme.secondaryBg },
                positionStyle,
                optionsAnimStyles,
                optionSize === 'large' ? styles.maxHeight : {},
              ]}>
              <ScrollView
                style={[
                  styles.optionsScrollContainer,
                  { backgroundColor: theme.secondaryBg },
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
                            ? { backgroundColor: theme.secondaryText }
                            : {},
                        ]}>
                        <Text
                          style={[
                            option.id === selectedId
                              ? { color: theme.secondaryText }
                              : { color: theme.primaryText },
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
                                      ? { color: theme.primaryText }
                                      : { color: theme.primaryText },
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
    <View style={styles.errorContainer}>
      <Animated.View
        style={[
          styles.dropdownContainer,
          widthStyle,
          { backgroundColor: theme.secondaryBg },
          showOptions ? buttonBorder : {},
          scale,
          props.style,
        ]}
        ref={ddBtn}
        onLayout={getDropdownXY}>
        <Ripple
          onPressIn={onFocusIn}
          onPress={onOpenHandler}
          onPressOut={onFocusOut}
          style={[styles.dropdownBtn]}>
          {selectedLabels.length === 0 && (
            <Text
              style={[
                styles.dropdownLabel,
                {
                  color: isValid ? theme.secondaryText : theme.error,
                  fontFamily: theme.fontMedium,
                },
              ]}>
              {selectedLabel}
            </Text>
          )}
          <View style={[styles.selectLabelsContainer]}>
            {selectedLabels.map((label, i) => (
              <View
                key={i}
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
              { backgroundColor: theme.secondaryBg },
              iconAnimStyles,
            ]}>
            <Icon
              name="chevron-down-outline"
              color={showOptions ? theme.ddBorderClr : theme.secondaryText}
              size={24}
            />
          </Animated.View>
        </Ripple>
        {renderOptions()}
      </Animated.View>
      <ErrorMessage isValid={isValid} errCode={errCode} />
    </View>
  );
});

const styles = StyleSheet.create({
  errorContainer: {
    position: 'relative',
  },
  maxHeight: {
    maxHeight: 320,
  },
  selectLabels: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  selectLabelsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  dropdownLabel: {
    fontSize: 15,
  },
  dropdownContainer: {
    minHeight: 62,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 2,
    // shadowRadius: 2,
    // shadowColor: '#000000',
    // shadowOpacity: 0.3,
    // shadowOffset: { height: 2 },
    // borderWidth: 1,
    // borderStyle: 'solid',
    // overflow: 'hidden',
    position: 'relative',
  },
  dropdownBtn: {
    borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
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
    position: 'absolute',
    alignSelf: 'center',
    right: 20,
  },
});

export default memo(UiDropdown, (prevState, nextState) => {
  return prevState.options === nextState.options;
});
