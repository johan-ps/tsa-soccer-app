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
import fetch_blob from 'rn-fetch-blob';
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
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const downloadImage = (id, image) => {
  const date = new Date();
  const { fs } = fetch_blob;
  const PictureDir = fs.dirs.PictureDir + '/CTSA';
  const type = image.substring('data:image/'.length, image.indexOf(';base64'));

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

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

const AnnouncementScreen = ({ navigation }) => {
  const addBtnRef = useRef();
  const searchBarRef = useRef();
  const scrollTopRef = useRef();
  const flatlistRef = useRef();
  const filterRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const theme = useSelector(state => state.theme.colors);
  const activeTheme = useSelector(state => state.theme.activeTheme);
  const announcements = useSelector(state => state.announcements);
  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();
  const [showBadge, setShowBadge] = useState(false);
  const [filters, setFilters] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // const [offsetY, setOffsetY] = useState(0);

  const onScrollHandler = event => {
    const curOffsetY = event.nativeEvent.contentOffset.y;

    if (curOffsetY > 200) {
      scrollTopRef.current.onShow();
    } else {
      scrollTopRef.current.onHide();
    }
  };

  const onScrollToTop = () => {
    flatlistRef.current.scrollToOffset({ animated: true, y: 0 });
  };

  const onScrollStartHandler = () => {
    scrollTopRef.current.cancelAnim();
  };

  const onScrollEndHandler = () => {
    scrollTopRef.current.hideWithDelay();
  };

  const loadAnnouncements = useCallback(
    async (loading = false) => {
      if (!loading) {
        setIsRefreshing(true);
      }
      try {
        ReactNativeHapticFeedback.trigger(
          Platform.OS === 'ios' ? 'impactLight' : 'clockTick',
          options,
        );
        filterRef.current.reset();
        const timeout = setTimeout(() => {
          loadFailHandler();
        }, 5000);
        if (loading) {
          dispatch(loaderActions.updateLoader(true));
        }
        if (filters) {
          await dispatch(announcementActions.getFilteredAnnouncements(filters));
        } else {
          await dispatch(announcementActions.getAnnouncements());
        }
        clearTimeout(timeout);
      } catch (err) {
        console.log('error<1>', err);
        loadFailHandler();
      } finally {
        if (loading) {
          dispatch(loaderActions.updateLoader(false));
        }
      }
      if (!loading) {
        setIsRefreshing(false);
      }
    },
    [dispatch, filters],
  );

  useEffect(() => {
    loadAnnouncements(true);
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
        console.log('error', error);
      }
    }
  };

  const onModalCloseHandler = () => {
    setModalVisible(false);
  };

  const showFilter = useCallback(() => {
    dispatch(tabbarActions.updateVisibility(false));
    addBtnRef.current.onHide(false);
    scrollTopRef.current.onHide();
    filterRef.current.snapToIndex(0);
  }, [addBtnRef, scrollTopRef, filterRef, dispatch]);

  const hideFilter = () => {
    dispatch(tabbarActions.updateVisibility(true));
    addBtnRef.current.onShow();
  };

  const deleteAnnouncement = () => {
    dispatch(announcementActions.deleteAnnouncement(deleteId));
    setDeleteId(null);
  };

  const loadFailHandler = () => {
    setShowBadge(true);
  };

  const onCloseFailBadgeHandler = () => {
    setShowBadge(false);
  };

  const onAddAnnouncementHandler = useCallback(() => {
    navigation.navigate('ModifyAnnouncement', {
      isEdit: false,
      announcementData: null,
    });
  }, [navigation]);

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
        <NavHeader ref={searchBarRef} toggleFilter={showFilter} />
        {announcements.length === 0 ? (
          <ErrorScreen error="NO_RESULTS" onRefresh={loadAnnouncements} />
        ) : (
          <FlatList
            contentContainerStyle={styles.scrollable}
            ref={flatlistRef}
            onMomentumScrollEnd={onScrollEndHandler}
            onScroll={onScrollHandler}
            onScrollBeginDrag={onScrollStartHandler}
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
          ref={filterRef}
          primaryLabel="Apply"
          secondaryLabel="Reset"
          title="Filter Announcements"
          onCloseHandler={hideFilter}
          onUpdateFilter={setFilters}
        />
      </SafeAreaView>
      <ScrollTop ref={scrollTopRef} onPress={onScrollToTop} />
      {userData && userData.accessLevel > 0 ? (
        <AddButton ref={addBtnRef} onPress={onAddAnnouncementHandler} />
      ) : null}
      {showBadge && (
        <UiBadge
          msg="Failed to load announcements"
          onHide={onCloseFailBadgeHandler}
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
