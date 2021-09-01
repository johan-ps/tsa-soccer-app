import {
  GET_EVENTS,
  ADD_EVENT,
  DELETE_EVENT,
  EDIT_EVENT,
  UPDATE_AVAILABILITY
} from '../actions/EventActions';

const INITIAL_STATE = [];

const eventReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return action.events;
    case ADD_EVENT:
      let updatedState = state;
      if(moment(action.event.date).isAfter(new Date())){
        updatedState.upcoming.push(action.event);
      }
      else{
        updatedState.today.push(action.event);
      }
      return updatedState;
    case DELETE_EVENT:
      return state.filter(item => item.id !== action.eventId);
    case EDIT_EVENT:
      return [action.event, ...state];
    case UPDATE_AVAILABILITY:
      let newState = {
        today: state.today.map(event => {
          if(event.id === action.event.id){
            return {...event, status: action.event.availability};
          }
          else{
            return event;
          }
        }),
        upcoming: state.upcoming.map(event => {
          if(event.id === action.event.id){
            return {...event, status: action.event.availability};
          }
          else{
            return event;
          }
        })
      }
      return newState;
    default:
      return state;
  }
};

export default eventReducer;
