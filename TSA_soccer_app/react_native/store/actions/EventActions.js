import { dispatchAndHandleError } from '../../Util/error-handling';

export const GET_EVENTS = 'GET_EVENTS';
export const GET_EVENT_BY_ID = 'GET_EVENT_BY_ID';
export const ADD_EVENT = 'ADD_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';
export const EDIT_EVENT = 'EDIT_EVENT';
export const UPDATE_AVAILABILITY = 'UPDATE_AVAILABILITY';
export const GET_EVENTS_TODAY = 'GET_EVENTS_TODAY';
export const GET_EVENT_DATES = 'GET_EVENT_DATES';

export const getEvents = () => {
  const url = 'events';
  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = false;
  const config = resData => ({
    type: GET_EVENTS,
    events: resData.events,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const getEventById = id => {
  const url = `events/${id}/details`;
  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = false;
  const config = resData => ({
    type: GET_EVENT_BY_ID,
    event: { event: resData.event, availabilities: resData.availabilities },
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const getEventsOnDate = (date, userId) => {
  const url = `events/date?date=${date}&userId=${userId}`;
  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = false;
  const config = resData => ({
    type: GET_EVENTS_TODAY,
    events: resData.events,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const getEventsFromDate = (date, userId, teamId) => {
  const url = `events/startingFrom/?date=${date}&userId=${userId}&teamId=${teamId}`;
  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = false;
  const config = resData => ({
    type: GET_EVENTS,
    events: resData.events,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const getEventDatesByMonth = (startOfMonth, endOfMonth) => {
  const url = `events/month/?startOfMonth=${startOfMonth}&endOfMonth=${endOfMonth}`;
  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = false;
  const config = resData => ({
    type: GET_EVENT_DATES,
    dates: resData.dates,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const updateEventAvailability = (eventId, userId, status) => {
  const url = 'events/updateAvailability';
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventId,
      userId,
      status: status.toLowerCase(),
    }),
  };
  const auth = true;
  const config = resData => ({
    type: UPDATE_AVAILABILITY,
    event: resData.event,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const createEvent = eventData => {
  const url = 'events/create';
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  };
  const auth = true;
  const config = resData => ({
    type: ADD_EVENT,
    event: resData.event,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const deleteEvent = id => {
  const url = `events/${id}/delete`;
  const payload = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: null,
  };
  const auth = true;
  const config = resData => ({
    type: DELETE_EVENT,
    eventId: id,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const updateEvent = eventData => {
  const url = `events/${eventData.id}/update`;
  const payload = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  };
  const auth = true;
  const config = resData => ({
    type: EDIT_EVENT,
    eventId: eventData.id,
    event: resData.event,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};
