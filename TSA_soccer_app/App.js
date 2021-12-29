import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import RNBootSplash from 'react-native-bootsplash';
import PushNotification from 'react-native-push-notification';
import { LogBox } from 'react-native';

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

const App = () => {
  useEffect(() => {
    LogBox.ignoreLogs(['Require cycle:']);

    const init = async () => {
      await store.dispatch(userActions.checkAuthToken());
    };

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
    });
  }, []);

  useEffect(() => {
    createChannel();
  }, []);

  const createChannel = () => {
    PushNotification.createChannel({
      channelId: 'test-channel',
      channelName: 'Test Channel',
    });
  };

  return (
    <Provider store={store}>
      <SetLoader />
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
