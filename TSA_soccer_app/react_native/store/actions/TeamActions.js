import { dispatchAndHandleError } from '../../Util/error-handling';

export const GET_TEAMS = 'GET_TEAMS';
export const ADD_TEAM = 'ADD_TEAM';
export const DELETE_TEAM = 'DELETE_TEAM';
export const GET_TEAM_USERS = 'GET_TEAM_USERS';

export const getTeams = () => {
  const url = 'teams';
  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = false;
  const config = resData => ({
    type: GET_TEAMS,
    teams: resData.teams,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const getAllUsersFromTeam = teamId => {
  const url = `teams/${teamId}/users`;
  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = false;
  const config = resData => ({
    type: GET_TEAM_USERS,
    users: resData.users,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const addTeam = teamData => {
  const url = 'announcements/add';
  const payload = {
    method: 'POST',
    body: teamData,
  };
  const auth = false;
  const config = resData => ({
    type: ADD_TEAM,
    team: resData.team,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const deleteAnnouncement = id => {
  return {
    type: DELETE_TEAM,
    announcementId: id,
  };
};
