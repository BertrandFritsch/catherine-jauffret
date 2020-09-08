import { createMuiTheme } from '@material-ui/core';
import variables from './variables.module.scss';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: variables.textColor
    },
    error: {
      main: variables.highlightColor
    }
  },
  typography: {
    fontFamily: 'inherit'
  }
});
