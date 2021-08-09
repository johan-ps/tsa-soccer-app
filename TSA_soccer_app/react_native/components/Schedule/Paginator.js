import React, { useState, useRef } from 'react';
import { StyleSheet, View, useWindowDimensions, Animated } from 'react-native';
import { Easing } from 'react-native-reanimated';

const Paginator = props => {
  const { data, scrollX, currentIndex } = props;
  const { width } = useWindowDimensions();

  return (
    <View style={{ flexDirection: 'row', height: 30 }}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[
              styles.dot,
              {
                width: dotWidth,
                backgroundColor: currentIndex === i ? 'red' : '#A9A9A9',
              },
            ]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
});

export default Paginator;
