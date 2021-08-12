import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableNativeFeedback,
  Platform,
  Pressable,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

const UiMenu = props => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const theme = useSelector(state => state.theme.colors);
  const [showOptions, setShowOptions] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [flipY, setFlipY] = useState(false);
  const menuAnimX = useSharedValue(0);
  const menuAnimY = useSharedValue(0);
  const opacityAnimation = useSharedValue(0);
  const menuIcon = useRef();
  const optionWidth = 150;
  const optionHeight = 45;
  const bottomNavHeight = 70;

  const onOpenHandler = () => {
    menuIcon.current.measure((fx, fy, width, height, px, py) => {
      setOffsetX(windowWidth - px - width);
      // Flip by Y axis if menu hits bottom screen border
      const y = py;
      if (
        y >
        windowHeight - bottomNavHeight - optionHeight * props.options.length
      ) {
        setFlipY(true);
        setOffsetY(windowHeight - py - bottomNavHeight);
      } else {
        setFlipY(false);
        setOffsetY(y);
      }
    });
    setShowOptions(true);
    opacityAnimation.value = withTiming(1, { duration: 250 });
    menuAnimX.value = withTiming(optionWidth, { duration: 250 });
    menuAnimY.value = withTiming(optionHeight * props.options.length, {
      duration: 250,
    });
  };

  const optionPosition = useMemo(() => {
    if (flipY) {
      return {
        bottom: offsetY,
        right: offsetX,
      };
    } else {
      return {
        top: offsetY,
        right: offsetX,
      };
    }
  }, [flipY, offsetX, offsetY]);

  const onCloseHandler = () => {
    opacityAnimation.value = withTiming(0, { duration: 250 }, () => {
      menuAnimX.value = 0;
      menuAnimY.value = 0;
      if (Platform.OS !== 'ios') {
        runOnJS(setShowOptions)(false);
      }
    });
    if (Platform.OS === 'ios') {
      setShowOptions(false);
    }
  };

  const onSelectOptionHandler = option => {
    onCloseHandler();
    props.onPress(option);
  };

  const opacityAnim = useAnimatedStyle(() => {
    return {
      opacity: opacityAnimation.value,
    };
  });

  const menuSize = useAnimatedStyle(() => {
    return {
      width: menuAnimX.value,
      height: menuAnimY.value,
    };
  });

  const renderOptions = () => {
    if (Platform.OS === 'ios') {
      return (
        <Animated.View
          style={[
            styles.optionsContainer,
            { backgroundColor: theme.menuBg },
            optionPosition,
            opacityAnim,
            menuSize,
          ]}>
          {props.options.map(option => {
            return (
              <View style={styles.buttonWrapper} key={option.id}>
                <TouchableOpacity
                  onPress={() => {
                    onSelectOptionHandler(option);
                  }}
                  style={[styles.touchable, { backgroundColor: theme.menuBg }]}>
                  <Animated.View
                    style={[
                      styles.textWrapper,
                      { backgroundColor: theme.menuBg },
                    ]}>
                    <Text style={[styles.label, { color: theme.menuText }]}>
                      {option.label}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            );
          })}
        </Animated.View>
      );
    } else {
      return (
        <Animated.View
          style={[
            styles.optionsContainer,
            { backgroundColor: theme.menuBg },
            optionPosition,
            opacityAnim,
            menuSize,
          ]}>
          {props.options.map(option => {
            return (
              <View style={styles.buttonWrapper} key={option.id}>
                <TouchableNativeFeedback
                  onPress={() => {
                    onSelectOptionHandler(option);
                  }}
                  style={[styles.touchable, { backgroundColor: theme.menuBg }]}
                  background={TouchableNativeFeedback.Ripple(
                    theme.name === 'dark'
                      ? theme.touchableBgDark
                      : theme.touchableBgLight,
                    false,
                  )}>
                  <Animated.View
                    style={[
                      styles.textWrapper,
                      { backgroundColor: theme.menuBg },
                    ]}>
                    <Text style={[styles.label, { color: theme.menuText }]}>
                      {option.label}
                    </Text>
                  </Animated.View>
                </TouchableNativeFeedback>
              </View>
            );
          })}
        </Animated.View>
      );
    }
  };

  return (
    <View style={styles.menuContainer} ref={menuIcon} onLayout={event => {}}>
      <TouchableOpacity style={styles.iconContainer} onPress={onOpenHandler}>
        <Icon name="ellipsis-vertical" size={20} color={props.color} />
      </TouchableOpacity>
      <Modal animationType="none" transparent={true} visible={showOptions}>
        <Pressable onPress={onCloseHandler} style={[styles.modalContainer]}>
          {renderOptions()}
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    position: 'absolute',
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 2,
    elevation: 8,
  },
  touchable: {},
  textWrapper: {
    height: 45,
    width: 150,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});

export default UiMenu;
