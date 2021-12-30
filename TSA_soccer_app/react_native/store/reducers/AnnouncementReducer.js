import {
  GET_ANNOUNCEMENTS,
  ADD_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT,
  SEARCH_ANNOUNCEMENT,
} from '../actions/AnnouncementActions';
import { getTime } from '../../Util/utilities';

const INITIAL_STATE = [];

const announcementReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ANNOUNCEMENTS:
      return action.announcements;
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
    case SEARCH_ANNOUNCEMENT:
      const query = action.query;

      const filteredAnnouncements = [];
      const oldState = [...state];

      oldState.forEach(a => {
        const regStr = `${a.firstName}${a.lastName}${getTime(a.date)}${
          a.description
        }`;

        if (regStr.indexOf(query) !== -1) {
          filteredAnnouncements.push(a);
        }
      });

      return filteredAnnouncements;
    default:
      return state;
  }
};

export default announcementReducer;
