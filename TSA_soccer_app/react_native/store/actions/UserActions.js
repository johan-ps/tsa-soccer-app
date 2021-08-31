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
        throw new Error('Something went wrong login user!');
      }

      const resData = await response.json();
      await AsyncStorage.setItem(CONST.AUTH_TOKEN_KEY, resData.token);
      dispatch({ type: LOGIN_USER, userData: resData });
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateUser = userData => {
  return async dispatch => {
    try {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      if (!authToken) {
        throw new Error('No token set');
      }

      const formData = new FormData();
      // const pic = {
      //   uri: '/9j/4AAQSkZJRgABAQEASABIAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMACgcHCAcGCggICAsKCgsOGBAODQ0OHRUWERgjHyUkIh8iISYrNy8mKTQpISIwQTE0OTs+Pj4lLkRJQzxINz0+O//bAEMBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O//AABEIAAUABQMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAABv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAVAQEBAAAAAAAAAAAAAAAAAAAGB//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJUAdWZ//9k=',
      //   type: 'image/jpeg',
      //   name: 'photo.jpg',
      // };
      for (const key in userData) {
        formData.append(key, userData[key]);
      }
      // formData.append('profileImg[uri]', pic.uri);
      // formData.append('profileImg[type]', pic.type);
      // formData.append('profileImg[name]', pic.name);
      // formData.append('profileImg', {
      //   name: new Date() + '_profile',
      //   uri: pic.uri,
      //   type: 'image/jpg',
      // });

      const response = await fetch(
        `http://${environmentUrl}/api/users/${userData.id}/update`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'x-auth-token': `Bearer ${authToken}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error('Something went wrong check session user!');
      }

      const resData = await response.json();
      dispatch({ type: UPDATE_USER, userData: resData });
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
        throw new Error('Something went wrong check auth token user!');
      }

      const resData = await response.json();
      dispatch({ type: LOGIN_USER, userData: resData });
    } catch (error) {
      console.log(error);
    }
  };
};
