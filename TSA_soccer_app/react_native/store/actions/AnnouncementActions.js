import Announcement from '../../models/announcement';
import { environmentUrl } from '../../constants/Environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONST from '../../constants/Constants';

export const GET_ANNOUNCEMENTS = 'GET_ANNOUNCEMENTS';
export const ADD_ANNOUNCEMENT = 'ADD_ANNOUNCEMENT';
export const DELETE_ANNOUNCEMENT = 'DELETE_ANNOUNCEMENT';

export const getAnnouncements = () => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://${environmentUrl}/api/announcements`,
      );

      if (!response.ok) {
        throw new Error('Something went wrong get announcements!');
      }

      const resData = await response.json();
      const announcements = resData.announcements.sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      ); // TODO: Sorting should be done in backend
      dispatch({
        type: GET_ANNOUNCEMENTS,
        announcements,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const addAnnouncement = announcementData => {
  return async dispatch => {
    try {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      if (!authToken) {
        throw new Error('No token set');
      }

      const formData = new FormData();
      for (const key in announcementData) {
        formData.append(key, announcementData[key]);
      }

      const response = await fetch(
        `http://${environmentUrl}/api/announcements/add`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'x-auth-token': `Bearer ${authToken}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const resData = await response.json();

      dispatch({
        type: GET_ANNOUNCEMENTS,
        announcements: resData.announcements,
      });
    } catch (err) {
      console.log(err);

      if (err && err.errors && err.errors.length > 0) {
        throw err.errors;
      }
    }
  };
};

export const deleteAnnouncement = id => {
  return {
    type: DELETE_ANNOUNCEMENT,
    announcementId: id,
  };
};
