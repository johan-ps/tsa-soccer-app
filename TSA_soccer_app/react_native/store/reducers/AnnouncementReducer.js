import {
  GET_ANNOUNCEMENTS,
  ADD_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
} from '../actions/AnnouncementActions';
// import { sortByDate } from '../../Util/utilities';

const INITIAL_STATE = [];

const announcementReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ANNOUNCEMENTS:
      return action.announcements;
    case ADD_ANNOUNCEMENT:
      return [action.announcement, ...state];
    case DELETE_ANNOUNCEMENT:
      return state.filter(item => item.id !== action.announcementId);
    default:
      return state;
  }
};

export default announcementReducer;