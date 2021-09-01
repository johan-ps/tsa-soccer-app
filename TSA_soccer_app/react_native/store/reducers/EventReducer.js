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
      // if(moment(action.event.date).isAfter(new Date())){
      //   const upcoming = Object.assign(state.upcoming, action.event);
      // }
      // else{
      //   const today = Object.assign(state.today, action.event);
      // }
      return [action.event, ...state];
    case DELETE_EVENT:
      return state.filter(item => item.id !== action.eventId);
    case EDIT_EVENT:
      return [action.event, ...state];
    case UPDATE_AVAILABILITY:
      let newEvent = null;
      console.log("joell state", state);
      state.today.forEach(event => {
        console.log("Joell event", event);
        if(event.id === action.event.id){
          newEvent = event;
          return;
        }
      })
      state.upcoming.forEach(event => {
        console.log("Joell event", event);
        if(event.id === action.event.id){
          newEvent = event;
          return;
        }
      })
      console.log("JOell ", newEvent)
      let event = Object.assign(newEvent, {status: action.event.availability});
      console.log("Joell ", event);
      return [event, ...state];
    default:
      return state;
  }
};

export default eventReducer;
