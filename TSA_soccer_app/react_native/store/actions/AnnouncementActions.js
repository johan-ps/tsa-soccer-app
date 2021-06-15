import { Announcements } from '../../data/announcements';

export const GET_ANNOUNCEMENTS = 'GET_ANNOUNCEMENTS';

export const getAnnouncements = () => {
  return {
    type: GET_ANNOUNCEMENTS,
    announcements: Announcements,
  };
};
