import AsyncStorage from '@react-native-async-storage/async-storage';
import CONST from '../constants/Constants';
import { environmentUrl } from '../constants/Environment';

export const dispatchAndHandleError = (
  url = '',
  payload = { headers: {} },
  auth = false,
  config = null,
  callback = null,
) => {
  return async dispatch => {
    const resData = await fetchAndHandleError(url, payload, auth, callback);
    dispatch(config(resData));
  };
};

export const fetchAndHandleError = async (
  url = '',
  payload = { headers: {} },
  auth = false,
  callback = null,
) => {
  try {
    let authToken = null;

    if (auth) {
      authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      if (!authToken) {
        throw new Error('No auth token set');
      }
    }

    url = `http://${environmentUrl}/api/${url}`;

    const response = await fetch(url, {
      ...payload,
      headers: {
        ...payload.headers,
        'x-auth-token': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    const resData = await response.json();

    if (callback) {
      await callback(resData);
    }

    return resData;
  } catch (error) {
    if (error && error.errors && error.errors.length > 0) {
      throw error.errors;
    } else {
      console.log(
        'Action api call error at',
        url,
        'with request payload',
        payload,
      );
    }
  }
};
