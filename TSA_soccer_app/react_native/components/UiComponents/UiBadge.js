import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const UiBadge = props => {
  const { time = 1000 } = props;
  const theme = useSelector(state => state.theme.colors);
  const badgeAnim = useSharedValue(0);

  useEffect(() => {
    badgeAnim.value = withTiming(1);
    setTimeout(() => {
      badgeAnim.value = withTiming(1);
      if (props.onHide) {
        props.onHide();
      }
    }, time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const badgeStyle = useAnimatedStyle(() => {
    return {
      opacity: badgeAnim.value,
      transform: [
        {
          translateY: interpolate(badgeAnim.value, [0, 1], [-10, 0]),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.secondaryBg },
        badgeStyle,
      ]}>
      <Text
        style={[
          styles.msg,
          { color: theme.primaryText, fontFamily: theme.fontRegular },
        ]}>
        {props.msg}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: 'hidden',
    position: 'absolute',
    top: 155,
    alignSelf: 'center',
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 },
    shadowColor: '#000000',
    zIndex: 200,
    padding: 10,
    paddingHorizontal: 20,
  },
  msg: {
    fontSize: 16,
  },
});

export default UiBadge;
