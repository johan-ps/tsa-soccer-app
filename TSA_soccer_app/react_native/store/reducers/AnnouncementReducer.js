import {
  GET_ANNOUNCEMENTS,
  ADD_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT,
  SEARCH_ANNOUNCEMENT,
} from '../actions/AnnouncementActions';
import { getTime } from '../../Util/utilities';

const INITIAL_STATE = {
  announcements: [],
  filteredAnnouncements: [],
  applyFilters: false,
};

const announcementReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ANNOUNCEMENTS:
      return {
        announcements: action.announcements,
        filteredAnnouncements: [],
        applyFilters: false,
      };
    case ADD_ANNOUNCEMENT:
      return {
        announcements: [action.announcement, ...state.announcements],
        filteredAnnouncements: [],
        applyFilters: false,
      };
    case DELETE_ANNOUNCEMENT:
      return {
        announcements: state.announcements.filter(
          item => item.id !== action.announcementId,
        ),
        filteredAnnouncements: [],
        applyFilters: false,
      };
    case UPDATE_ANNOUNCEMENT:
      const newState = [...state.announcements];

      const id = newState
        .map(announcement => {
          return announcement.id;
        })
        .indexOf(action.announcementId);

      newState[id] = action.announcement;

      return {
        announcements: newState,
        filteredAnnouncements: [],
        applyFilters: false,
      };
    case SEARCH_ANNOUNCEMENT:
      const query = action.query;

      const filteredAnnouncements = [];
      const oldState = [...state.announcements];

      oldState.forEach(a => {
        const regStr = `${a.firstName}${a.lastName}${getTime(a.date)}${
          a.description
        }`;

        if (regStr.indexOf(query) !== -1) {
          filteredAnnouncements.push(a);
        }
      });

      return {
        announcements: [...state.announcements],
        filteredAnnouncements,
        applyFilters: true,
      };
    default:
      return state;
  }
};

export default announcementReducer;
