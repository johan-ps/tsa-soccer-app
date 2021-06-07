import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AddButton from '../components/AddButton';
import LabeledTextInput from '../components/LabeledTextInput';

const ScheduleScreen = () => {

  const [input, setInput] = useState("");
  const [input2, setInput2] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Schedule</Text>
      <LabeledTextInput
        value={input}
        placeholder="Enter text ..."
        onChangeText={text => setInput(text)}
        borderTheme={'underline'}>
      </LabeledTextInput>
      <LabeledTextInput
        value={input2}
        placeholder="Enter text ..."
        onChangeText={text => setInput2(text)}
        borderTheme={'circle'}>
      </LabeledTextInput>

      <AddButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    color: 'red'
  }
});

export default ScheduleScreen;
