import { UPDATE_TABBAR_VISIBLE } from '../actions/TabbarActions';

const INITIAL_STATE = {
  visible: true,
};

const tabbarReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_TABBAR_VISIBLE:
      return { visible: action.visible };
    default:
      return state;
  }
};

export default tabbarReducer;
