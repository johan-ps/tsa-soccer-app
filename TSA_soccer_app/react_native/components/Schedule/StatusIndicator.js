import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const StatusIndicator = props => {
  const { label, icon, size = 'large' } = props;
  const theme = useSelector(state => state.theme.colors);

  const primaryClr = useMemo(() => {
    let color;
    if (label === 'Going') {
      color = '#4ce660';
    } else if (label === 'Unavailable') {
      color = '#e84343';
    } else {
      color = '#a9a9a9';
    }

    return color;
  }, [label]);

  const containerStyle = useMemo(() => {
    let color = primaryClr;

    if (theme.name === 'dark') {
      return {
        backgroundColor: color,
        borderColor: color,
      };
    } else {
      return {
        backgroundColor: color + '07',
        borderColor: color,
      };
    }
  }, [primaryClr, theme]);

  const contentClr = useMemo(() => {
    if (theme.name === 'dark') {
      return '#414141';
    } else {
      return primaryClr;
    }
  }, [primaryClr, theme]);

  const onPressHandler = () => {
    if (props.onPress) {
      props.onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={onPressHandler}
      style={[
        styles.container,
        size === 'small' ? styles.smallContainer : {},
        containerStyle,
      ]}>
      {icon ? <Icon name={icon} color={contentClr} size={16} /> : null}
      {size === 'large' ? (
        <Text
          style={[
            styles.status,
            { color: contentClr, fontFamily: theme.fontRegular },
            icon ? styles.marginLeft : {},
          ]}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  smallContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 40,
  },
  status: {
    fontFamily: 'Roboto-Regular',
  },
  marginLeft: {
    marginLeft: 5,
  },
});

export default StatusIndicator;
