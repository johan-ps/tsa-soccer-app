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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const UiMenu = props => {
  const theme = useSelector(state => state.theme.colors);
  const [showOptions, setShowOptions] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const menuIcon = useRef();

  const onOpenHandler = () => {
    menuIcon.current.measure((fx, fy, width, height, px, py) => {
      setOffsetX(px - 190 + width);
      setOffsetY(py);
    });
    setShowOptions(true);
    Animated.timing(menuAnimation, {
      toValue: 1,
      duration: 255,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const optionPosition = {
    top: offsetY,
    left: offsetX,
  };

  const onCloseHandler = () => {
    setTimeout(() => {
      setShowOptions(false);
    }, 225);
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 255,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const menuAnim = {
    transform: [
      {
        scale: menuAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1],
        }),
      },
    ],
    opacity: menuAnimation,
  };

  const renderOptions = () => {
    if (Platform.OS === 'ios') {
      return null;
    } else {
      return (
        <View>
          {props.options.map(option => {
            return (
              <View style={styles.buttonWrapper} key={option.id}>
                <TouchableNativeFeedback
                  onPress={props.onPress}
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
        </View>
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
          <Animated.View style={[styles.optionsContainer, optionPosition, menuAnim]}>
            {renderOptions()}
          </Animated.View>
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
  },
  touchable: {
    height: 45,
    width: 190,
    backgroundColor: '#414141',
  },
  textWrapper: {
    height: 45,
    width: 190,
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
