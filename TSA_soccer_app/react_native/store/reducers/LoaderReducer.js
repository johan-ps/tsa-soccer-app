import { UPDATE_LOADER } from '../actions/LoaderActions';

const INITIAL_STATE = {
  visible: false,
};

const loaderReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_LOADER:
      return { visible: action.visible };
    default:
      return state;
  }
};

export default loaderReducer;
