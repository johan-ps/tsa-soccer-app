import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import RNBootSplash from 'react-native-bootsplash';

import MainNavigator from './react_native/navigation/MainNavigator';
import ThemeReducer from './react_native/store/reducers/ThemeReducer';
import AnnouncementReducer from './react_native/store/reducers/AnnouncementReducer';
import UserReducer from './react_native/store/reducers/UserReducer';
import * as userActions from './react_native/store/actions/UserActions';
import LocationReducer from './react_native/store/reducers/LocationReducer';
import SetLoader from './react_native/components/SetLoader';
import LoaderReducer from './react_native/store/reducers/LoaderReducer';
import TabbarReducer from './react_native/store/reducers/TabbarReducer';

const rootReducer = combineReducers({
  theme: ThemeReducer,
  announcements: AnnouncementReducer,
  events: EventsReducer,
  locations: LocationReducer,
  userData: UserReducer,
  loading: LoaderReducer,
  tabbar: TabbarReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  useEffect(() => {
    const init = async () => {
      await store.dispatch(userActions.checkAuthToken());
    };

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
    });
  }, []);

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
