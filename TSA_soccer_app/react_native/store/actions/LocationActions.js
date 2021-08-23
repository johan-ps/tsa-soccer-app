import { environmentUrl } from '../../constants/Environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONST from '../../constants/Constants';

export const getLocations = () => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://${environmentUrl}/api/locations/`,
      );

      if (!response.ok) {
        throw new Error('Something went wrong get events!');
      }

      const resData = await response.json();
      const locations = resData.locations;
      dispatch({
        type: GET_LOCATIONS,
        locations,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const createLocation = locationData => {
  return async dispatch => {
    try {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      const response = await fetch(
        `http://${environmentUrl}/api/locations/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': `Bearer ${authToken}`,
          },
          body: locationData
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong get events!');
      }

      const resData = await response.json();
      const location = resData.location;
      dispatch({
        type: CREATE_LOCATION,
        location,
      });
    } catch (err) {
      console.log(err);
    }
  }
}