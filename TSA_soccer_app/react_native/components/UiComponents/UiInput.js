import React, { useRef, useState, useMemo } from 'react';
import { TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ErrorMessage from './ErrorMessage';

const UiInput = props => {
  const theme = useSelector(state => state.theme.colors);
  const {
    placeholder,
    fontSize = 15,
    icon,
    iconLeft,
    disabled,
    contentType = 'none',
    multiline = false,
    error,
    paddingRight,
    value,
  } = props;
  const inputRef = useRef();
  const [showInput, setShowInput] = useState(false);
  const focusAnimation = useSharedValue(0);

  const onFocusIn = () => {
    focusAnimation.value = withTiming(1, { duration: 40 });
  };

  const onFocusOut = () => {
    focusAnimation.value = withTiming(0, { duration: 40 });
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

  const onChangeTextHandler = val => {
    if (props.onChangeText) {
      props.onChangeText(val);
    }
  };

  const onBlurHandler = () => {
    if (props.onBlur) {
      props.onBlur();
    }
  };

  const onFocusHandler = () => {
    if (props.onFocus) {
      props.onFocus();
    }
  };

  const toggleShowInput = () => {
    setShowInput(!showInput);
  };

  const autoCompleteType = useMemo(() => {
    if (contentType === 'none') {
      return 'off';
    } else {
      return contentType;
    }
  }, [contentType]);

  const hideInput = useMemo(() => {
    return contentType === 'password' && !showInput;
  }, [contentType, showInput]);

  return (
    <Animated.View
      style={[
        styles.inputContainer,
        props.style,
        { backgroundColor: theme.secondaryBg },
        paddingRight ? { paddingRight } : {},
        scale,
      ]}>
      {iconLeft ? (
        <Icon
          style={styles.iconLeft}
          color={theme.secondaryText}
          name={iconLeft}
          size={26}
        />
      ) : null}
      <TextInput
        onPressIn={onFocusIn}
        onPressOut={onFocusOut}
        selectionColor={theme.cursor}
        placeholderTextColor={!error ? theme.secondaryText : theme.error}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeTextHandler}
        editable={!disabled}
        selectTextOnFocus={false}
        style={[
          styles.input,
          {
            fontSize,
            fontFamily: theme.fontMedium,
            color: !error ? theme.secondaryText : theme.error,
          },
          // eslint-disable-next-line react-native/no-inline-styles
          !multiline ? { paddingLeft: 60 } : {},
        ]}
        multiline={multiline}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        ref={inputRef}
        textContentType={contentType}
        autoCompleteType={autoCompleteType}
        secureTextEntry={hideInput}
      />
      {icon ? (
        <TouchableOpacity
          onPress={toggleShowInput}
          style={styles.iconContainer}>
          <Icon
            color={theme.secondaryText}
            name={
              contentType === 'password' && !showInput
                ? icon.name
                : icon.altName
            }
            size={icon.size}
          />
        </TouchableOpacity>
      ) : null}
      <ErrorMessage isValid={!error} errCode={error} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
    minHeight: 62,
    borderRadius: 16,
  },
  input: {
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    alignSelf: 'center',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  iconLeft: {
    position: 'absolute',
    left: 20,
    alignSelf: 'center',
  },
});

export default UiInput;
