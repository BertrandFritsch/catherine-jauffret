import { createTheme } from '@material-ui/core';
import * as variables from './variables.module.scss';

export const theme = createTheme({
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
