import { GET_USER_DATA } from '../actions/UserActions';

const INITIAL_STATE = {
  accessLevel: 0,
  name: {
    first: 'John',
    last: 'Doe',
  },
  imageUrl: '',
  role: 'player',
  email: '',
  phoneNumber: '',
  teams: [],
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_USER_DATA:
      return action.userData;
    default:
      return state;
  }
};

export default userReducer;
