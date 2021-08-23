import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AnimScrollView from '../components/AnimScrollView';

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
import UiBadge from '../components/UiComponents/UiBadge';

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
  const [showBadge, setShowBadge] = useState(false);

  const [createAnnouncement, setCreateAnnouncemnt] = useState(false);

  const loadAnnouncements = useCallback(async () => {
    try {
      await dispatch(announcementActions.getAnnouncements());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

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

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const deleteAnnouncement = () => {
    dispatch(announcementActions.deleteAnnouncement(deleteId));
    setDeleteId(null);
  };

  const onScrollUp = () => {
    if (addBtnRef && addBtnRef.current) {
      addBtnRef.current.onScrollUp();
    }
    if (searchBarRef && searchBarRef.current) {
      searchBarRef.current.onScrollUp();
    }
  };

  const onScrollDown = () => {
    if (addBtnRef && addBtnRef.current) {
      addBtnRef.current.onScrollDown();
    }
    if (searchBarRef && searchBarRef.current) {
      searchBarRef.current.onScrollDown();
    }
  };

  const loadFailHandler = () => {
    setShowBadge(true);
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
          <AnimScrollView
            backgroundColor={theme.primaryBg}
            onScrollUp={onScrollUp}
            onScrollDown={onScrollDown}
            loadFail={loadFailHandler}
            load={loadAnnouncements}>
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
          </AnimScrollView>
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
            title="Are you sure?"
            content={
              'Are you sure you want to delete this post? You can access this file for 7 days in your trash.'
            }
            onCloseHandler={onModalCloseHandler}
            primaryBtnHandler={deleteAnnouncement}
            icon="file-tray-full-outline"
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
      {showBadge && (
        <UiBadge
          msg="Failed to load announcements"
          onHide={() => {
            setShowBadge(false);
          }}
          time={1000}
        />
      )}
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
