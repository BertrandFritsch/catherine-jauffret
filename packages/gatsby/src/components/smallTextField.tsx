import { FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput, OutlinedInputProps, Tooltip, useTheme } from '@mui/material';
import { Done, Error } from '@mui/icons-material';
import * as React from 'react';
import { NNU } from '../helpers';

import * as styles from './smallTextField.module.scss';

interface SmallTextFieldProps extends OutlinedInputProps {
  errorText?: string;
  errorType?: 'SubmitError' | 'HintError';
  showIcon: boolean;
  setInputFocus: boolean;
}

const defaultProps: Partial<SmallTextFieldProps> = {
  setInputFocus: false
};

export default function SmallTextField({ error, errorText, errorType, showIcon, setInputFocus, ...props }: SmallTextFieldProps) {
  const theme = useTheme();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(
    () => {
      if (setInputFocus) {
        NNU(inputRef.current).focus();
      }
    },
    [ setInputFocus ]
  )

  return (
    <FormControl error={ errorText !== undefined && errorType === 'SubmitError' }>
      <InputLabel>{ props.label }</InputLabel>
      <OutlinedInput
        inputRef={ inputRef }
        type='text'
        className={ styles.smallField }
        { ...props }
        endAdornment={
          showIcon &&
          <InputAdornment position="end">
            {
              errorText !== undefined
              ? <Tooltip title={ errorText }><Error color='error' /></Tooltip>
              : <Done style={ { color: theme.palette.success[ theme.palette.mode ] } } />
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

SmallTextField.defaultProps = defaultProps;
