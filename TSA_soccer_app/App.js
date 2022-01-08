import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import RNBootSplash from 'react-native-bootsplash';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { PortalProvider } from '@gorhom/portal';

import MainNavigator from './react_native/navigation/MainNavigator';
import ThemeReducer from './react_native/store/reducers/ThemeReducer';
import AnnouncementReducer from './react_native/store/reducers/AnnouncementReducer';
import UserReducer from './react_native/store/reducers/UserReducer';
import * as userActions from './react_native/store/actions/UserActions';
import EventReducer from './react_native/store/reducers/EventReducer';
import LocationReducer from './react_native/store/reducers/LocationReducer';
import SetLoader from './react_native/components/SetLoader';
import LoaderReducer from './react_native/store/reducers/LoaderReducer';
import TeamReducer from './react_native/store/reducers/TeamReducer';
import TabbarReducer from './react_native/store/reducers/TabbarReducer';

import { loadNotificationPreferences } from './react_native/api/notifications';

const rootReducer = combineReducers({
  theme: ThemeReducer,
  announcements: AnnouncementReducer,
  events: EventReducer,
  locations: LocationReducer,
  teams: TeamReducer,
  userData: UserReducer,
  loading: LoaderReducer,
  tabbar: TabbarReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const TOPIC = 'Team';

/**
 * Set a message handler function which is called when
 * the app is in the background or terminated. In Android,
 * a headless task is created, allowing you to access the
 * React Native environment to perform tasks such as updating
 * local storage, or sending a network request.
 */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  handleAnnouncementNotification(remoteMessage);
});

const handleAnnouncementNotification = ({
  data = { name: 'Gryffin', teamName: 'Team Name' },
}) => {
  PushNotification.localNotification({
    channelId: 'announcement-channel',
    title: data.teamName,
    message: `Coach ${data.name} just shared a post`,
  });
};

const App = () => {
  const requestUserPermission = async () => {
    /**
     * On iOS, messaging permission must be requested by
     * the current application before messages can be
     * received or sent
     */
    const authStatus = await messaging().requestPermission();
    console.log('Authorization status(authStatus):', authStatus);
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };

  useEffect(() => {
    const init = async () => {
      try {
        await store.dispatch(userActions.checkAuthToken());
        const userData = store.getState().userData;
        loadNotificationPreferences(
          userData && userData.authenticated ? userData.id : null,
        ).then(prefs => {
          if (prefs) {
            prefs.forEach(pref => {
              messaging()
                .subscribeToTopic(`${TOPIC}${pref}`)
                .then(() => {
                  console.log(`Subscribed to topic: ${TOPIC}${pref}`);
                });
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
    });

    if (requestUserPermission()) {
      /**
       * Returns an FCM token for this device
       */
      messaging()
        .getToken()
        .then(fcmToken => {
          console.log('FCM Token -> ', fcmToken);
        });
    } else {
      console.log('Not Authorization status:', 'authStatus');
    }

    /**
     * When a notification from FCM has triggered the application
     * to open from a quit state, this method will return a
     * `RemoteMessage` containing the notification data, or
     * `null` if the app was opened via another method.
     */
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            'getInitialNotification:' +
              'Notification caused app to open from quit state',
          );
          console.log(remoteMessage);
          alert(
            'getInitialNotification: Notification caused app to' +
              ' open from quit state',
          );
        }
      });

    /**
     * When the user presses a notification displayed via FCM,
     * this listener will be called if the app has opened from
     * a background state. See `getInitialNotification` to see
     * how to watch for when a notification opens the app from
     * a quit state.
     */
    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage) {
        console.log(
          'onNotificationOpenedApp: ' +
            'Notification caused app to open from background state',
        );
        console.log(remoteMessage);
        alert(
          'onNotificationOpenedApp: Notification caused app to' +
            ' open from background state',
        );
      }
    });

    /**
     * When any FCM payload is received, the listener callback
     * is called with a `RemoteMessage`. Returns an unsubscribe
     * function to stop listening for new messages.
     */
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // alert('A new FCM message arrived!');
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // remoteMessage = JSON.(remoteMessage);
      // console.log(remoteMessage);
      // console.log(remoteMessage.data);
      handleAnnouncementNotification(remoteMessage);
    });

    /**
     * Apps can subscribe to a topic, which allows the FCM
     * server to send targeted messages to only those devices
     * subscribed to that topic.
     */
    // messaging()
    //   .subscribeToTopic(TOPIC)
    //   .then(() => {
    //     console.log(`Topic: ${TOPIC} Suscribed`);
    //   });

    return () => {
      unsubscribe;
      /**
       * Unsubscribe the device from a topic.
       */
      // messaging().unsubscribeFromTopic(TOPIC);
    };
  }, []);

  useEffect(() => {
    createChannel();
  }, []);

  const createChannel = () => {
    PushNotification.createChannel({
      channelId: 'announcement-channel',
      channelName: 'Announcement Channel',
    });
  };

  return (
    <PortalProvider>
      <Provider store={store}>
        <SetLoader />
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </Provider>
    </PortalProvider>
  );
};

export default App;
