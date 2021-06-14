import { GET_ANNOUNCEMENTS } from '../actions/AnnouncementActions';

const INITIAL_STATE = [];

const announcementReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ANNOUNCEMENTS:
      return action.announcements;
    default:
      return state;
  }
};

export default announcementReducer;
