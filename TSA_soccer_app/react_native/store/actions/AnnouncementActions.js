import Announcement from '../../models/announcement';
import { environmentUrl } from '../../constants/Environment';
import { fetchAndHandleError } from '../../Util/error-handling';

export const GET_ANNOUNCEMENTS = 'GET_ANNOUNCEMENTS';
export const ADD_ANNOUNCEMENT = 'ADD_ANNOUNCEMENT';
export const DELETE_ANNOUNCEMENT = 'DELETE_ANNOUNCEMENT';
export const UPDATE_ANNOUNCEMENT = 'UPDATE_ANNOUNCEMENT';
export const SEARCH_ANNOUNCEMENT = 'SEARCH_ANNOUNCEMENT';

export const getAnnouncements = () => {
  const url = `http://${environmentUrl}/api/announcements`;
  const reqInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = false;
  const callback = resData => {
    return {
      type: GET_ANNOUNCEMENTS,
      announcements: resData.announcements.sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      ),
    };
  };

  return fetchAndHandleError(url, reqInit, auth, callback);
};

export const getFilteredAnnouncements = filters => {
  const url = `http://${environmentUrl}/api/announcements`;
  const reqInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...filters }),
  };
  const auth = false;
  const callback = resData => {
    return {
      type: GET_ANNOUNCEMENTS,
      announcements: resData.announcements.sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      ),
    };
  };

  return fetchAndHandleError(url, reqInit, auth, callback);
};

export const addAnnouncement = announcementData => {
  const formData = new FormData();
  for (const key in announcementData) {
    if (announcementData[key] !== undefined && announcementData[key] !== null) {
      formData.append(key, announcementData[key]);
    }
  }

  const url = `http://${environmentUrl}/api/announcements/add`;
  const reqInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  };
  const auth = true;
  const callback = resData => {
    return {
      type: ADD_ANNOUNCEMENT,
      announcement: resData.announcement,
    };
  };

  return fetchAndHandleError(url, reqInit, auth, callback);
};

export const deleteAnnouncement = id => {
  const url = `http://${environmentUrl}/api/announcements/${id}/delete`;
  const reqInit = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = true;
  const callback = resData => ({
    type: DELETE_ANNOUNCEMENT,
    announcementId: id,
  });

  return fetchAndHandleError(url, reqInit, auth, callback);
};

export const updateAnnouncement = announcementData => {
  const formData = new FormData();
  for (const key in announcementData) {
    if (announcementData[key] !== undefined && announcementData[key] !== null) {
      formData.append(key, announcementData[key]);
    }
  }

  const url = `http://${environmentUrl}/api/announcements/${announcementData.id}/update`;
  const reqInit = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  };
  const auth = true;
  const callback = resData => ({
    type: UPDATE_ANNOUNCEMENT,
    announcement: resData.announcement,
    announcementId: announcementData.id,
  });

  return fetchAndHandleError(url, reqInit, auth, callback);
};

export const searchAnnouncements = searchQuery => {
  return {
    type: SEARCH_ANNOUNCEMENT,
    query: searchQuery,
  };
};
