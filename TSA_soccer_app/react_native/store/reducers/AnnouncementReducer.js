import {
  GET_ANNOUNCEMENTS,
  ADD_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT,
} from '../actions/AnnouncementActions';
// import { sortByDate } from '../../Util/utilities';

const INITIAL_STATE = [];

const announcementReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ANNOUNCEMENTS:
      const a = action.announcements;
      return [a[0], a[1], a[2], a[3], a[4], a[5]];
    case ADD_ANNOUNCEMENT:
      return [action.announcement, ...state];
    case DELETE_ANNOUNCEMENT:
      return state.filter(item => item.id !== action.announcementId);
    case UPDATE_ANNOUNCEMENT:
      const newState = [...state];

      const id = newState
        .map(announcement => {
          return announcement.id;
        })
        .indexOf(action.announcementId);

      newState[id] = action.announcement;

      return newState;
    default:
      return state;
  }
};

export default announcementReducer;
