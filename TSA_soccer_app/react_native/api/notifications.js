// export const LOGIN_USER = 'LOGIN_USER';
import { environmentUrl } from '../constants/Environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONST from '../constants/Constants';

export const updateNotificationPreferences = async (
  { removeIds, addIds, newPref },
  userAuthStatus = false,
  userId = null,
) => {
  try {
    if (userAuthStatus) {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      if (!authToken) {
        throw new Error('No token set');
      }

      const response = await fetch(
        `http://${environmentUrl}/api/notification-preferences/${userId}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            addPrefs: addIds,
            removePrefs: removeIds,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const resData = await response.json();
    }
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    await AsyncStorage.setItem(CONST.NOTIFICATION_KEY, JSON.stringify(newPref));
  }
};

export const loadNotificationPreferences = async (userId = null) => {
  try {
    if (userId) {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      if (!authToken) {
        throw new Error('No token set');
      }

      const response = await fetch(
        `http://${environmentUrl}/api/notification-preferences/${userId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token': `Bearer ${authToken}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const resData = await response.json();
      return resData.preferences;
    } else {
      let prefs = await AsyncStorage.getItem(CONST.NOTIFICATION_KEY);

      if (!prefs) {
        throw new Error('No notification pref set');
      }
      return JSON.parse(prefs);
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};
