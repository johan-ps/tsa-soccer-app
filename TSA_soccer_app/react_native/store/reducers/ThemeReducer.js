import { UPDATE_THEME } from '../actions/ThemeActions';
import ColorThemes from '../../constants/ColorThemes';

const INITIAL_STATE = {
  activeTheme: 'default',
  possible: ['default', 'dark', 'darkPlus'],
  colors: ColorThemes.default,
};

const themeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_THEME:
      const { activeTheme, possible } = state;
      if (activeTheme === action.theme) {
        return state;
      } else {
        const newActiveTheme = action.theme;
        const colors = ColorThemes[newActiveTheme];
        const newState = { activeTheme: newActiveTheme, possible, colors };
        return newState;
      }
    default:
      return state;
  }
};

export default themeReducer;
