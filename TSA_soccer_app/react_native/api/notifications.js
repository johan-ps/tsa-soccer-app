import AsyncStorage from '@react-native-async-storage/async-storage';
import CONST from '../constants/Constants';
import { fetchAndHandleError } from '../Util/error-handling';

export const updateNotificationPreferences = async (
  { removeIds, addIds, newPref },
  userAuthStatus = false,
  userId = null,
) => {
  const url = `notification-preferences/${userId}`;
  const payload = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      addPrefs: addIds,
      removePrefs: removeIds,
    }),
  };
  const auth = true;

  if (userAuthStatus) {
    await fetchAndHandleError(url, payload, auth);
  }

  await AsyncStorage.setItem(CONST.NOTIFICATION_KEY, JSON.stringify(newPref));
};

export const loadNotificationPreferences = async (userId = null) => {
  const url = `notification-preferences/${userId}`;
  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = true;

  let preferences = [];

  try {
    if (userId) {
      const resData = await fetchAndHandleError(url, payload, auth);
      preferences = resData.preferences;
    } else {
      preferences = await AsyncStorage.getItem(CONST.NOTIFICATION_KEY);
    }
  } catch (error) {
    console.log(error);
  }

  return preferences;
};
