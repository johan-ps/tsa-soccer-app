export const GET_USER_DATA = 'GET_USER_DATA';
const environmentUrl = 'localhost:3000'; // '10.0.0.59:3000'; // '10.0.2.2:3000';

export const getUserData = () => {
  return async dispatch => {
    try {
      // console.log('here');
      const response = await fetch(`http://${environmentUrl}/userData`);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      // console.log(resData);
      dispatch({ type: GET_USER_DATA, userData: resData });
    } catch (err) {
      console.log(err);
    }
  };
};
