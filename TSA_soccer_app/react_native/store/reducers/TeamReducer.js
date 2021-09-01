import { GET_TEAMS, ADD_TEAM, DELETE_TEAM } from '../actions/TeamActions';

const INITIAL_STATE = [];

const announcementReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TEAMS:
      return action.teams;
    default:
      return state;
  }
};

export default announcementReducer;
