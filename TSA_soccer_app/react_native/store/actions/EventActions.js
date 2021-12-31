import { environmentUrl } from '../../constants/Environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONST from '../../constants/Constants';

export const GET_EVENTS = 'GET_EVENTS';
export const ADD_EVENT = 'ADD_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';
export const EDIT_EVENT = 'EDIT_EVENT';
export const UPDATE_AVAILABILITY = 'UPDATE_AVAILABILITY';
export const GET_EVENTS_TODAY = 'GET_EVENTS_TODAY';
export const GET_EVENT_DATES = 'GET_EVENT_DATES';

export const getEvents = () => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://${environmentUrl}/api/events/`,
      );

      if (!response.ok) {
        throw new Error('Something went wrong get events!');
      }

      const resData = await response.json();
      const events = resData.events;
      dispatch({
        type: GET_EVENTS,
        events,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getEventById = id => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://${environmentUrl}/api/events/${id}/details`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong getEventsonDate!');
      }

      const resData = await response.json();
      const event = {event: resData.event, availabilities: resData.availabilities};
      return event;

    } catch (err) {
      console.log(err);
    }
  }
}

export const getEventsOnDate = (date, userId) => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://${environmentUrl}/api/events/date?date=${date}&userId=${userId}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong getEventsonDate!');
      }

      const resData = await response.json();
      const events = resData.events;

      dispatch({
        type: GET_EVENTS_TODAY,
        events,
      });

    } catch (err) {
      console.log(err);
    }
  }
}

export const getEventsFromDate = (date, userId, teamId) => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://${environmentUrl}/api/events/startingFrom/?date=${date}&userId=${userId}&teamId=${teamId}`,
        {
          method: 'GET'
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error('Something went wrong getEventsonDate!');
      }

      const resData = await response.json();
      const events = resData.events;
      dispatch({
        type: GET_EVENTS,
        events,
      });

    } catch (err) {
      console.log(err);
    }
  }
}


export const getEventDatesByMonth = (startOfMonth, endOfMonth) => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://${environmentUrl}/api/events/month/?startOfMonth=${startOfMonth}&endOfMonth=${endOfMonth}`,
        {
          method: 'GET'
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error('Something went wrong getEventsonDate!');
      }

      const resData = await response.json();
      const dates = resData.dates;
      dispatch({
        type: GET_EVENT_DATES,
        dates,
      });

    } catch (err) {
      console.log(err);
    }
  }
}

export const updateEventAvailability = (eventId, userId, status) => {
  return async dispatch => {
    try {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      const response = await fetch(
        `http://${environmentUrl}/api/events/updateAvailability`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            eventId,
            userId,
            status: status.toLowerCase()
          }),
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error('Something went wrong getEventsonDate!');
      }

      const resData = await response.json();
      const event = resData.event;
      dispatch({
        type: UPDATE_AVAILABILITY,
        event
      })

    } catch (err) {
      console.log(err);
    }
  }
}

export const createEvent = eventData => {
  return async dispatch => {
    try {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      if (!authToken) {
        throw new Error('No token set');
      }
      const response = await fetch(
        `http://${environmentUrl}/api/events/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': `Bearer ${authToken}`,
          },
          body: JSON.stringify(eventData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const resData = await response.json();
      const event = resData.event;

      dispatch({
        type: ADD_EVENT,
        event: event,
      });
    } catch (err) {
      console.log('err<>', err);

      if (err && err.errors && err.errors.length > 0) {
        throw err.errors;
      }
    }
  };
};

export const deleteEvent = id => {
  return async dispatch => {
    try {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      const response = await fetch(
        `http://${environmentUrl}/api/events/${id}/delete`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token': `Bearer ${authToken}`,
          },
          body: null,
        },
      );

      if (!response.ok) {
        console.log(response);
        throw new Error('Something went wrong getEventsonDate!');
      }

      const resData = await response.json();

      dispatch({
        type: DELETE_EVENT,
        eventId: id,
      })

    } catch (err) {
      console.log(err);
    }
  }
};

export const updateEvent = eventData => {
  return async dispatch => {
    try {
      let authToken = await AsyncStorage.getItem(CONST.AUTH_TOKEN_KEY);

      if (!authToken) {
        throw new Error('No token set');
      }
      const response = await fetch(
        `http://${environmentUrl}/api/events/${eventData.id}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': `Bearer ${authToken}`,
          },
          body: JSON.stringify(eventData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const resData = await response.json();
      const event = resData.event;
      dispatch({
        type: EDIT_EVENT,
        eventId: eventData.id,
        event: event,
      });
    } catch (err) {
      console.log('err<>', err);

      if (err && err.errors && err.errors.length > 0) {
        throw err.errors;
      }
    }
  };
}