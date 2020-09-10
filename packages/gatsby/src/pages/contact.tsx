import { Button, MuiThemeProvider, TextField } from '@material-ui/core';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { CachePolicies, useFetch } from 'use-http';
import Layout from '../components/layout';
import SEO from '../components/seo';
import SmallTextField from '../components/smallTextField';
import { theme } from '../components/theme';
import { isEmailValid, makeURLEncodedData } from '../helpers';

import * as styles from '../components/form.module.scss';

interface Record {
  name: string;
  email: string;
  confirmationEmail: string;
  message: string;
}

function validateEmail(value: string) {
  return value && !isEmailValid(value) ? 'L\'adresse de messagerie n\'est pas correcte' : undefined;
}

function validateConfirmationEmail(value: string, record: Partial<Record>) {
  const email = record.email?.trim();

  return value && email !== value ? 'Les adresses de messagerie ne correspondent pas' : undefined;
}

function validate(record: Partial<Record>) {
  const name = record.name?.trim();
  const email = record.email?.trim();
  const confirmationEmail = record.confirmationEmail?.trim();
  const message = record.message?.trim();
  const errors = {
    name: !name ? 'Laissez-moi votre nom' : undefined,
    email: !email ? 'Laissez-moi votre adresse de messagerie' : validateEmail(email),
    confirmationEmail: !confirmationEmail
                       ? 'Veuillez confirmer votre adresse de messagerie'
                       : validateConfirmationEmail(confirmationEmail, record),
    message: !message ? 'Laissez-moi un message' : undefined
  };

  return Object.values(errors).some(e => e !== undefined) ? errors : undefined;
}

const formVariants: Variants = {
  hidden: {
    opacity: 0,
    pointerEvents: 'none'
  },
  visible: {
    opacity: 1,
    pointerEvents: 'auto'
  }
};

const titleVariants: Variants = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: .8
    }
  },
  exit: {
    opacity: 0
  }
};

export default function Contact() {
  const { loading: messageLoading, error: messageError, post: sendMessage } = useFetch({
    cachePolicy: CachePolicies.NO_CACHE,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      method: 'POST'
    }
  });

  const submit = React.useMemo(
    () =>
      (record: Record) => {
        const errors = validate(record);
        if (errors) {
          return errors;
        }

        return sendMessage('/contact', makeURLEncodedData({ ...record, 'form-name': 'contact' }));
      }
    , []
  );

  const submittedStatus = React.useRef<'NONE' | 'SUBMITTING' | 'SUBMITTING_ERROR' | 'SUBMITTED'>('NONE');
  switch (submittedStatus.current) {
    case 'NONE':
      if (messageLoading) {
        submittedStatus.current = 'SUBMITTING';
      }
      break;

    case 'SUBMITTING':
      if (messageError) {
        submittedStatus.current = 'SUBMITTING_ERROR';
      }
      else if (!messageLoading) {
        submittedStatus.current = 'SUBMITTED';
      }
      break;
  }

  return (
    <Layout>
      <SEO title='Contact' />
      <section className={ styles.section }>
        <AnimatePresence initial={ false } exitBeforeEnter>
          <motion.p initial='initial' animate='visible' exit='exit' className={ styles.submittedStateMessage }>
            {
              submittedStatus.current === 'SUBMITTING' &&
              <motion.span variants={ titleVariants }>Le message est en cours d'envoi...</motion.span>
            }
            {
              submittedStatus.current === 'SUBMITTING_ERROR' &&
              <motion.span variants={ titleVariants } style={ { color: theme.palette.error.main } }>Le message n'a malheureusement pas pu être envoyé.<br />Vous pouvez réessayer plus tard.</motion.span>
            }
            {
              submittedStatus.current === 'SUBMITTED' &&
              <motion.span variants={ titleVariants }>Merci pour votre message.<br />Je vous répondrai dès que possible.</motion.span>
            }
          </motion.p>
        </AnimatePresence>
        <MuiThemeProvider theme={ theme }>
          <Form<Record> onSubmit={ submit }>
            {
              ({ handleSubmit, values }) =>
                <motion.form className={ styles.form } variants={ formVariants } animate={ submittedStatus.current === 'NONE' ? 'visible' : 'hidden' } onSubmit={ handleSubmit } name='contact' data-netlify='true' netlify-honeypot='bot-field'>
                  <span>Laissez-moi votre message et vos coordonnées et je vous répondrai dès que possible</span>
                  <Field<string> name='name'>
                    {
                      ({ input, meta }) =>
                        <SmallTextField label='Votre nom' { ...input } autoFocus showIcon={ false } errorText={ !meta.dirtySinceLastSubmit ? meta.submitError : undefined }
                                        errorType='SubmitError' />
                    }
                  </Field>
                  <Field<string> name='email'>
                    {
                      ({ input, meta }) => {
                        const value = input.value.trim();
                        const errorText = !meta.dirtySinceLastSubmit && meta.submitError || validateEmail(value);
                        return (
                          <SmallTextField label='Votre adresse de messagerie' { ...input } showIcon={ !!value } errorText={ errorText }
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
                          <SmallTextField label='Confirmez l&apos;adresse de messagerie' { ...input } autoComplete='off'
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
                  <input name='bot-field' hidden />
                  <Button type='submit' variant='contained'>
                    <span>Envoyer</span>
                  </Button>
                </motion.form>
            }
          </Form>
        </MuiThemeProvider>
      </section>
    </Layout>
  );
}

