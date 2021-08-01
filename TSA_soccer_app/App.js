import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import RNBootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainNavigator from './react_native/navigation/MainNavigator';
import ThemeReducer from './react_native/store/reducers/ThemeReducer';
import AnnouncementReducer from './react_native/store/reducers/AnnouncementReducer';
import UserReducer from './react_native/store/reducers/UserReducer';

const rootReducer = combineReducers({
  theme: ThemeReducer,
  announcements: AnnouncementReducer,
  userData: UserReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState('');

  const checkLoginCredentials = () => {
    AsyncStorage.getItem('credentials')
      .then(res => {
        if (res) {
          setStoredCredentials(JSON.parse(res));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Provider store={store}>
      <NavigationContainer
        onReady={() => {
          RNBootSplash.hide({ fade: true });
        }}>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
