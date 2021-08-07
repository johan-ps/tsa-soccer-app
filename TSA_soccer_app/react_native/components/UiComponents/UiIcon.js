import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const UiIcon = props => {
  let {
    icon,
    size = 30,
    color = 'white',
    backgroundColor = 'black',
    type,
    shadow = false,
  } = props;

  const computeBorderRadius = () => {
    if (type === 'square') {
      return 0;
    } else if (type === 'round') {
      return 50;
    } else {
      return 16;
    }
  };

  const shadowStyle = {
    elevation: 20,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 },
  };

  return (
    <View
      style={[
        styles.chatboxContainer,
        {
          backgroundColor,
          borderRadius: computeBorderRadius(),
          width: size * 2 + 10,
          height: size * 2 + 10,
        },
        shadow ? shadowStyle : {},
      ]}>
      <Icon name={icon} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  chatboxContainer: {
    height: 60,
    width: 60,
    backgroundColor: '#A9A9A9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
});

export default UiIcon;
