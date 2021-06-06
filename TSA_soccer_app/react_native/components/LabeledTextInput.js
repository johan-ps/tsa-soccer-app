import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, View, Animated, Easing, Pressable } from 'react-native';
import { useSelector } from 'react-redux';

const LabeledTextInput = props => {

  const { value, placeholder, onChangeText, borderTheme } = props;
  const [shadow, setShadow] = useState(null);
  const theme = useSelector(state => state.theme.colors);

  const ifBorder = {
      borderRadius: 5,
      borderWidth: 0.5,
      borderColor: '#d9d9d9',
  }

  const ifCircle = {
      borderRadius: 5
  }

  borderLayout = () => {
    if(borderTheme === 'circle'){
      setShadow({
        borderColor: theme.primaryIconClr,
        shadowColor: theme.primaryIconClr,
        shadowOpacity: 0.6,
        shadowRadius: 2,
        shadowOffset: {
          height: 0.5
        }
      })
    } else if (borderTheme === 'underline') {
      setShadow({
        borderBottomWidth: 0.9,
        borderBottomColor: theme.primaryIconClr,
      })
    }
  }

  return (
    <View
      style={[styles.inputContainer, borderTheme === 'circle' ? ifBorder : null, shadow]}
      elevation={5}
    >
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, borderTheme === 'circle' ? ifCircle : null]}
        onFocus={borderLayout}
        onBlur={() => setShadow(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    inputContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'row',
      margin:2
    },
    input: {
      fontSize: 14,
      color: 'black',
      height: 30,
      width: 200,
      alignItems: 'center',
      padding: 5,
      backgroundColor: '#ffffff',
    }
});

export default LabeledTextInput;
