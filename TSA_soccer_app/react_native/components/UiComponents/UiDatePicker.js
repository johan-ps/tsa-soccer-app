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
import ErrorMessage from './ErrorMessage';
import moment from 'moment';

const UiDatePicker = props => {
  const { placeholder, value, error } = props;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateAnim = useSharedValue(0);
  const theme = useSelector(state => state.theme.colors);

  const onToggleHandler = () => {
    if (!value) {
      if (props.onChange) {
        props.onChange(new Date());
      }
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
      height: interpolate(dateAnim.value, [0, 1], [58, 280]),
    };
  });

  const onDateChangeHandler = dateVal => {
    if (props.onChange) {
      console.log(dateVal);
      props.onChange(dateVal);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.secondaryBg },
        dateStyle,
      ]}>
      <TouchableOpacity onPress={onToggleHandler}>
        <View style={styles.innerContainer}>
          <Text
            style={[
              styles.placeholder,
              {
                color: !error ? theme.secondaryText : theme.error,
                fontFamily: theme.fontRegular,
              },
            ]}>
            {!value ? placeholder : moment.utc(value).format('MMMM D, YYYY')}
          </Text>
          <View style={styles.iconContainer}>
            <Icon
              color={!error ? theme.ddSClr : theme.error}
              name="calendar-outline"
              size={20}
            />
          </View>
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DatePicker
          modal
          date={new Date()}
          // onDateChange={onDateChangeHandler}
          mode="date"
          androidVariant="nativeAndroid"
          textColor={theme.primaryText}
          style={[styles.datePicker, { backgroundColor: theme.secondaryBg }]}
        />
      )}
      <ErrorMessage isValid={!error} errCode={error} />
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
