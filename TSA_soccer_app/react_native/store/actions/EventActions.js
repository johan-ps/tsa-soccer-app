import Announcement from '../../models/announcement';
import { environmentUrl } from '../../constants/Environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONST from '../../constants/Constants';

export const GET_EVENTS = 'GET_EVENTS';
export const ADD_EVENT = 'ADD_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';
export const EDIT_EVENT = 'EDIT_EVENT';

export const getEvents = () => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://${environmentUrl}/api/events`,
      );

      if (!response.ok) {
        throw new Error('Something went wrong get events!');
      }

      const resData = await response.json();
      const events = resData.events;
      dispatch({
        type: GET_EVENTS,
        events,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const createEvent = eventData => {
  return async dispatch => {
    try {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      if (!authToken) {
        throw new Error('No token set');
      }


      const response = await fetch(
        `http://${environmentUrl}/api/events/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': `Bearer ${authToken}`,
          },
          body: eventData,
        },
      );

      if (!response.ok) {
        throw new Error('Something went wrong add announcement!');
      }

      const resData = await response.json();

      dispatch({
        type: ADD_EVENT,
        events: resData.events,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteEvent = id => {
  return {
    type: DELETE_EVENT,
    eventId: id,
  };
};

export const editEvent = eventData => {
  return async dispatch => {
    try {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      if (!authToken) {
        throw new Error('No token set');
      }


      const response = await fetch(
        `http://${environmentUrl}/api/events/edit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': `Bearer ${authToken}`,
          },
          body: eventData,
        },
      );

      if (!response.ok) {
        throw new Error('Something went wrong add announcement!');
      }

      const resData = await response.json();

      dispatch({
        type: EDIT_EVENT,
        events: resData.events,
      });
    } catch (err) {
      console.log(err);
    }
  };
}