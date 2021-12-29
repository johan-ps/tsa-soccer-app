import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AnimScrollView from '../components/AnimScrollView';
import fetch_blob from 'rn-fetch-blob';
import PushNotification from 'react-native-push-notification';
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
import { getImageUrl } from '../api/announcements';
import ScrollTop from '../components/UiComponents/UiScrollTop';

const AnnouncementScreen = ({ navigation }) => {
  const addBtnRef = useRef();
  const searchBarRef = useRef();
  const scrollTopRef = useRef();
  const flatlistRef = useRef();
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

  const [offsetY, setOffsetY] = useState(0);

  const onScrollHandler = event => {
    // console.log(nativeEvent)
    const prevOffsetY = offsetY;
    const curOffsetY = event.nativeEvent.contentOffset.y;
    if (Math.abs(curOffsetY - prevOffsetY) > 8) {
      if (curOffsetY < prevOffsetY) {
        addBtnRef.current.onShow();
      } else {
        addBtnRef.current.onHide();
      }
    } else if (curOffsetY === 0) {
      addBtnRef.current.onShow();
    }

    if (curOffsetY > 200) {
      scrollTopRef.current.onShow();
    } else {
      scrollTopRef.current.onHide();
    }

    setOffsetY(curOffsetY);
    // if (nativeEvent.contentOffset.y) {

    // }
    // if (nativeEvent.contentOffset.y <= 0) {
    //   if (!refreshEnabled) {
    //     setRefreshEnabled(true);
    //   }
    // } else {
    //   if (refreshEnabled) {
    //     setRefreshEnabled(false);
    //   }
    // }
  };

  const onScrollToTop = () => {
    flatlistRef.current.scrollToOffset({ animated: true, y: 0 });
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

  const onEditHandler = item => {
    navigation.navigate('ModifyAnnouncement', {
      isEdit: true,
      announcementData: item,
    });
  };

  const onDeleteHandler = id => {
    setDeleteId(id);
    setModalVisible(true);
  };

  const onDownloadHandler = ({ id, image }) => {
    checkPermision(id, image)
      .then(() => {
        'done';
      })
      .catch(err => {
        console.log(err);
      });
  };

  const checkPermision = async (id, image) => {
    if (Platform.OS === 'ios') {
      downloadImage(id, image);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission Granted');
          downloadImage(id, image);
        } else {
          console.log('Storage permission not Granted');
        }
      } catch (error) {
        console.log('errro', error);
      }
    }
  };

  const downloadImage = (id, image) => {
    const date = new Date();
    const { fs } = fetch_blob;
    const dirs = fetch_blob.fs.dirs;
    const PictureDir = fs.dirs.PictureDir + '/CTSA';
    const type = image.substring(
      'data:image/'.length,
      image.indexOf(';base64'),
    );

    const fileName = `image_${Math.floor(
      date.getTime() + date.getSeconds() / 2,
    )}.${type}`;

    const path = PictureDir + '/' + fileName;
    const options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Download Complete',
        mime: `image/${type}`,
      },
    };

    fetch_blob
      .config(options)
      .fetch('GET', getImageUrl(id))
      .then(res => {
        console.log('download successfully');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleNotification = () => {
    PushNotification.localNotification({
      channelId: 'test-channel',
      title: 'Download Image',
      message: 'The image has been downloaded',
    });
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
    // if (searchBarRef && searchBarRef.current) {
    //   searchBarRef.current.onScrollUp();
    // }
  };

  const onScrollDown = () => {
    if (addBtnRef && addBtnRef.current) {
      addBtnRef.current.onScrollDown();
    }
    // if (searchBarRef && searchBarRef.current) {
    //   searchBarRef.current.onScrollDown();
    // }
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
            contentContainerStyle={styles.scrollable}
            ref={flatlistRef}
            onScroll={onScrollHandler}
            onRefresh={loadAnnouncements}
            refreshing={isRefreshing}
            data={announcements}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              return (
                <AnnouncementCard
                  key={item.id}
                  onEdit={() => {
                    onEditHandler(item);
                  }}
                  onDelete={() => {
                    onDeleteHandler(item.id);
                  }}
                  onDownload={() => {
                    onDownloadHandler(item);
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
      <ScrollTop ref={scrollTopRef} onPress={onScrollToTop} />
      {userData && userData.accessLevel > 0 ? (
        <AddButton
          ref={addBtnRef}
          onPress={() => {
            navigation.navigate('ModifyAnnouncement', {
              isEdit: false,
              announcementData: null,
            });
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
  scrollable: {
    paddingBottom: 200,
  },
});

export default AnnouncementScreen;
