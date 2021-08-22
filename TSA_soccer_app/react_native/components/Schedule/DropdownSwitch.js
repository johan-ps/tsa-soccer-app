import React, { useMemo, useState, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const DropdownSwitch = props => {
  const { options = [], value } = props;
  const theme = useSelector(state => state.theme.colors);
  const opacityAnim = useSharedValue(0);
  const [showOptions, setShowOptions] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const actionBtn = useRef();
  const optionHeight = 40;

  const onPressHandler = () => {
    actionBtn.current.measure((fx, fy, width, height, px, py) => {
      setOffsetX(px - 17);
      setOffsetY(py - optionHeight * value.id);
    });
    setShowOptions(true);
    opacityAnim.value = withTiming(1);
  };

  const onCloseHandler = () => {
    opacityAnim.value = withTiming(0, { duration: 225 }, () => {
      runOnJS(setShowOptions)(false);
    });
  };

  const optionPosition = useMemo(() => {
    return {
      top: offsetY,
      left: offsetX,
    };
  }, [offsetX, offsetY]);

  const optionsStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityAnim.value,
    };
  });

  const onChangeHandler = id => {
    onCloseHandler();
    if (props.onPress) {
      props.onPress(id);
    }
  };

  return (
    <View onLayout={() => {}} ref={actionBtn} style={styles.relative}>
      <TouchableOpacity
        onPress={onPressHandler}
        style={styles.viewCalenderLink}>
        <Text
          style={[
            styles.select,
            { color: theme.link, fontFamily: theme.fontRegular },
          ]}>
          {value.label}
        </Text>
        <Icon name="chevron-down-outline" size={30} color={theme.link} />
      </TouchableOpacity>
      <Modal animationType="none" visible={showOptions} transparent={true}>
        <Pressable onPress={onCloseHandler} style={styles.menuContainer}>
          <Animated.View
            style={[
              styles.optionsContainer,
              optionsStyle,
              optionPosition,
              { backgroundColor: theme.ddBgClr },
            ]}>
            {options.map(option => {
              return (
                <View style={styles.option} key={option.id}>
                  <TouchableNativeFeedback
                    onPress={() => {
                      onChangeHandler(option.id);
                    }}
                    style={[styles.touchable]}
                    background={TouchableNativeFeedback.Ripple(
                      option.darkBg
                        ? theme.touchableBgDark
                        : theme.touchableBgLight,
                      false,
                    )}>
                    <View style={styles.textWrapper}>
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color:
                              value.id === option.id
                                ? theme.link
                                : theme.primaryText,
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
  viewCalenderLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 40,
  },
  select: {
    marginRight: 5,
    fontSize: 16,
  },

  option: {
    height: 40,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    height: 40,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '100%',
    height: '100%',
  },
  touchable: {
    // height: 33,
    // width: 144,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  relative: {
    position: 'relative',
  },
  optionsContainer: {
    height: 80,
    width: 130,
    position: 'absolute',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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

export default DropdownSwitch;
