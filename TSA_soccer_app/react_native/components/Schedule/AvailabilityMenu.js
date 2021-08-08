import React, { useState, useRef, useMemo, forwardRef, useImperativeHandle, useEffect } from 'react';
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
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

// forwardRef allows functional components to have refs
const AvailabilityMenu = forwardRef((props, ref) => {

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const theme = useSelector(state => state.theme.colors);
  const [showOptions, setShowOptions] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const menuAnimX = useSharedValue(0);
  const menuAnimY = useSharedValue(0);
  const opacityAnimation = useSharedValue(0);
  const menuIcon = useRef();
  const optionWidth = 120;
  const optionHeight = 45;
  const bottomNavHeight = 70;
  const [openAvailableMenu, setOpenAvailableMenu] = useState(false);
  const defaultOption = {icon: 'information-outline', color: '#1E2630'};
  const options = [{id: 0, label: 'Going', icon: 'checkmark', color: '#4ce660'}, {id: 1, label: 'Maybe', icon: 'help',  color: '#a9a9a9'}, {id: 2, label: 'Unavailable', icon: 'close', color: '#e84343'}];
  const [availability, setAvailability] = useState(defaultOption);

  useEffect(() => {
    if(props.option){
      setAvailability(props.option);
    }
  }, [props.option])

  const onOpenHandler = () => {
    if(props.onPress){
      props.onPress();
    }
    else{
      menuIcon.current.measure((fx, fy, width, height, px, py) => {
        setOffsetX(windowWidth - px - width);
        // Flip by Y axis if menu hits bottom screen border
        const y = py;
        const x = px;
        if (
          y >
          windowHeight - bottomNavHeight - optionHeight * options.length
        ) {
          setFlipY(true);
          setOffsetY(windowHeight - py - bottomNavHeight);
        } else {
          setFlipY(false);
          setOffsetY(y);
        }
        // Flip by X axis if meny hits left screen side
        if (x - optionWidth < 0){
          setFlipX(true);
          setOffsetX(x)
        }
      });
      setShowOptions(true);
      opacityAnimation.value = withTiming(1, { duration: 250 });
      menuAnimX.value = withTiming(optionWidth, { duration: 250 });
      menuAnimY.value = withTiming(optionHeight * options.length, {
        duration: 250,
      });
    }
  };

  const optionPosition = useMemo(() => {
    if (flipY) {
      return {
        bottom: offsetY,
        right: offsetX,
      };
    } else if (flipX) {
      return {
        top: offsetY,
        left: offsetX,
      }
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
    setAvailability(option);
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
          {options.map(option => {
            return (
              <View style={{backgroundColor: option.color}} key={option.id}>
                <TouchableOpacity
                  onPress={() => {
                    onSelectOptionHandler(option);
                  }}
                  style={[styles.touchable, { backgroundColor: option.color }]}>
                  <Animated.View
                    style={[
                      styles.textWrapper,
                      { backgroundColor: option.color },
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
          {options.map(option => {
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
      <TouchableOpacity
        style={{
          borderRadius: 5,
          backgroundColor: availability.color,
          opacity: 0.9,
          width: 35,
          height: 35,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
        onPress={onOpenHandler}
        >
        <Icon
          name={availability.icon} // checkmark/help/close Colors: #4ce660/'#a9a9a9'/'#e84343
          size={30}
          color="black"
        />
      </TouchableOpacity>
      <Modal animationType="none" transparent={true} visible={showOptions}>
        <Pressable onPress={onCloseHandler} style={[styles.modalContainer]}>
          {renderOptions()}
        </Pressable>
      </Modal>
    </View>
  );
});

export default AvailabilityMenu;

const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
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
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%'
  }
});
