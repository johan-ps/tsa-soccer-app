import React, { useMemo, useState, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TouchableNativeFeedback,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { updateEventAvailability } from '../../store/actions/EventActions';

const StatusIndicator = props => {
  const { label, icon, size = 'large', eventId } = props;
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const userId = userData && userData.id;
  const dispatch = useDispatch();
  const options = [
    { label: 'Going', id: 0 },
    { label: 'Maybe', id: 1 },
    { label: 'Unavailable', id: 2 },
  ];
  const opacityAnim = useSharedValue(0);
  const sizeAnim = useSharedValue(0);
  const [showOptions, setShowOptions] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const actionBtn = useRef();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const optionHeight = 33;
  const optionWidth = 144;
  const bottomNavHeight = 70;
  const [flipY, setFlipY] = useState(false);
  const [flipX, setFlipX] = useState(false);

  const primaryClr = useMemo(() => {
    let color;
    if (label === 'Going') {
      color = '#4ce660';
    } else if (label === 'Unavailable') {
      color = '#e84343';
    } else if (label === 'Maybe') {
      color = '#a9a9a9';
    } else {
      color = theme.schCardAccent;
    }

    return color;
  }, [label, theme.schCardAccent]);

  const containerStyle = useMemo(() => {
    let color = primaryClr;

    if (theme.name === 'dark') {
      return {
        backgroundColor: color,
        borderColor: color,
      };
    } else {
      return {
        backgroundColor: color + '12',
        borderColor: color,
      };
    }
  }, [primaryClr, theme]);

  const contentClr = useMemo(() => {
    if (theme.name === 'dark') {
      return '#414141';
    } else {
      return primaryClr;
    }
  }, [primaryClr, theme]);

  const onPressHandler = () => {
    actionBtn.current.measure((fx, fy, width, height, px, py) => {
      const x = px;
      if (windowWidth - x < optionWidth) {
        setFlipX(true);
        setOffsetX(windowWidth - x - width);
      } else {
        setFlipX(false);
        setOffsetX(x);
      }
      // Flip by Y axis if menu hits bottom screen border
      const y = py;
      if (y > windowHeight - bottomNavHeight - optionHeight * options.length) {
        setFlipY(true);
        setOffsetY(windowHeight - py - bottomNavHeight + 12);
      } else {
        setFlipY(false);
        setOffsetY(y);
      }
    });
    setShowOptions(true);
    opacityAnim.value = withTiming(1);
    sizeAnim.value = withTiming(1);
  };

  const onCloseHandler = () => {
    opacityAnim.value = withTiming(0, { duration: 225 }, () => {
      runOnJS(setShowOptions)(false);
      sizeAnim.value = 0;
    });
  };

  const optionPosition = useMemo(() => {
    let position = {};

    if (flipX) {
      position.right = offsetX;
    } else {
      position.left = offsetX;
    }

    if (flipY) {
      position.bottom = offsetY;
    } else {
      position.top = offsetY;
    }

    return position;
  }, [flipY, offsetX, offsetY, flipX]);

  const optionsStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityAnim.value,
      height: interpolate(sizeAnim.value, [0, 1], [33, 99]),
    };
  });

  const updateAvailabilityHandler = async (label) => {
    await dispatch(
      updateEventAvailability(eventId, userId, label),
    );
  };

  const onChangeHandler = option => {
    onCloseHandler();
    updateAvailabilityHandler(option.label);
  };

  return (
    <View onLayout={() => {}} ref={actionBtn} style={styles.relative}>
      <TouchableOpacity
        onPress={onPressHandler}
        style={[
          styles.container,
          size === 'small' ? styles.smallContainer : {},
          containerStyle,
        ]}>
        {icon ? <Icon name={icon} color={contentClr} size={16} /> : null}
        {size === 'large' ? (
          <Text
            style={[
              styles.status,
              { color: contentClr, fontFamily: theme.fontRegular },
              icon ? styles.marginLeft : {},
            ]}>
            {label}
          </Text>
        ) : null}
      </TouchableOpacity>
      <Modal animationType="none" visible={showOptions} transparent={true}>
        <Pressable onPress={onCloseHandler} style={styles.menuContainer}>
          <Animated.View
            style={[
              styles.optionsContainer,
              optionsStyle,
              optionPosition,
              { backgroundColor: theme.secondaryBg },
            ]}>
            {options.map(option => {
              return (
                <View style={styles.option} key={option.id}>
                  <TouchableNativeFeedback
                    onPress={() => {
                      onChangeHandler(option);
                    }}
                    style={[styles.touchable]}
                    background={TouchableNativeFeedback.Ripple(
                      theme.name === 'dark'
                        ? theme.touchableBgDark
                        : theme.touchableBgLight,
                      false,
                    )}>
                    <View style={styles.textWrapper}>
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: theme.menuText,
                            fontFamily: theme.fontRegular,
                          },
                        ]}>
                        {option.label}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              );
            })}
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
    height: 33,
    width: 144,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    height: 33,
    width: 144,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '100%',
    height: '100%',
  },
  touchable: {},
  optionText: {
    fontSize: 16,
  },
  relative: {
    position: 'relative',
  },
  optionsContainer: {
    height: 33,
    width: 144,
    position: 'absolute',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 2,
    elevation: 8,
  },
  container: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    height: 33,
    width: 144,
  },
  smallContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 40,
  },
  status: {},
  marginLeft: {
    marginLeft: 5,
  },
});

export default StatusIndicator;
