import * as React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { createMuiTheme, TextField, MuiThemeProvider, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, OutlinedInputProps, FormHelperText, Tooltip, useTheme } from '@material-ui/core';
import { Done, Error } from '@material-ui/icons';
import { Field, Form } from 'react-final-form';
import { isEmailValid } from '../helpers';

import * as styles from './contact.module.scss';
import variables from '../components/variables.module.scss';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: variables.textColor
    }
  },
  typography: {
    fontFamily: 'inherit'
  }
});

interface Record {
  name: string;
  email: string;
  confirmationEmail: string;
  message: string;
}

function validateEmail(value: string) {
  return value && !isEmailValid(value) ? 'L`adresse e-mail n\'est pas correcte' : undefined;
}

function validateConfirmationEmail(value: string, record: Partial<Record>) {
  const email = record.email?.trim();

  return value && email !== value ? 'Les adresses e-mail ne correspondent pas' : undefined;
}

function validate(record: Partial<Record>) {
  const name = record.name?.trim();
  const email = record.email?.trim();
  const confirmationEmail = record.confirmationEmail?.trim();
  const message = record.message?.trim();
  return {
    name: !name ? 'Veuillez saisir votre nom' : undefined,
    email: !email ? 'Veuillez saisir votre adresse e-mail' : validateEmail(email),
    confirmationEmail: !confirmationEmail
                       ? 'Veuillez confirmer votre adresse e-mail'
                       : validateConfirmationEmail(confirmationEmail, record),
    message: !message ? 'Laissez-moi un message' : undefined
  };
}

function submit(record: Partial<Record>) {
  const errors = validate(record);
  if (errors) {
    return errors;
  }
}

interface SmallTextFieldProps extends OutlinedInputProps {
  errorText?: string;
  errorType?: 'SubmitError' | 'HintError';
  showIcon: boolean;
}

const SmallTextField = ({ error, errorText, errorType, showIcon, ...props }: SmallTextFieldProps) => {
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

export default function Contact() {
  return (
    <Layout>
      <SEO title='Contact' />
      <section className={ styles.section }>
        <p className={ styles.title }>Laissez-moi votre message et vos coordonnées et je vous répondrai dès que possible</p>
        <MuiThemeProvider theme={ darkTheme }>
          <Form<Record> onSubmit={ submit }>
            {
              ({ handleSubmit, values }) =>
                <form className={ styles.form } onSubmit={ handleSubmit } name='contact' data-netlify='true'>
                  <Field<string> name='name'>
                    {
                      ({ input, meta }) =>
                        <SmallTextField label='Votre nom' { ...input } autoFocus showIcon={ false } errorText={ !meta.dirtySinceLastSubmit ? meta.submitError : undefined } errorType='SubmitError' />
                    }
                  </Field>
                  <Field<string> name='email'>
                    {
                      ({ input, meta }) => {
                        const value = input.value.trim();
                        const errorText = !meta.dirtySinceLastSubmit && meta.submitError || validateEmail(value);
                        return (
                          <SmallTextField label='Votre adresse e-mail' { ...input } showIcon={ !!value } errorText={ errorText }
                                          errorType={ !meta.dirtySinceLastSubmit && meta.submitError ? 'SubmitError' : 'HintError' } />
                        );
                      }
                    }
                  </Field>
                  <Field<string> name='confirmationEmail'>
                    {
                      ({ input, meta }) => {
                        const value = input.value.trim();
                        const errorText = !meta.dirtySinceLastSubmit && meta.submitError || validateConfirmationEmail(value, values);
                        return (
                          <SmallTextField label='Confirmez l&apos;adresse e-mail' { ...input } autoComplete='off'
                                          showIcon={ !!value }
                                          errorText={ errorText }
                                          errorType={ !meta.dirtySinceLastSubmit && meta.submitError ? 'SubmitError' : 'HintError' } />
                        );
                      }
                    }
                  </Field>
                  <Field<string> name='message'>
                    {
                      ({ input, meta }) =>
                        <TextField className={ styles.message } variant='outlined' label='Votre message' { ...input } multiline rows={ 10 }
                                   error={ !meta.dirtySinceLastSubmit && meta.submitError !== undefined }
                                   helperText={ meta.submitError } />
                    }
                  </Field>
                  <Button type='submit' variant='contained'>Envoyer</Button>
                </form>
            }
          </Form>
        </MuiThemeProvider>
      </section>
    </Layout>
  );
}

