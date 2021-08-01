import Announcement from '../../models/announcement';
import {Announcements} from '../../data/announcements';
const environmentUrl = 'localhost:3000';

export const GET_ANNOUNCEMENTS = 'GET_ANNOUNCEMENTS';
export const ADD_ANNOUNCEMENT = 'ADD_ANNOUNCEMENTS';
export const DELETE_ANNOUNCEMENT = 'DELETE_ANNOUNCEMENT';

export const getAnnouncements = () => {
  return async dispatch => {
    try {
      // const response = await fetch(`http://${environmentUrl}/announcements`);

      // if (!response.ok) {
      //   throw new Error('Something went wrong!');
      // }

      // const resData = await response.json();
      const resData = Announcements;
      dispatch({ type: GET_ANNOUNCEMENTS, announcements: resData });
    } catch (err) {
      console.log(err);
    }
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
