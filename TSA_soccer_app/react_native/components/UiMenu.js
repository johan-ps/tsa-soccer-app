import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableNativeFeedback,
  Platform,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const UiMenu = props => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const theme = useSelector(state => state.theme.colors);
  const [showOptions, setShowOptions] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [flipY, setFlipY] = useState(false);
  const menuSizeAnimation = useRef(
    new Animated.ValueXY({ x: 0, y: 0 }),
  ).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const menuIcon = useRef();
  const EASING = Easing.bezier(0.4, 0, 0.2, 1);
  const SCREEN_INDENT = 8;
  const optionWidth = 150;
  const optionHeight = 45;
  const bottomNavHeight = 56;
  const transforms = [];

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
        transforms.push({
          translateY: Animated.multiply(menuSizeAnimation.y, -1),
        });
        setOffsetY(windowHeight - py - bottomNavHeight);
      } else {
        setFlipY(false);
        setOffsetY(y);
      }
    });
    setAnimationStarted(true);
    setShowOptions(true);
    Animated.parallel([
      Animated.timing(menuSizeAnimation, {
        toValue: { x: optionWidth, y: optionHeight },
        duration: 250,
        easing: EASING,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 250,
        easing: EASING,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const optionPosition = () => {
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
  };

  const onCloseHandler = () => {
      setAnimationStarted(false);
      menuSizeAnimation.setValue({ x: 0, y: 0 });
      setShowOptions(false);
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
  };

  const onSelectOptionHandler = option => {
    onCloseHandler();
      props.onPress(option);
    
  };

  const opacityAnim = {
    opacity: opacityAnimation,
  };

  const menuSize = {
    width: menuSizeAnimation.x,
    height: menuSizeAnimation.y,
    transform: transforms,
  };

  const renderOptions = () => {
    if (Platform.OS === 'ios') {
      return (
        <Animated.View
          style={[
            styles.optionsContainer,
            { backgroundColor: theme.menuBg },
            optionPosition(),
            opacityAnim,
          ]}>
          {props.options.map(option => {
            return (
              <View style={styles.buttonWrapper} key={option.id}>
                <TouchableOpacity
                  onPress={() => {
                    onSelectOptionHandler(option);
                  }}
                  style={[styles.touchable, { backgroundColor: theme.menuBg }]}
                >
                  <Animated.View
                    style={[
                      styles.textWrapper,
                      { backgroundColor: theme.menuBg },
                      animationStarted && menuSize,
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
      )
    } else {
      return (
        <Animated.View
          style={[
            styles.optionsContainer,
            { backgroundColor: theme.menuBg },
            optionPosition(),
            opacityAnim,
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
                      animationStarted && menuSize,
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
        <Icon name="ellipsis-vertical" size={20} color={theme.iconClr} />
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
