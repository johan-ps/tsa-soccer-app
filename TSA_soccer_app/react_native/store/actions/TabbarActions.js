export const UPDATE_TABBAR_VISIBLE = 'UPDATE_TABBAR_VISIBLE';

export const updateVisibility = visible => {
  return {
    type: UPDATE_TABBAR_VISIBLE,
    visible,
  };
};
