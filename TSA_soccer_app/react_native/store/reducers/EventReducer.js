import {
  GET_EVENTS,
  GET_EVENTS_TODAY,
  GET_EVENT_DATES,
  ADD_EVENT,
  DELETE_EVENT,
  EDIT_EVENT,
  UPDATE_AVAILABILITY
} from '../actions/EventActions';
import moment from 'moment';

const INITIAL_STATE = [];

const eventReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return action.events;
    case GET_EVENTS_TODAY:
      let today = state.today;
      today = action.events;
      return {today: today, upcoming: state.upcoming, dates: state.dates};
    case GET_EVENT_DATES:
      return {dates: action.dates, ...state}
    case ADD_EVENT:
      let updatedState = state;
      if(moment(action.event.date).isAfter(moment())){
        updatedState.upcoming.push(action.event);
      }
      else if (moment(action.event.date).isSame(moment())){
        updatedState.today.push(action.event);
      }
      return updatedState;
    case DELETE_EVENT:
      let todayEvents = state.today.filter(event =>
        event.id !== action.eventId
      );
      let upcomingEvents = state.upcoming.filter(event => 
        event.id !== action.eventId
      );
      let updateState = {today: todayEvents, upcoming: upcomingEvents}
      return updateState;
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
