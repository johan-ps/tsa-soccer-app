import React, {
  useReducer,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { debounce } from 'lodash';

const INPUT_CHANGE = 'INPUT_CHANGE';

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
      };
    default:
      return state;
  }
};

const UiInput = props => {
  const theme = useSelector(state => state.theme.colors);
  const {
    placeholder,
    fontSize,
    icon,
    openOnFocus,
    closeOnBlur,
    disabled,
    onChangeText,
    contentType = 'none',
    bg = '#EAEAEA',
    color = '#000000',
    placeholderClr = '#C0C0CA',
    cursor = theme.cursor,
  } = props;
  const translateAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0);
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
    isValid: props.initiallyValid,
    touched: false,
  });
  const inputRef = useRef();
  const [showInput, setShowInput] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handler = useCallback(
    debounce(text => onChangeText(text), 250),
    [],
  );

  const inputHandler = text => {
    if (onChangeText) {
      handler(text);
    }
    dispatch({ type: INPUT_CHANGE, value: text, isValid: true });
  };

  const { onInputChange, id } = props;

  useEffect(() => {
    if (onInputChange) {
      onInputChange(id, inputState.value);
    }
  }, [inputState, onInputChange, id]);

  useEffect(() => {
    if (inputState.value !== '') {
      translateAnim.value = withTiming(1, { duration: 150 });
      scaleAnim.value = 1;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocus = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
    if (openOnFocus) {
      openOnFocus();
    }
    translateAnim.value = withTiming(1, { duration: 150 });
    scaleAnim.value = 1;
  };

  const onBlur = () => {
    if (closeOnBlur) {
      closeOnBlur();
    }
    if (!inputState.value || inputState.value.length === 0) {
      translateAnim.value = withTiming(0, { duration: 150 });
      scaleAnim.value = 0;
    }
  };

  const toggleShowInput = () => {
    setShowInput(!showInput);
  };

  const placeholderAnim = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(translateAnim.value, [0, 1], [0, -36]),
        },
        {
          translateY: interpolate(translateAnim.value, [0, 1], [0, -12]),
        },
        {
          scale: interpolate(translateAnim.value, [0, 1], [1, 0.8]),
        },
      ],
    };
  });

  const autoCompleteType = () => {
    if (contentType === 'none') {
      return 'off';
    } else {
      return contentType;
    }
  };

  return (
    <Pressable
      onPress={onFocus}
      style={[styles.inputContainer, props.style, { backgroundColor: bg }]}>
      <TextInput
        selectionColor={cursor}
        placeholderTextColor={placeholderClr}
        value={inputState.value}
        onChangeText={inputHandler}
        editable={!disabled}
        selectTextOnFocus={false}
        style={[
          styles.input,
          { fontSize, fontFamily: theme.fontRegular, color },
        ]}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={inputRef}
        textContentType={contentType}
        autoCompleteType={autoCompleteType()}
        secureTextEntry={contentType === 'password' && !showInput}
      />
      <Animated.Text style={[styles.placeholderContainer, placeholderAnim]}>
        <Animated.Text
          style={[
            styles.placeholder,
            { fontFamily: theme.fontRegular, color: placeholderClr },
          ]}>
          {placeholder}
        </Animated.Text>
      </Animated.Text>
      {icon ? (
        <TouchableOpacity
          onPress={toggleShowInput}
          style={styles.iconContainer}>
          <Icon
            color={placeholderClr}
            name={
              contentType === 'password' && !showInput
                ? icon.name
                : icon.altName
            }
            size={icon.size}
          />
        </TouchableOpacity>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
    height: 70,
    borderRadius: 8,
  },
  input: {
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 10,
    paddingTop: 30,
  },
  iconContainer: {
    position: 'absolute',
    right: 30,
    alignSelf: 'center',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  placeholderContainer: {
    width: '100%',
    height: 30,
    position: 'absolute',
    alignSelf: 'center',
    left: 30,
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 16,
  },
});

export default UiInput;
