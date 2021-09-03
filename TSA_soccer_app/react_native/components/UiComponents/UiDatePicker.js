import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { useSelector } from 'react-redux';
import ErrorMessage from './ErrorMessage';

const UiDatePicker = props => {
  const {
    placeholder,
    id,
    height = 230,
    existingDate,
    isValid,
    errCode,
  } = props;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateAnim = useSharedValue(0);
  const theme = useSelector(state => state.theme.colors);
  const [date, setDate] = useState(existingDate || new Date());
  const [isInit, setIsInit] = useState(!!existingDate);

  const onToggleHandler = () => {
    if (!isInit) {
      if (props.onChange) {
        props.onChange(id, new Date());
      }
      setIsInit(true);
    }
    if (showDatePicker) {
      dateAnim.value = withTiming(0);
      setShowDatePicker(false);
    } else {
      dateAnim.value = withTiming(1, {}, () => {
        runOnJS(setShowDatePicker)(true);
      });
    }
  };

  const dateStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(dateAnim.value, [0, 1], [58, height]),
    };
  });

  const onDateChangeHandler = dateVal => {
    setDate(dateVal);
    if (props.onChange) {
      props.onChange(id, dateVal);
    }
  };

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: theme.ddBgClr }, dateStyle]}>
      <TouchableOpacity onPress={onToggleHandler}>
        <View style={styles.innerContainer}>
          <Text
            style={[
              styles.placeholder,
              {
                color: isValid ? theme.secondaryText : theme.error,
                fontFamily: theme.fontRegular,
              },
            ]}>
            {placeholder}
          </Text>
          <View style={styles.iconContainer}>
            <Icon
              color={isValid ? theme.ddSClr : theme.error}
              name="calendar-outline"
              size={20}
            />
          </View>
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DatePicker
          date={date}
          onDateChange={onDateChangeHandler}
          mode="date"
          androidVariant="nativeAndroid"
          textColor={theme.primaryText}
          style={[styles.datePicker, { backgroundColor: theme.ddBgClr }]}
        />
      )}
      <ErrorMessage isValid={isValid} errCode={errCode} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
  },
  innerContainer: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {},
  datePicker: {
    width: '100%',
  },
  placeholder: {
    fontSize: 16,
  },
});

export default UiDatePicker;
