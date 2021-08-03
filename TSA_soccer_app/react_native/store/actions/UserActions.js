export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const ADD_USER = 'ADD_USER';
export const DELETE_USER = 'DELETE_USER';
export const UPDATE_USER = 'UPDATE_USER';
import { environmentUrl } from '../../constants/Environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONST from '../../constants/Constants';

export const loginUser = (credentials = {}) => {
  return async dispatch => {
    try {
      const response = await fetch(`http://${environmentUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      await AsyncStorage.setItem(CONST.AUTH_TOKEN_KEY, resData.token);
      dispatch({ type: LOGIN_USER, userData: resData });
    } catch (error) {
      console.log(error);
    }
  };
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
  return async dispatch => {
    try {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      if (!authToken) {
        throw new Error('No token set');
      }

      const response = await fetch(
        `http://${environmentUrl}/api/users/session`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token': `Bearer ${authToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      dispatch({ type: LOGIN_USER, userData: resData });
    } catch (error) {
      console.log(error);
    }
  };
};
