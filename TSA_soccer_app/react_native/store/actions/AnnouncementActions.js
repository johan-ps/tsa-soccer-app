import { dispatchAndHandleError } from '../../Util/error-handling';

export const GET_ANNOUNCEMENTS = 'GET_ANNOUNCEMENTS';
export const ADD_ANNOUNCEMENT = 'ADD_ANNOUNCEMENT';
export const DELETE_ANNOUNCEMENT = 'DELETE_ANNOUNCEMENT';
export const UPDATE_ANNOUNCEMENT = 'UPDATE_ANNOUNCEMENT';
export const SEARCH_ANNOUNCEMENT = 'SEARCH_ANNOUNCEMENT';

export const getAnnouncements = () => {
  const url = 'announcements';
  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = false;
  const config = resData => {
    return {
      type: GET_ANNOUNCEMENTS,
      announcements: resData.announcements.sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      ),
    };
  };

  return dispatchAndHandleError(url, payload, auth, config);
};

export const getFilteredAnnouncements = filters => {
  const url = 'announcements';
  const payload = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...filters }),
  };
  const auth = false;
  const config = resData => {
    return {
      type: GET_ANNOUNCEMENTS,
      announcements: resData.announcements.sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      ),
    };
  };

  return dispatchAndHandleError(url, payload, auth, config);
};

export const addAnnouncement = announcementData => {
  const formData = new FormData();
  for (const key in announcementData) {
    if (announcementData[key] !== undefined && announcementData[key] !== null) {
      formData.append(key, announcementData[key]);
    }
  }

  const url = 'announcements/add';
  const payload = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  };
  const auth = true;
  const config = resData => {
    return {
      type: ADD_ANNOUNCEMENT,
      announcement: resData.announcement,
    };
  };

  return dispatchAndHandleError(url, payload, auth, config);
};

export const deleteAnnouncement = id => {
  const url = `announcements/${id}/delete`;
  const payload = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = true;
  const config = resData => ({
    type: DELETE_ANNOUNCEMENT,
    announcementId: id,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const updateAnnouncement = announcementData => {
  const formData = new FormData();
  for (const key in announcementData) {
    if (announcementData[key] !== undefined && announcementData[key] !== null) {
      formData.append(key, announcementData[key]);
    }
  }

  const url = `announcements/${announcementData.id}/update`;
  const payload = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  };
  const auth = true;
  const config = resData => ({
    type: UPDATE_ANNOUNCEMENT,
    announcement: resData.announcement,
    announcementId: announcementData.id,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const searchAnnouncements = searchQuery => {
  return {
    type: SEARCH_ANNOUNCEMENT,
    query: searchQuery,
  };
};
