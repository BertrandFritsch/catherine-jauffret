import { FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput, OutlinedInputProps, Tooltip, useTheme } from '@material-ui/core';
import { Done, Error } from '@material-ui/icons';
import * as React from 'react';

import * as styles from './smallTextField.module.scss';

interface SmallTextFieldProps extends OutlinedInputProps {
  errorText?: string;
  errorType?: 'SubmitError' | 'HintError';
  showIcon: boolean;
}

export default function SmallTextField({ error, errorText, errorType, showIcon, ...props }: SmallTextFieldProps) {
  const theme = useTheme();

  return (
    <FormControl variant="outlined" error={ errorText !== undefined && errorType === 'SubmitError' } className={ styles.smallFieldRoot }>
      <InputLabel>{ props.label }</InputLabel>
      <OutlinedInput
        type='text'
        className={ styles.smallField }
        { ...props }
        endAdornment={
          showIcon &&
          <InputAdornment position="end">
            {
              errorText !== undefined
              ? <Tooltip title={ errorText }><Error color='error' /></Tooltip>
              : <Done style={ { color: theme.palette.success[ theme.palette.type ] } } />
            }
          </InputAdornment>
        }
      />
      {
        errorText !== undefined && errorType === 'SubmitError' &&
        <FormHelperText>{ errorText }</FormHelperText>
      }
    </FormControl>
  );
};
