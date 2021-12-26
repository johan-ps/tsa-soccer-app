import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AnimScrollView from '../components/AnimScrollView';

import {
  AnnouncementCard,
  NavHeader,
  AddButton,
  UiModal,
  ErrorScreen,
  UiFilterModal,
} from '../components/_components';
import * as announcementActions from '../store/actions/AnnouncementActions';
import UiBadge from '../components/UiComponents/UiBadge';
import { useFocusEffect } from '@react-navigation/native';
import * as tabbarActions from '../store/actions/TabbarActions';
import * as loaderActions from '../store/actions/LoaderActions';

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
  const [loaded, setLoaded] = useState(false);
  const [filters, setFilters] = useState(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [refreshEnabled, setRefreshEnabled] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onScrollHandler = ({ nativeEvent }) => {
    if (nativeEvent.contentOffset.y <= 0) {
      if (!refreshEnabled) {
        setRefreshEnabled(true);
      }
    } else {
      if (refreshEnabled) {
        setRefreshEnabled(false);
      }
    }
  };

  const loadAnnouncements = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (!loaded) {
        dispatch(loaderActions.updateLoader(true));
      }
      if (filters) {
        await dispatch(announcementActions.getFilteredAnnouncements(filters));
      } else {
        await dispatch(announcementActions.getAnnouncements());
      }
    } catch (err) {
      console.log('error<1>', err);
    } finally {
      if (!loaded) {
        dispatch(loaderActions.updateLoader(false));
      }
      setLoaded(true);
    }
    setIsRefreshing(false);
  }, [dispatch, filters, loaded]);

  useEffect(() => {
    setIsLoading(true);
    loadAnnouncements().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadAnnouncements]);

  useFocusEffect(() => {
    dispatch(tabbarActions.updateVisibility(true));
  });

  const onDeleteHandler = id => {
    setDeleteId(id);
    setModalVisible(true);
  };

  const onModalCloseHandler = () => {
    setModalVisible(false);
  };

  const toggleFilter = visible => {
    setFilterVisible(visible);
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

  const outerScrollHandler = disabled => {
    // console.log('outer disabled', disabled)
    // setScrollEnabled(disabled);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.secondaryBg }]}>
      <StatusBar
        barStyle={activeTheme === 'default' ? 'dark-content' : 'light-content'}
      />
      {Platform.OS === 'ios' ? (
        <View
          style={[
            styles.notchOffsetContainer,
            { backgroundColor: theme.primaryBg },
          ]}
        />
      ) : null}
      <SafeAreaView style={announcements.length === 0 ? styles.container : {}}>
        <NavHeader ref={searchBarRef} toggleFilter={toggleFilter} />
        {announcements.length === 0 ? (
          <ErrorScreen error="NO_RESULTS" onRefresh={loadAnnouncements} />
        ) : (
          <FlatList
            onRefresh={loadAnnouncements}
            refreshing={isRefreshing}
            data={announcements}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              return (
                <AnnouncementCard
                  key={item.id}
                  onDelete={() => {
                    onDeleteHandler(item.id);
                  }}
                  announcementData={item}
                />
              );
            }}
          />
          // <AnimScrollView
          //   backgroundColor={theme.secondaryBg}
          //   onScrollUp={onScrollUp}
          //   // enabled={refreshEnabled}
          //   // onlyPullToRefresh={true}
          //   onScrollDown={onScrollDown}
          //   setScrollEnabled={outerScrollHandler}
          //   loadFail={loadFailHandler}
          //   load={loadAnnouncements}>
          /* // <FlatList
            //   onScroll={onScrollHandler}
            //   scrollEnabled={scrollEnabled}
            //   data={announcements}
            //   keyExtractor={item => item.id}
            //   renderItem={({ item }) => {
            //     return (
            //       <AnnouncementCard
            //         key={item.id}
            //         onDelete={() => {
            //           onDeleteHandler(item.id);
            //         }}
            //         announcementData={item}
            //       />
            //     );
            //   }}
            // /> */
          /* <View>
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
            </View> */
          /* </AnimScrollView> */
        )}
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
          secondaryLabel="Reset"
          visible={filterVisible}
          title="Filter Announcements"
          onCloseHandler={toggleFilter}
          onUpdateFilter={setFilters}
        />
      </SafeAreaView>
      {userData && userData.accessLevel > 0 ? (
        <AddButton
          ref={addBtnRef}
          onPress={() => {
            navigation.navigate('ModifyAnnouncement');
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
