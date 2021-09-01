import {
  GET_LOCATIONS,
  CREATE_LOCATION
} from '../actions/LocationActions';

const INITIAL_STATE = [];

const eventReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_LOCATIONS:
      return action.locations;
    case CREATE_LOCATION:
      return [action.location, ...state]
    default:
      return state;
  }
};

export default eventReducer;
