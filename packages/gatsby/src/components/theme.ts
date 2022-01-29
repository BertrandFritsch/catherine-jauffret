import { createTheme } from '@mui/material';
import * as variables from './variables.module.scss';

export const theme = createTheme({
  palette: {
    mode: 'dark',
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
