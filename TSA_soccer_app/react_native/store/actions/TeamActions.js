import { environmentUrl } from '../../constants/Environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONST from '../../constants/Constants';
import { DELETE_EVENT } from './EventActions';

export const GET_TEAM = 'GET_TEAM'

export const getTeams = () => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://${environmentUrl}/api/teams`,
      );

      if (!response.ok) {
        throw new Error('Something went wrong get announcements!');
      }

      const resData = await response.json();
      const announcements = resData.teams;
      dispatch({
        type: GET_TEAMS,
        announcements,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const addTeam = teamData => {
  return async dispatch => {
    try {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      if (!authToken) {
        throw new Error('No token set');
      }

      const response = await fetch(
        `http://${environmentUrl}/api/announcements/add`,
        {
          method: 'POST',
          body: teamData,
        },
      );

      if (!response.ok) {
        throw new Error('Something went wrong add announcement!');
      }

      const resData = await response.json();

      dispatch({
        type: ADD_TEAM,
        team: resData.team,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteAnnouncement = id => {
  return {
    type: DELETE_EVENT,
    announcementId: id,
  };
};
