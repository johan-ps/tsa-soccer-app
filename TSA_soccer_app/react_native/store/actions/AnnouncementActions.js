import { Announcements } from '../../data/announcements';
import Announcement from '../../models/announcement';

export const GET_ANNOUNCEMENTS = 'GET_ANNOUNCEMENTS';
export const ADD_ANNOUNCEMENT = 'ADD_ANNOUNCEMENTS';
export const DELETE_ANNOUNCEMENT = 'DELETE_ANNOUNCEMENT';

export const getAnnouncements = () => {
  return {
    type: GET_ANNOUNCEMENTS,
    announcements: Announcements,
  };
};

export const addAnnouncement = announcementData => {
  return {
    type: ADD_ANNOUNCEMENT,
    announcement: new Announcement(
      announcementData.id,
      announcementData.date,
      announcementData.title,
      announcementData.description,
      announcementData.type,
      announcementData.author,
      announcementData.imageUrl,
      announcementData.authorImgUrl,
      announcementData.teams,
    ),
  };
};

export const deleteAnnouncement = id => {
  return {
    type: DELETE_ANNOUNCEMENT,
    announcementId: id,
  };
};
