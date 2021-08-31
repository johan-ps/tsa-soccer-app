import { LOGIN_USER, LOGOUT_USER, UPDATE_USER } from '../actions/UserActions';

const INITIAL_STATE = {
  authenticated: false,
  accessLevel: 0,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...action.userData.user,
        authenticated: state.authenticated || action.userData.success,
        token: state.token || action.userData.token,
      };
    case UPDATE_USER:
      return {
        ...action.userData,
        authenticated: state.authenticated,
        token: state.token,
      };
    case LOGOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default userReducer;
