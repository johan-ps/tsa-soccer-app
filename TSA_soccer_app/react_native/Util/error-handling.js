import AsyncStorage from '@react-native-async-storage/async-storage';
import CONST from '../constants/Constants';

export const fetchAndHandleError = (
  url = '',
  reqInit = { headers: {} },
  auth = false,
  callback = null,
) => {
  return async dispatch => {
    try {
      let authToken = null;

      if (auth) {
        authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

        if (!authToken) {
          throw new Error('No auth token set');
        }
      }

      const response = await fetch(url, {
        ...reqInit,
        headers: {
          ...reqInit.headers,
          'x-auth-token': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const resData = await response.json();

      dispatch(callback(resData));
    } catch (error) {
      if (error && error.errors && error.errors.length > 0) {
        throw error.errors;
      } else {
        console.log(
          'Action api call error at',
          url,
          'with request',
          reqInit,
          'and dispatch type',
          config,
        );
      }
    }
  };
};
