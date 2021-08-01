import React, { useRef, useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const UiInput = props => {
  const { value, placeholder, onChangeText, borderTheme, fontSize, icon, openOnFocus, closeOnBlur, disabled } = props;
  const [shadow, setShadow] = useState(null);
  const [focus, setFocus] = useState(false);
  const focusAnimation = useRef(new Animated.Value(0)).current;
  const theme = useSelector(state => state.theme.colors);

  const onFocus = () => {
    setFocus(true);
    if(openOnFocus){
      openOnFocus();
    }
    borderLayout();
    Animated.timing(focusAnimation, {
      toValue: 1,
      duration: 225,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const onBlur = () => {
    setShadow(null);
    setFocus(false);
    if(closeOnBlur){
      closeOnBlur();
    }
    Animated.timing(focusAnimation, {
      toValue: 0,
      duration: 225,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const ifBorder = {
    borderBottomColor: '#A8A4B8',
    borderBottomWidth: 2,
    borderStyle: 'solid',
  };

  const ifCircle = {
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#A8A4B8',
    paddingHorizontal: 12,
    elevation: 2,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 2 },
  };

  const borderLayout = () => {
    if (borderTheme === 'circle') {
      setShadow({
        borderColor: theme.primaryIconClr,
        shadowColor: theme.primaryIconClr,
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
          height: 2,
        },
        elevation: 2,
      });
    } 
  };

  const underlineAnim = {
    transform: [
      {
        scaleX: focusAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  const renderUnderline = () => {
    if (borderTheme === 'underline') {
      return <Animated.View style={[styles.underline, underlineAnim]} />;
    } else {
      return null;
    }
  };

  const renderIcon = () => {
    if (icon) {
      return (
        <View style={styles.iconContainer}>
          <Icon color={focus ? '#e51b23' : '#A8A4B8'} name={icon} size={20} />
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View
      style={[
        styles.inputContainer,
        borderTheme === 'circle' ? ifCircle : ifBorder,
        borderTheme === 'circle' && focus ? shadow : {},
        props.style,
      ]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#A8A4B8"
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        selectTextOnFocus={false}
        style={[styles.input, { fontSize }]}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {renderIcon()}
      {renderUnderline()}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    position: 'relative',
  },
  input: {
    color: 'black',
    width: '100%',
  },
  underline: {
    position: 'absolute',
    bottom: -2,
    width: '100%',
    height: 2,
    backgroundColor: '#e51b23',
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
});

export default UiInput;
