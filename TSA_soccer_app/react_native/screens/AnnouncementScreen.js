import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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
  const theme = useSelector(state => state.theme.colors);
  const announcements = useSelector(state => state.announcements);
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(announcementActions.getAnnouncements());
  }, [dispatch, announcements]);

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
        <ScrollView style={styles.body} onScroll={onScrollHandler}>
          {announcements.map(announcement => {
            return (
              <AnnouncementCard
                key={announcement.id}
                onDelete={onDeleteHandler(announcement.id)}
                image={announcement.imageUrl}
              />
            );
          })}
          {/* <AnnouncementCard
            onDelete={onDeleteHandler}
            image="https://th.bing.com/th/id/Red4f2866d59316ec64f269b0813412c5?rik=zdwSc4unAQCGKQ&pid=ImgRaw"
          />
          <AnnouncementCard image="https://images.unsplash.com/photo-1511798616182-aab3698ac53e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=583&q=80" />
          <AnnouncementCard />
          <AnnouncementCard image="https://images.unsplash.com/photo-1615458318132-1f151a3d18f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=334&q=80" /> */}
        </ScrollView>
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
