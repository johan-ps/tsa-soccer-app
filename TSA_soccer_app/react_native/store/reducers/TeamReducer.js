import {
  GET_TEAMS,
} from '../actions/TeamActions';

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
