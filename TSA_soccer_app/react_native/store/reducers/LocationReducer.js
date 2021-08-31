import {
  GET_LOCATIONS,
} from '../actions/EventActions';

const INITIAL_STATE = [];

const eventReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return action.events;
    case ADD_EVENT:
      return [action.event, ...state];
    case DELETE_EVENT:
      return state.filter(item => item.id !== action.eventId);
    case EDIT_EVENT:
      return [action.event, ...state];
    default:
      return state;
  }
};

export default eventReducer;
