import AsyncStorage from '@react-native-async-storage/async-storage';
import CONST from '../../constants/Constants';
import { dispatchAndHandleError } from '../../Util/error-handling';

export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const ADD_USER = 'ADD_USER';
export const DELETE_USER = 'DELETE_USER';
export const UPDATE_USER = 'UPDATE_USER';

export const loginUser = (credentials = {}) => {
  const url = 'users/login';
  const payload = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  };
  const auth = false;
  const config = resData => {
    return {
      type: LOGIN_USER,
      userData: resData,
    };
  };
  const callback = async resData => {
    await AsyncStorage.setItem(CONST.AUTH_TOKEN_KEY, resData.token);
  };

  return dispatchAndHandleError(url, payload, auth, config, callback);
};

export const updateUser = userData => {
  const formData = new FormData();

  for (const key in userData) {
    formData.append(key, userData[key]);
  }

  const url = `users/${userData.id}/update`;
  const payload = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  };
  const auth = true;
  const config = resData => {
    return {
      type: UPDATE_USER,
      userData: resData,
    };
  };

  return dispatchAndHandleError(url, payload, auth, config);
};

export const logoutUser = () => {
  return async dispatch => {
    try {
      await AsyncStorage.removeItem(CONST.AUTH_TOKEN_KEY);
      dispatch({ type: LOGOUT_USER });
    } catch (error) {
      console.log(error);
    }
  };
};

export const checkAuthToken = () => {
  const url = 'users/session';
  const payload = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = true;
  const config = resData => {
    return {
      type: LOGIN_USER,
      userData: resData,
    };
  };

  return dispatchAndHandleError(url, payload, auth, config);
};
