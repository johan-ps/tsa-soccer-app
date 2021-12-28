import { environmentUrl } from '../constants/Environment';

export const getTeamsFromAnnouncement = async id => {
  try {
    const response = await fetch(
      `http://${environmentUrl}/api/announcements/${id}/teams`,
    );

    if (!response.ok) {
      throw new Error('Something went wrong');
    }

    const resData = await response.json();
    const teams = resData.teams;
    return teams;
  } catch (err) {
    console.log('err<>', err);

    if (err && err.errors && err.errors.length > 0) {
      throw err.errors;
    }
  }
};

export const getImageUrl = id => {
  return `http://${environmentUrl}/api/announcements/${id}/downloadImage`;
};
