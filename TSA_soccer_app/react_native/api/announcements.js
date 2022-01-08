import { environmentUrl } from '../constants/Environment';
import { fetchAndHandleError } from '../Util/error-handling';

export const getTeamsFromAnnouncement = async id => {
  const url = `announcements/${id}/teams`;
  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = false;
  const resData = await fetchAndHandleError(url, payload, auth);
  const teams = resData.teams;
  return teams;
};

export const getImageUrl = id => {
  return `http://${environmentUrl}/api/announcements/${id}/downloadImage`;
};
