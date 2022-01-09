/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  TouchableNativeFeedback,
  Platform,
  TouchableHighlight,
} from 'react-native';
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
import { Chip } from 'react-native-paper';

const UiDropdown = props => {
  const {
    options = [],
    placeholder = 'Select Value...',
    error,
    selectedValues,
    labelMapping,
  } = props;
  const [showOptions, setShowOptions] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState({ width: 170 });
  const windowWidth = Dimensions.get('window').width;
  const dropdownAnimation = useSharedValue(0);
  const focusAnimation = useSharedValue(0);
  const theme = useSelector(state => state.theme.colors);
  const ddBtn = useRef();
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    if (selectedValues && selectedValues.length > 0) {
      setSelectedCount(selectedValues.filter(val => val).length);
    }
  }, [selectedValues]);

  const onFocusIn = () => {
    focusAnimation.value = withTiming(1, { duration: 40 });
  };

  const onFocusOut = () => {
    focusAnimation.value = withTiming(0, { duration: 40 });
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

  const onSelectOptionHandler = useCallback(
    option => {
      if (props.onChange) {
        const updatedValues = [...selectedValues];
        updatedValues[labelMapping[option.id]] =
          !updatedValues[labelMapping[option.id]];

        if (updatedValues[labelMapping[option.id]]) {
          setSelectedCount(selectedCount + 1);
        } else {
          setSelectedCount(selectedCount - 1);
        }
        props.onChange(updatedValues);
      }
    },
    [labelMapping, props, selectedCount, selectedValues],
  );

  const renderOption = option => {
    if (option.group) {
      return (
        <Pressable style={styles.option}>
          <Text
            style={{
              fontFamily: option.group ? theme.fontBold : theme.fontRegular,
            }}>
            {option.label}
          </Text>
        </Pressable>
      );
    } else if (Platform.OS === 'ios') {
      return (
        <TouchableHighlight
          onPress={() => {
            onSelectOptionHandler(option);
          }}
          activeOpacity={0.8}
          underlayColor={theme.touchableBgLight}>
          <View style={styles.option}>
            <Text
              style={
                selectedValues[labelMapping[option.id]]
                  ? { color: theme.ddBorderClr }
                  : { color: theme.primaryText }
              }>
              {option.label}
            </Text>
            {selectedValues[labelMapping[option.id]] ? (
              <Icon
                name="checkmark-outline"
                size={20}
                color={theme.ddBorderClr}
              />
            ) : null}
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableNativeFeedback
          onPress={() => {
            onSelectOptionHandler(option);
          }}
          style={{ borderRadius: 16 }}
          background={TouchableNativeFeedback.Ripple(
            theme.touchableBgLight,
            false,
          )}>
          <View style={styles.option}>
            <Text
              style={
                selectedValues[labelMapping[option.id]]
                  ? { color: theme.ddBorderClr }
                  : { color: theme.primaryText }
              }>
              {option.label}
            </Text>
            {selectedValues[labelMapping[option.id]] ? (
              <Icon
                name="checkmark-outline"
                size={20}
                color={theme.ddBorderClr}
              />
            ) : null}
          </View>
        </TouchableNativeFeedback>
      );
    }
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
            {options.map(option => {
              return <View key={option.id}>{renderOption(option)}</View>;
            })}
          </Animated.View>
        </Pressable>
      );
    } else {
      return null;
    }
  };

  const renderChips = useMemo(() => {
    const chips = [];

    for (const key in labelMapping) {
      if (selectedValues[labelMapping[key]]) {
        const chip = (
          <Chip
            key={key}
            mode="outlined"
            onClose={() => {
              onSelectOptionHandler(options[labelMapping[key]]);
            }}
            style={[
              { marginRight: 5 },
              selectedCount < 3 ? {} : { marginBottom: 5 },
            ]}>
            {options[labelMapping[key]].label}
          </Chip>
        );
        chips.push(chip);
      }
    }

    return (
      <View
        style={[
          styles.selectLabelsContainer,
          selectedCount === 0 ? {} : { padding: 5 },
        ]}>
        {chips}
      </View>
    );
  }, [
    labelMapping,
    onSelectOptionHandler,
    options,
    selectedCount,
    selectedValues,
  ]);

  const renderButton = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={theme.touchableBgLight}
          onPressIn={onFocusIn}
          onPressOut={onFocusOut}
          onPress={onOpenHandler}
          style={styles.touchableDDBtn}>
          <View
            style={[
              styles.dropdownBtn,
              selectedCount === 0 ? {} : styles.dropdownBtnPaddingLabel,
            ]}>
            {selectedCount === 0 ? (
              <Text
                style={[
                  styles.dropdownLabel,
                  {
                    color: !error ? theme.secondaryText : theme.error,
                    fontFamily: theme.fontMedium,
                  },
                ]}>
                {placeholder}
              </Text>
            ) : (
              renderChips
            )}
            <Animated.View style={[styles.iconContainer, iconAnimStyles]}>
              <Icon
                name="chevron-down-outline"
                color={showOptions ? theme.ddBorderClr : theme.secondaryText}
                size={24}
              />
            </Animated.View>
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableNativeFeedback
          onPressIn={onFocusIn}
          onPressOut={onFocusOut}
          onPress={onOpenHandler}
          background={TouchableNativeFeedback.Ripple(
            theme.touchableBgLight,
            false,
          )}>
          <View
            style={[
              styles.dropdownBtn,
              selectedCount === 0 ? {} : styles.dropdownBtnPaddingLabel,
            ]}>
            {selectedCount === 0 ? (
              <Text
                style={[
                  styles.dropdownLabel,
                  {
                    color: !error ? theme.secondaryText : theme.error,
                    fontFamily: theme.fontMedium,
                  },
                ]}>
                {placeholder}
              </Text>
            ) : (
              renderChips
            )}
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
    minHeight: 62,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  dropdownBtn: {
    borderRadius: 16,
    width: '100%',
    minHeight: 62,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  touchableDDBtn: {
    borderRadius: 16,
    width: '100%',
    minHeight: 62,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  optionsScrollContainer: {
    width: '100%',
    maxHeight: 320,
    borderRadius: 10,
  },
  optionsContainer: {
    width: 170,
    maxHeight: 320,
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
    height: 42,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
  },
  dropdownBtnPaddingLabel: {
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  selectLabelsContainer: {
    flexDirection: 'row',
    // alignItems: 'flex-start',
    flexWrap: 'wrap',
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
  dropdownLabel: {
    fontSize: 15,
  },
  selectedText: {
    color: '#A29FAF',
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
