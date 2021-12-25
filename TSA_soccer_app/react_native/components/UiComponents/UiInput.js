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
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { debounce } from 'lodash';
import ErrorMessage from './ErrorMessage';

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
    iconLeft,
    openOnFocus,
    closeOnBlur,
    disabled,
    onChangeText,
    contentType = 'none',
    bg = '#EAEAEA',
    color = '#000000',
    placeholderClr = '#C0C0CA',
    cursor = theme.cursor,
    multiline = false,
    errCode,
    isValid = true,
  } = props;
  const translateAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0);
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
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
    dispatch({ type: INPUT_CHANGE, value: text });
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
      style={[
        styles.inputContainer,
        props.style,
        { backgroundColor: '#F3F4F6' },
      ]}>
      {iconLeft ? (
        <Icon
          style={styles.iconLeft}
          color="#8A8FA9"
          name={iconLeft}
          size={26}
        />
      ) : null}
      <TextInput
        selectionColor={cursor}
        placeholderTextColor="#8A8FA9"
        placeholder={placeholder}
        value={inputState.value}
        onChangeText={inputHandler}
        editable={!disabled}
        selectTextOnFocus={false}
        style={[
          styles.input,
          { fontSize: 15, fontFamily: 'Mark Pro Medium', color: '#8A8FA9' },
          // eslint-disable-next-line react-native/no-inline-styles
          multiline ? { paddingTop: 40 } : {},
        ]}
        multiline={multiline}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={inputRef}
        textContentType={contentType}
        autoCompleteType={autoCompleteType()}
        secureTextEntry={contentType === 'password' && !showInput}
      />
      {icon ? (
        <TouchableOpacity
          onPress={toggleShowInput}
          style={styles.iconContainer}>
          <Icon
            color="#8A8FA9"
            name={
              contentType === 'password' && !showInput
                ? icon.name
                : icon.altName
            }
            size={icon.size}
          />
        </TouchableOpacity>
      ) : null}
      <ErrorMessage isValid={isValid} errCode={errCode} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
    minHeight: 62,
    height: 62,
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
    paddingLeft: 60,
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
