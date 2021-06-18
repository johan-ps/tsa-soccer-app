import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  PanResponder,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import {
  AnnouncementCard,
  NavHeader,
  AddButton,
  UiModal,
  ErrorScreen,
} from '../components/_components';
import * as announcementActions from '../store/actions/AnnouncementActions';

const AnnouncementScreen = () => {
  const addBtnRef = useRef();
  const [offsetY, setOffsetY] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useSelector(state => state.theme.colors);
  const announcements = useSelector(state => state.announcements);
  const dispatch = useDispatch();

  const [isScrollFree, setIsScrollFree] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshHeight = useRef(new Animated.Value(0)).current;
  const pullHeight = 60;

  const scrollComponentRef = useRef();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (e, gestureState) => {
        if (!isRefreshing) {
          if (gestureState.dy >= 0 && offsetY === 0) {
            if (gestureState.dy * 0.5 >= pullHeight) {
            } else {
              refreshHeight.setValue(gestureState.dy * 0.5);
            }
          } else {
            // console.log(scrollComponentRef.current)
            // scrollComponentRef.current.scrollTo({
            //   y: gestureState.dy,
            //   animated: true,
            // });
          }
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(refreshHeight, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const isScrolledToTop = () => {
    if (offsetY === 0 && isScrollFree) {
      setIsScrollFree(false);
    }
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
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            transform: [{ translateY: refreshHeight }],
          }}>
          <FlatList
            ref={scrollComponentRef}
            style={styles.flatList}
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
  },
  body: {},
});

export default AnnouncementScreen;
