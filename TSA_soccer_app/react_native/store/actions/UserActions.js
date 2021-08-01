export const GET_USER_DATA = 'GET_USER_DATA';
import { environmentUrl } from '../../constants/Environment';

export const getUserData = () => {
  return async dispatch => {
    try {
      // const response = await fetch(`http://${environmentUrl}/userData`);

      // if (!response.ok) {
      //   throw new Error('Something went wrong!');
      // }

      const resData = {
        id: 0,
        accessLevel: 1,
        name: {
          first: 'Johan',
          last: 'Sebastiampillai',
        },
        imageUrl:
          'https://cps-static.rovicorp.com/3/JPG_400/MI0004/652/MI0004652833.jpg?partner=allrovi.com',
        role: 'player',
        email: 'johan-ps@gmail.com',
        phoneNumber: '6471231234',
        teams: [],
      };
      dispatch({ type: GET_USER_DATA, userData: resData });
    } catch (err) {
      console.log(err);
    }
  };
};
