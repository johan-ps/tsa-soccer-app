import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const UiTextArea = props => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textArea}
        underlineColorAndroid="transparent"
        placeholder="Enter Details"
        placeholderTextColor={'#9E9E9E'}
        numberOfLines={10}
        multiline={true}
      />
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
});

export default UiTextArea;
