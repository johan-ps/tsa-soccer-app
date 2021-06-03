export const UPDATE_THEME = 'UPDATE_THEME';

export const updateTheme = theme => {
  return {
    type: UPDATE_THEME,
    theme,
  };
};
