export const GET_USER_DATA = 'GET_USER_DATA';
import { environmentUrl } from '../../constants/Environment';

export const getUserData = () => {
  return async dispatch => {
    try {
      const response = await fetch(`http://${environmentUrl}/userData`);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      dispatch({ type: GET_USER_DATA, userData: resData });
    } catch (err) {
      console.log(err);
    }
  };
};
