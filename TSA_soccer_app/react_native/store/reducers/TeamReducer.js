import { GET_TEAM, ADD_TEAM, DELETE_TEAM } from '../actions/TeamActions';

const INITIAL_STATE = [];

const announcementReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TEAM:
      return action.teams;
    default:
      return state;
  }
};

export default announcementReducer;
