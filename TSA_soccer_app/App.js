import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import RNBootSplash from 'react-native-bootsplash';

import MainNavigator from './react_native/navigation/MainNavigator';
import ThemeReducer from './react_native/store/reducers/ThemeReducer';
import AnnouncementReducer from './react_native/store/reducers/AnnouncementReducer';

const rootReducer = combineReducers({
  theme: ThemeReducer,
  announcements: AnnouncementReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
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
