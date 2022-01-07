import {
  GET_TEAMS,
  ADD_TEAM,
  DELETE_TEAM,
  GET_TEAM_USERS,
} from '../actions/TeamActions';

const INITIAL_STATE = [];

const teamReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TEAMS:
      return action.teams;
    case GET_TEAM_USERS:
      return action.users;
    default:
      return state;
  }
};

export default teamReducer;
