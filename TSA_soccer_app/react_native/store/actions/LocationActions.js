import { dispatchAndHandleError } from '../../Util/error-handling';

export const GET_LOCATIONS = 'GET_LOCATIONS';
export const CREATE_LOCATION = 'CREATE_LOCATION';

export const getLocations = () => {
  const url = 'locations';
  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const auth = false;
  const config = resData => ({
    type: GET_LOCATIONS,
    locations: resData.locations,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};

export const createLocation = locationData => {
  const url = 'locations/create';
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(locationData),
  };
  const auth = true;
  const config = resData => ({
    type: CREATE_LOCATION,
    location: resData.location,
  });

  return dispatchAndHandleError(url, payload, auth, config);
};
