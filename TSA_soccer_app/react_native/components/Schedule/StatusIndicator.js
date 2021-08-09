import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const StatusIndicator = props => {
  const { label, icon, color } = props;

  const onPressHandler = () => {
    if (props.onPress) {
      props.onPress();
    }
  };

  return (
    <Pressable
      onPress={onPressHandler}
      style={[
        styles.container,
        { borderColor: color, backgroundColor: color + '07' },
      ]}>
      {icon ? <Icon name={icon} color={color} size={16} /> : null}
      <Text style={[styles.status, icon ? { marginLeft: 5 } : {}]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'green',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  status: {
    fontFamily: 'Roboto-Regular',
  },
});

export default StatusIndicator;
