import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  PanResponder,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import LottieView from 'lottie-react-native';

import {
  AnnouncementCard,
  NavHeader,
  AddButton,
  UiModal,
  ErrorScreen,
} from '../components/_components';
import * as announcementActions from '../store/actions/AnnouncementActions';
const loadingLottieAnim = require('../assets/img/soccer-anim.json');

const AnnouncementScreen = () => {
  const addBtnRef = useRef();
  const [offsetY, setOffsetY] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useSelector(state => state.theme.colors);
  const announcements = useSelector(state => state.announcements);
  const dispatch = useDispatch();

  const [isScrollTop, setIsScrollTop] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshHeight = useRef(new Animated.Value(0)).current;
  const pullHeight = 100;

  const loadingAnimRef = useRef();
  const loadingAnim = useRef(new Animated.Value(0)).current;

  const initPanResponder = useCallback(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (isRefreshing) {
          return true;
        }
        if (offsetY === 0 && !isRefreshing) {
          return gestureState.dy > 2;
        } else {
          return false;
        }
      },
      onPanResponderGrant: () => {},
      onPanResponderMove: (e, gestureState) => {
        if (!isRefreshing) {
          if (gestureState.dy >= 0 && offsetY === 0) {
            refreshHeight.setValue(gestureState.dy * 0.5);
            loadingAnim.setValue(((gestureState.dy * 0.5) % 100) / 100);
          }
        }
      },
      onPanResponderRelease: () => {
        if (refreshHeight._value > pullHeight) {
          loadingAnimRef.current.resume();
          setIsRefreshing(true);
          Animated.spring(refreshHeight, {
            toValue: pullHeight,
            duration: 100,
            useNativeDriver: true,
          }).start(() => {
            onRefreshHandler();
          });
        } else {
          Animated.spring(refreshHeight, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        if (refreshHeight._value > pullHeight) {
          loadingAnimRef.current.resume();
          setIsRefreshing(true);
          Animated.spring(refreshHeight, {
            toValue: pullHeight,
            duration: 100,
            useNativeDriver: true,
          }).start(() => {
            onRefreshHandler();
          });
        } else {
          Animated.spring(refreshHeight, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }
      },
      onStartShouldSetPanResponder: (e, gestureState) => {
        if (isRefreshing) {
          return true;
        }
        return false;
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrollTop, isRefreshing, refreshHeight]);

  const panResponder = initPanResponder();

  const onRefreshHandler = () => {
    setTimeout(() => {
      Animated.spring(refreshHeight, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
      setIsRefreshing(false);
    }, 500);
  };

  const loadAnnouncements = useCallback(() => {
    setRefreshing(true);
    dispatch(announcementActions.getAnnouncements());
    setRefreshing(false);
  }, [dispatch, setRefreshing]);

  useEffect(() => {
    loadAnnouncements();
  }, [dispatch, loadAnnouncements]);

  const onScrollHandler = event => {
    const prevOffsetY = offsetY;
    const curOffsetY = event.nativeEvent.contentOffset.y;
    if (Math.abs(curOffsetY - prevOffsetY) > 8) {
      if (curOffsetY < prevOffsetY) {
        addBtnRef.current.onScrollUp();
      } else {
        addBtnRef.current.onScrollDown();
      }
    } else if (curOffsetY === 0) {
      addBtnRef.current.onScrollUp();
    }
    setOffsetY(curOffsetY);
    if (curOffsetY === 0 && !isScrollTop) {
      setIsScrollTop(true);
    } else if (isScrollTop) {
      setIsScrollTop(false);
      refreshHeight.setValue(0);
    }
  };

  const onDeleteHandler = id => {
    setModalVisible(true);
  };

  const onModalCloseHandler = () => {
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryBg }]}>
      <NavHeader
        iconListRight={[{ name: 'filter-outline', id: 0 }]}
        searchable={true}
      />
      {announcements.length === 0 ? (
        <ErrorScreen error="NO_RESULTS" />
      ) : (
        <View>
          <LottieView
            ref={loadingAnimRef}
            progress={loadingAnim}
            style={styles.lottieView}
            source={loadingLottieAnim}
          />
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.panContainer,
              {
                transform: [{ translateY: refreshHeight }],
              },
            ]}>
            <FlatList
              style={[styles.flatList, { backgroundColor: theme.primaryBg }]}
              onScroll={onScrollHandler}
              data={announcements}
              keyExtractor={item => item.id.toString()}
              renderItem={itemData => {
                return (
                  <AnnouncementCard
                    onDelete={() => {
                      onDeleteHandler(itemData.id);
                    }}
                    announcementData={itemData.item}
                  />
                );
              }}
            />
          </Animated.View>
        </View>
      )}
      <AddButton ref={addBtnRef} />
      <UiModal
        primaryLabel="Confirm"
        secondaryLabel="Cancel"
        visible={modalVisible}
        title="Delete content"
        content={
          'Are you sure you want to remove this content? You can access this file for 7 days in your trash.'
        }
        onCloseHandler={onModalCloseHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingBottom: 70,
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
