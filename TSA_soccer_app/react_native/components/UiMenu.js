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
  const theme = useSelector(state => state.theme.colors);
  const [showOptions, setShowOptions] = useState(false);
  const [closing, setClosing] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const menuIcon = useRef();

  const onOpenHandler = () => {
    menuIcon.current.measure((fx, fy, width, height, px, py) => {
      setOffsetX(windowWidth - px - width + 15);
      setOffsetY(py + 8);
    });
    setClosing(false);
    setShowOptions(true);
    Animated.timing(menuAnimation, {
      toValue: 1,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const optionPosition = {
    top: offsetY,
    right: offsetX,
  };

  const onCloseHandler = () => {
    setClosing(true);
    setTimeout(() => {
      setShowOptions(false);
    }, 100);
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const menuAnim = () => {
    if (closing) {
      return {
        opacity: menuAnimation,
      };
    } else {
      return {
        transform: [
          {
            scaleY: menuAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          },
          {
            translateY: menuAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
          {
            scaleX: menuAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 1],
            }),
          },
          {
            translateX: menuAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [94, 0],
            }),
          },
        ],
      };
    }
  };

  const renderOptions = () => {
    if (Platform.OS === 'ios') {
      return null;
    } else {
      return (
        <Animated.View
          style={[styles.optionsContainer, optionPosition, menuAnim()]}>
          {props.options.map(option => {
            return (
              <View style={styles.buttonWrapper} key={option.id}>
                <TouchableNativeFeedback
                  onPress={() => props.onPress(option)}
                  style={[styles.touchable]}
                  background={TouchableNativeFeedback.Ripple(
                    '#ffffff2a',
                    false,
                  )}>
                  <View style={styles.textWrapper}>
                    <Text style={styles.label}>{option.label}</Text>
                  </View>
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
    width: 40,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    position: 'absolute',
    width: 190,
  },
  touchable: {
    height: 45,
    backgroundColor: '#414141',
  },
  textWrapper: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#414141',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#D1D1D1',
  },
});

export default UiMenu;
