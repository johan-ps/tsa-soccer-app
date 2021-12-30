import React, { forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { UiInput } from '../_components';

const NavHeader = forwardRef((props, ref) => {
  const theme = useSelector(state => state.theme.colors);

  const scrollAnimation = useSharedValue(0);
  const scrollDownAnimInit = useSharedValue(false); // has scroll down animation started

  // useImperativeHandle customizes the instance value that is exposed to parent components when using refs
  useImperativeHandle(ref, () => ({
    onScrollUp,
    onScrollDown,
  }));

  const onScrollUp = () => {
    if (scrollDownAnimInit.value) {
      scrollDownAnimInit.value = false;
      scrollAnimation.value = withTiming(0);
    }
  };

  const onScrollDown = () => {
    if (!scrollDownAnimInit.value) {
      scrollDownAnimInit.value = true;
      scrollAnimation.value = withTiming(1);
    }
  };

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: scrollAnimation.value * -150,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.primaryBg },
        animStyle,
      ]}>
      <View style={styles.headingContainer}>
        <Text
          style={[
            styles.heading,
            { fontFamily: theme.fontBold, color: theme.primaryText },
          ]}>
          Announcements
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.toggleFilter(true);
          }}
          style={styles.iconContainer}>
          <Icon name="filter-outline" color={theme.primaryText} size={20} />
        </TouchableOpacity>
      </View>
      <UiInput
        id="search"
        iconLeft="search"
        initialValue=""
        inputValidities={true}
        placeholder="Search"
        style={styles.marginBottom}
        onInputChange={() => {}}
        bg={theme.secondaryBg}
        color={theme.secondaryText}
        placeholderClr={theme.secondaryText}
        cursor={theme.cursor}
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    marginBottom: 15,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    width: '100%',
    height: 150,
    flexDirection: 'column',
    // elevation: 15,
    // shadowRadius: 2,
    // shadowColor: '#000000',
    // shadowOpacity: 0.3,
    // shadowOffset: { height: 2 },
    // zIndex: 0,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  iconContainer: {
    borderRadius: 50,
    height: 40,
    width: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NavHeader;
