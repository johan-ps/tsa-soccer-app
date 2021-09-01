import React, { useState } from 'react';
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

const UiDatePicker = props => {
  const { placeholder, id } = props;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateAnim = useSharedValue(0);
  const theme = useSelector(state => state.theme.colors);
  const [date, setDate] = useState(new Date());

  const onToggleHandler = () => {
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
      height: interpolate(dateAnim.value, [0, 1], [58, 230]),
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
              { color: theme.secondaryText, fontFamily: theme.fontRegular },
            ]}>
            {placeholder}
          </Text>
          <View style={styles.iconContainer}>
            <Icon
              color={showDatePicker ? theme.ddSClr : '#A8A4B8'}
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
});

export default UiDatePicker;
