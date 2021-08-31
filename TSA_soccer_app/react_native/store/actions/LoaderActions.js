export const UPDATE_LOADER = 'UPDATE_LOADER';

export const updateLoader = visible => {
  return {
    type: UPDATE_LOADER,
    visible,
  };
};
