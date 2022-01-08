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
  TouchableNativeFeedback,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
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
import { Portal } from '@gorhom/portal';

const UiDropdown = props => {
  const {
    options = [],
    placeholder = 'Select Value...',
    multiselect = false,
    group = false,
    onSelect,
    error,
    selectedValues = {},
  } = props;
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
  const [labelMapping, setLabelMapping] = useState({});

  useEffect(() => {
    const mapping = {};
    setLabelMapping(mapping);
  }, [options]);

  const onFocusIn = () => {
    focusAnimation.value = withTiming(1, { duration: 40 });
  };

  const onFocusOut = () => {
    focusAnimation.value = withTiming(0, { duration: 40 }, () => {
      runOnJS(setShowOptions)(true);
      dropdownAnimation.value = withTiming(1, { duration: 225 });
    });
  };

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

  const positionStyle = useMemo(() => {
    return {
      top: offsetY + height,
      left: offsetX,
    };
  }, [offsetX, offsetY, height]);

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

  const onSelectOptionHandler = option => {
    console.log(options);
  };

  const renderOptions = () => {
    if (showOptions) {
      return (
        <Pressable onPress={onCloseHandler} style={[styles.modalContainer]}>
          <Animated.View
            style={[
              styles.optionsContainer,
              width,
              { backgroundColor: theme.secondaryBg },
              positionStyle,
              optionsAnimStyles,
            ]}>
            <ScrollView
              style={[
                styles.optionsScrollContainer,
                { backgroundColor: theme.secondaryBg },
              ]}>
              {options.map(option => {
                return (
                  <TouchableNativeFeedback
                    key={option.id}
                    onPress={() => {}}
                    style={{ borderRadius: 10 }}
                    background={TouchableNativeFeedback.Ripple(
                      theme.touchableBgLight,
                      false,
                    )}>
                    <View />
                  </TouchableNativeFeedback>
                  // <View key={option.id}>
                  //   <Ripple
                  //     onPress={() => {
                  //       onSelectOptionHandler(option);
                  //     }}
                  //     style={[
                  //       styles.option,
                  //       (multiselect &&
                  //         selectedValues[option.id] &&
                  //         selectedValues[option.id].selected === true) ||
                  //       (!multiselect && option.id === selectedId)
                  //         ? { backgroundColor: theme.secondaryText }
                  //         : {},
                  //     ]}>
                  //     <Text
                  //       style={[
                  //         option.id === selectedId
                  //           ? { color: theme.secondaryText }
                  //           : { color: theme.primaryText },
                  //         group
                  //           ? { fontFamily: theme.fontBold }
                  //           : { fontFamily: theme.fontRegular },
                  //       ]}>
                  //       {option.label}
                  //     </Text>
                  //     {(multiselect &&
                  //       selectedValues[option.id] &&
                  //       selectedValues[option.id].selected === true) ||
                  //     (!multiselect && option.id === selectedId) ? (
                  //       <Icon
                  //         name="checkmark-outline"
                  //         size={20}
                  //         color={theme.ddBorderClr}
                  //       />
                  //     ) : null}
                  //   </Ripple>
                  //   {option.children
                  //     ? option.children.map(child => {
                  //         return (
                  //           <Ripple
                  //             onPress={() => {
                  //               onSelectOptionHandler(option, child);
                  //             }}
                  //             style={[
                  //               styles.option,
                  //               multiselect &&
                  //               selectedValues[option.id] &&
                  //               selectedValues[option.id].children &&
                  //               selectedValues[option.id].children[
                  //                 child.id
                  //               ] === true
                  //                 ? { backgroundColor: theme.ddOptSClr }
                  //                 : {},
                  //             ]}
                  //             key={child.id}>
                  //             <Text
                  //               style={[
                  //                 multiselect &&
                  //                 selectedValues[option.id] &&
                  //                 selectedValues[option.id].children &&
                  //                 selectedValues[option.id].children[
                  //                   child.id
                  //                 ] === true
                  //                   ? { color: theme.primaryText }
                  //                   : { color: theme.primaryText },
                  //                 { fontFamily: theme.fontRegular },
                  //               ]}>
                  //               {child.label}
                  //             </Text>
                  //             {multiselect &&
                  //             selectedValues[option.id] &&
                  //             selectedValues[option.id].children &&
                  //             selectedValues[option.id].children[child.id] ===
                  //               true ? (
                  //               <Icon
                  //                 name="checkmark-outline"
                  //                 size={20}
                  //                 color={theme.ddBorderClr}
                  //               />
                  //             ) : null}
                  //           </Ripple>
                  //         );
                  //       })
                  //     : null}
                  // </View>
                );
              })}
            </ScrollView>
          </Animated.View>
        </Pressable>
      );
    } else {
      return null;
    }
  };

  const renderButton = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPressIn={onFocusIn}
          onPressOut={onFocusOut}
          onPress={() => {
            console.log('pressed');
          }}
          style={{}}>
          <View style={styles.dropdownBtn} />
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableNativeFeedback
          onPressIn={onFocusIn}
          onPressOut={onFocusOut}
          onPress={() => {}}
          style={{}}
          background={TouchableNativeFeedback.Ripple(
            theme.touchableBgLight,
            false,
          )}>
          <View style={styles.dropdownBtn}>
            {true && (
              <Text
                style={[
                  styles.dropdownLabel,
                  {
                    color: !error ? theme.secondaryText : theme.error,
                    fontFamily: theme.fontMedium,
                  },
                ]}>
                Select
              </Text>
            )}
            {/* <View style={[styles.selectLabelsContainer]}>
              {selectedValues.map((label, i) => (
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
            </View> */}
            <Animated.View style={[styles.iconContainer, iconAnimStyles]}>
              <Icon
                name="chevron-down-outline"
                color={showOptions ? theme.ddBorderClr : theme.secondaryText}
                size={24}
              />
            </Animated.View>
          </View>
        </TouchableNativeFeedback>
      );
    }
  };

  return (
    <View style={styles.errorContainer}>
      <Animated.View
        style={[
          styles.dropdownContainer,
          { backgroundColor: theme.secondaryBg },
          showOptions ? buttonBorder : {},
          scale,
          props.style,
        ]}
        ref={ddBtn}
        onLayout={getDropdownXY}>
        {renderButton()}
        <Portal>{renderOptions()}</Portal>
      </Animated.View>
      <ErrorMessage isValid={!error} errCode={error} />
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    position: 'relative',
  },
  maxHeight: {
    maxHeight: 320,
  },
  dropdownContainer: {
    height: 62,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  dropdownBtn: {
    borderRadius: 16,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 50,
    position: 'absolute',
    alignSelf: 'center',
    right: 20,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
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
  selectedText: {
    color: '#A29FAF',
  },
  optionsScrollContainer: {
    width: '100%',
    maxHeight: 320,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  optionsContainer: {
    width: 170,
    maxHeight: 320,
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
});

export default memo(UiDropdown, (prevState, nextState) => {
  return prevState.options === nextState.options;
});
