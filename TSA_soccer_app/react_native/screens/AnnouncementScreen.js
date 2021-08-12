import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
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

import {
  AnnouncementCard,
  NavHeader,
  AddButton,
  UiModal,
  ErrorScreen,
  CreateAnnouncement,
  UiFilterModal,
} from '../components/_components';
import * as announcementActions from '../store/actions/AnnouncementActions';
const loadingLottieAnim = require('../assets/img/soccer-anim.json');
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const windowHeight = Dimensions.get('window').height;
const statusBarHeight = StatusBar.currentHeight;

const AnnouncementScreen = ({ navigation }) => {
  const addBtnRef = useRef();
  const searchBarRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const theme = useSelector(state => state.theme.colors);
  const activeTheme = useSelector(state => state.theme.activeTheme);
  const announcements = useSelector(state => state.announcements);
  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();

  const [scrollUpperBound, setScrollUpperBound] = useState(0);
  const [createAnnouncement, setCreateAnnouncemnt] = useState(false);

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
    if (addBtnRef.current && searchBarRef.current) {
      if (
        translateY.value < 0 &&
        Math.abs(translateY.value - offsetY.value) > 8
      ) {
        if (offsetY.value < translateY.value) {
          runOnJS(addBtnRef.current.onScrollUp)();
          runOnJS(searchBarRef.current.onScrollUp)();
        } else {
          runOnJS(addBtnRef.current.onScrollDown)();
          runOnJS(searchBarRef.current.onScrollDown)();
        }
      } else if (translateY.value === 0) {
        runOnJS(addBtnRef.current.onScrollUp)();
      } else if (translateY.value >= -70 && translateY.value <= 0) {
        runOnJS(searchBarRef.current.onScrollUp)();
      }
    }
    offsetY.value = translateY.value;
  });

  const loadAnnouncements = useCallback(async () => {
    try {
      ReactNativeHapticFeedback.trigger(
        Platform.OS === 'ios' ? 'impactLight' : 'clockTick',
        options,
      );
      await dispatch(announcementActions.getAnnouncements());
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
  }, [dispatch]);

  useDerivedValue(() => {
    if (refreshing.value) {
      runOnJS(loadAnnouncements)();
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

  useEffect(() => {
    loadAnnouncements();
  }, [dispatch, loadAnnouncements]);

  const onDeleteHandler = id => {
    setDeleteId(id);
    setModalVisible(true);
  };

  const onModalCloseHandler = () => {
    setModalVisible(false);
  };

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

      if (addBtnRef.current && searchBarRef.current) {
        addBtnRef.current.onScrollUp();
        searchBarRef.current.onScrollUp();
      }
    }
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const deleteAnnouncement = () => {
    dispatch(announcementActions.deleteAnnouncement(deleteId));
    setDeleteId(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.searchBg }]}>
      <StatusBar
        barStyle={activeTheme === 'default' ? 'dark-content' : 'light-content'}
      />
      {Platform.OS === 'ios' ? (
        <View
          style={[
            styles.notchOffsetContainer,
            { backgroundColor: theme.searchBg },
          ]}
        />
      ) : null}
      <SafeAreaView style={announcements.length === 0 ? styles.container : {}}>
        <NavHeader
          ref={searchBarRef}
          iconListRight={[{ name: 'filter-outline', id: 0 }]}
          searchable={true}
          toggleFilter={toggleFilter}
        />
        {announcements.length === 0 ? (
          <ErrorScreen error="NO_RESULTS" onRefresh={loadAnnouncements} />
        ) : (
          <SafeAreaView>
            <View onLayout={onLayoutHandler}>
              <LottieView
                style={styles.lottieView}
                autoPlay={true}
                source={loadingLottieAnim}
              />
              <SafeAreaView>
                <PanGestureHandler onGestureEvent={panGestureEvent}>
                  <Animated.View
                    style={[
                      reanimatedStyle,
                      { backgroundColor: theme.primaryBg },
                    ]}>
                    <View>
                      {announcements.map(announcement => {
                        return (
                          <AnnouncementCard
                            key={announcement.id}
                            onDelete={() => {
                              onDeleteHandler(announcement.id);
                            }}
                            image={announcement.imageUrl}
                            announcementData={announcement}
                          />
                        );
                      })}
                    </View>
                  </Animated.View>
                </PanGestureHandler>
              </SafeAreaView>
            </View>
          </SafeAreaView>
        )}
        {userData && userData.accessLevel > 0 ? (
          <CreateAnnouncement
            visible={createAnnouncement}
            onClose={() => {
              setCreateAnnouncemnt(false);
            }}
          />
        ) : null}
        {userData && userData.accessLevel > 0 ? (
          <UiModal
            primaryLabel="Confirm"
            secondaryLabel="Cancel"
            visible={modalVisible}
            title="Delete content"
            content={
              'Are you sure you want to remove this content? You can access this file for 7 days in your trash.'
            }
            onCloseHandler={onModalCloseHandler}
            primaryBtnHandler={deleteAnnouncement}
          />
        ) : null}

        <UiFilterModal
          primaryLabel="Apply"
          secondaryLabel="Cancel"
          visible={filterVisible}
          title="Filter Announcements"
          onCloseHandler={toggleFilter}
        />
      </SafeAreaView>
      {userData && userData.accessLevel > 0 ? (
        <AddButton
          ref={addBtnRef}
          onPress={() => {
            setCreateAnnouncemnt(true);
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  notchOffsetContainer: {
    height: 50,
    zIndex: 100,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  panContainer: {
    width: '100%',
    height: '100%',
  },
  lottieView: {
    height: 100,
    width: '100%',
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
  },
});

export default AnnouncementScreen;
