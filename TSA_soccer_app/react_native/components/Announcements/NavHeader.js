import React, { forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const NavHeader = forwardRef((props, ref) => {
  const { iconListLeft = [], iconListRight = [], searchable = false } = props;
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
          translateY: scrollAnimation.value * -70,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.searchBg },
        animStyle,
      ]}>
      {/* <View style={styles.iconLeftContainer}>
        {iconListLeft.map(icon => {
          return (
            <TouchableOpacity key={icon.id} style={styles.iconContainer}>
              <Icon name={icon.name} color={theme.iconClr} size={20} />
            </TouchableOpacity>
          );
        })}
      </View> */}
      <View style={styles.iconRightContainer}>
        <Image
          style={{ height: 30, width: 30 }}
          source={require('../../assets/img/CTSA_Logo.png')}
        />
      </View>
      <View style={styles.center}>
        {searchable ? (
          <TextInput
            style={[
              styles.searchbar,
              {
                borderColor: theme.searchText,
                color: theme.searchText,
                backgroundColor: theme.searchInputBg,
                fontFamily: theme.fontRegular,
              },
            ]}
            placeholder="Search..."
            placeholderTextColor={theme.searchText}
          />
        ) : null}
        {searchable ? (
          <View style={styles.searchbarIcon}>
            <Icon name="search-outline" color={theme.searchText} size={20} />
          </View>
        ) : null}
      </View>
      <View style={styles.iconRightContainer}>
        {iconListRight.map(icon => {
          return (
            <TouchableOpacity
              onPress={props.toggleFilter}
              key={icon.id}
              style={styles.iconContainer}>
              <Icon name={icon.name} color={theme.searchText} size={20} />
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 15,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 2 },
    zIndex: 100,
  },
  iconLeftContainer: {
    height: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRightContainer: {
    height: '100%',
    padding: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 50,
    height: 40,
    width: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    width: '70%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  searchbar: {
    borderRadius: 60,
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: 20,
    paddingLeft: 40,
    ...Platform.select({
      ios: {
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 15,
        height: 40,
      },
    }),
  },
  searchbarIcon: {
    position: 'absolute',
    top: 9,
    left: 10,
  },
});

export default NavHeader;
