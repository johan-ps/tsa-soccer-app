import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDecay,
  useAnimatedGestureHandler,
  runOnJS,
  useDerivedValue,
  cancelAnimation,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const windowHeight = Dimensions.get('window').height;
const statusBarHeight = StatusBar.currentHeight;

const AnimScrollView = props => {
  const {
    customScrollHeight = 70,
    load,
    backgroundColor = 'white',
    onlyPullToRefresh = false,
    enabled = true,
    loadingLottieAnim = require('../assets/img/soccer-anim.json'),
  } = props;

  const [scrollUpperBound, setScrollUpperBound] = useState(0);

  const refreshing = useSharedValue(false);
  const offsetY = useSharedValue(0);

  const translateY = useSharedValue(0);
  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      marginBottom: 90,
    };
  }, []);
  const refreshBound = 90;

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: true,
  };

  useDerivedValue(() => {
    if (props.onScrollDown && props.onScrollUp) {
      if (
        translateY.value < 0 &&
        Math.abs(translateY.value - offsetY.value) > 8
      ) {
        if (offsetY.value < translateY.value) {
          runOnJS(props.onScrollUp)();
        } else {
          runOnJS(props.onScrollDown)();
        }
      } else if (translateY.value === 0) {
        runOnJS(props.onScrollUp)();
      } else if (
        translateY.value >= -customScrollHeight &&
        translateY.value <= 0
      ) {
        runOnJS(props.onScrollUp)();
      }
    }
    offsetY.value = translateY.value;
  });

  const loadData = useCallback(async () => {
    try {
      ReactNativeHapticFeedback.trigger(
        Platform.OS === 'ios' ? 'impactLight' : 'clockTick',
        options,
      );
      if (load) {
        await load();
      }
      translateY.value = withSpring(
        0,
        {
          damping: 100,
          mass: 10,
          stiffness: 1000,
          overshootClamping: true,
          restDisplacementThreshold: 0,
          restSpeedThreshold: 0,
        },
        () => {
          refreshing.value = false;
        },
      );
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  useDerivedValue(() => {
    if (refreshing.value) {
      runOnJS(loadData)();
    }
  });

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      if (refreshing.value) {
        return;
      } else if (translateY.value <= 0) {
        cancelAnimation(translateY);
      }
      context.translateY = translateY.value;
      context.max = 0;
    },
    onActive: (event, context) => {
      if (refreshing.value || context.translateY > 0) {
        return;
      }
      let ty = event.translationY + context.translateY;
      if (ty > 8) {
        let friction = Math.pow(1 - Math.min(ty / 3000, 1), 2) * 0.6;
        translateY.value = ty * friction;
      } else {
        translateY.value = ty;
      }

      if (
        (Math.abs(translateY.value) > scrollUpperBound &&
          scrollUpperBound !== 0) ||
        (scrollUpperBound === 0 && translateY.value < 0)
      ) {
        translateY.value = -scrollUpperBound;
      }
    },
    onEnd: (event, context) => {
      if (refreshing.value) {
        return;
      }
      if (context.translateY === 0 && event.translationY > 0) {
        if (event.translationY > refreshBound) {
          translateY.value = withSpring(
            refreshBound,
            {
              damping: 100,
              mass: 10,
              stiffness: 1000,
              overshootClamping: true,
              restDisplacementThreshold: 0,
              restSpeedThreshold: 0,
            },
            () => {
              refreshing.value = true;
            },
          );
        } else {
          translateY.value = withSpring(0, {
            damping: 100,
            mass: 10,
            stiffness: 1000,
            overshootClamping: true,
            restDisplacementThreshold: 0,
            restSpeedThreshold: 0,
          });
        }
      } else {
        translateY.value = withDecay({
          velocity: event.velocityY,
          clamp: [-scrollUpperBound, 0],
        });
      }
    },
  });

  const onLayoutHandler = ({
    nativeEvent: {
      layout: { height },
    },
  }) => {
    if (height > windowHeight) {
      let containerHeight = height - windowHeight + 56 + statusBarHeight;
      if (Math.abs(translateY.value) > containerHeight) {
        translateY.value = -containerHeight;
      }
      setScrollUpperBound(containerHeight);
    } else {
      translateY.value = 0;
      setScrollUpperBound(0);
      // runOnJS(props.onScrollUp)();
    }
  };
  return (
    <SafeAreaView>
      <View onLayout={onLayoutHandler}>
        <LottieView
          style={styles.lottieView}
          autoPlay={true}
          source={loadingLottieAnim}
        />
        <SafeAreaView>
          <PanGestureHandler
            enabled={enabled}
            onGestureEvent={panGestureEvent}
            activeOffsetY={onlyPullToRefresh ? [-1000, 5] : undefined}>
            <Animated.View style={[reanimatedStyle, { backgroundColor }]}>
              {props.children}
            </Animated.View>
          </PanGestureHandler>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  lottieView: {
    height: 100,
    width: '100%',
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
  },
});

export default AnimScrollView;
