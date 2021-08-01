import React, { useReducer, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

const INPUT_CHANGE = 'INPUT_CHANGE';

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    default:
      return state;
  }
};

const UiTextArea = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
    isValid: props.initiallyValid,
    touched: false,
  });

  const inputHandler = text => {
    dispatch({ type: INPUT_CHANGE, value: text, isValid: true });
  };

  const { onInputChange, id } = props;

  useEffect(() => {
    if (onInputChange) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  return (
    <View>
      {/* <Text style={styles.textTitle}>{props.label}</Text> */}
      <View style={[styles.container], props.style}>
        <TextInput
          style={styles.textArea}
          underlineColorAndroid="transparent"
          placeholder={props.placeholder || "Enter Details"}
          placeholderTextColor={'#9E9E9E'}
          numberOfLines={10}
          multiline={true}
          value={inputState.value}
          onChangeText={inputHandler}
        />
      </View>
      {!inputState.isValid && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

let styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid',
    borderRadius: 20,
    padding: 10,
  },
  textArea: {
    justifyContent: 'flex-start',
    height: 150,
    textAlignVertical: 'top',
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    fontFamily: 'Roboto-Regular',
    color: 'red',
    fontSize: 13,
  },
  textTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    marginVertical: 8,
  },
});

export default UiTextArea;
