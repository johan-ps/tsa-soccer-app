import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  memo,
  useState,
} from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { UiInput } from '../_components';
import * as announcementActions from '../../store/actions/AnnouncementActions';
import LottieView from 'lottie-react-native';

const loadingLottieAnim = require('../../assets/img/search-loader.json');

const NavHeader = forwardRef((props, ref) => {
  const theme = useSelector(state => state.theme.colors);
  const dispatch = useDispatch();
  const scrollAnimation = useSharedValue(0);
  const scrollDownAnimInit = useSharedValue(false); // has scroll down animation started
  const [loading, setLoading] = useState(false);

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

  const onChangeHandler = async (inputId, inputValue) => {
    try {
      dispatch(announcementActions.searchAnnouncements(inputValue));
      // setLoading(true);
      // if (inputValue && inputValue.length > 2) {
      //   dispatch(announcementActions.searchAnnouncements(inputValue));
      // } else {
      //   dispatch(announcementActions.getAnnouncements());
      // }
      // dispatch(announcementActions.searchAnnouncements(inputValue));
      // setLoading(false);
    } catch (err) {
      console.log('err: ', err);
    }
  };

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
        paddingRight={30}
        onInputChange={onChangeHandler}
        bg={theme.secondaryBg}
        color={theme.secondaryText}
        placeholderClr={theme.secondaryText}
        cursor={theme.cursor}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <LottieView
            style={styles.lottieView}
            autoPlay={true}
            source={loadingLottieAnim}
          />
        </View>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 30,
    top: 85,
  },
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
    paddingHorizontal: 15,
    paddingVertical: 15,
    position: 'relative',
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

export default memo(NavHeader);
