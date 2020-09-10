import { Button, TextField } from '@material-ui/core';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import * as React from 'react';
import { Field, Form } from 'react-final-form';
import { CachePolicies, useFetch } from 'use-http';
import { isEmailValid, isURLValid, makeURLEncodedData } from '../helpers';
import SmallTextField from './smallTextField';
import { theme } from './theme';

import * as styles from '../components/form.module.scss';

interface Props {
  isFormDisplayed: boolean;
}

interface Record {
  name: string;
  email: string;
  website: string | null;
  message: string;
}

function validateEmail(value: string) {
  return value && !isEmailValid(value) ? 'L\'adresse de messagerie n\'est pas correcte' : undefined;
}

function validateURL(value: string | null) {
  return value && !isURLValid(value) ? 'L\'URL du site web n\'est pas correcte' : undefined;
}

function validate(record: Partial<Record>) {
  const name = record.name?.trim();
  const email = record.email?.trim();
  const website = record.website?.trim();
  const message = record.message?.trim();
  const errors = {
    name: !name ? 'Laissez-moi votre nom' : undefined,
    email: !email ? 'Laissez-moi votre adresse de messagerie' : validateEmail(email),
    website: website && validateURL(website),
    message: !message ? 'Laissez-moi un message' : undefined
  };

  return Object.values(errors).some(e => e !== undefined) ? errors : undefined;
}

const formVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    pointerEvents: 'none'
  },
  visible: {
    opacity: 1,
    height: 'auto',
    pointerEvents: 'auto'
  }
};

const titleVariants: Variants = {
  initial: {
    opacity: 0
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

export default function GuestbookForm({ isFormDisplayed }: Props) {
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

        return sendMessage('/guestbook', makeURLEncodedData({ ...record, 'form-name': 'guestbook' }));
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
    <section className={ styles.section }>
      <AnimatePresence initial={ false } exitBeforeEnter>
        <motion.p variants={ titleVariants } initial='initial' animate='visible' exit='exit' className={ styles.submittedStateMessage }>
          {
            submittedStatus.current === 'SUBMITTING' &&
            <motion.span>Le message est en cours d'envoi...</motion.span>
          }
          {
            submittedStatus.current === 'SUBMITTING_ERROR' &&
            <motion.span style={ { color: theme.palette.error.main } }>Le message n'a malheureusement pas pu être envoyé.<br />Vous pouvez réessayer plus tard.</motion.span>
          }
          {
            submittedStatus.current === 'SUBMITTED' &&
            <motion.span>Merci pour votre message.<br />Je le mettrai en ligne dès que possible.</motion.span>
          }
        </motion.p>
      </AnimatePresence>
      <Form<Record> onSubmit={ submit }>
        {
          ({ handleSubmit }) =>
            <motion.form className={ styles.form } variants={ formVariants } animate={ submittedStatus.current === 'NONE' ? 'visible' : 'hidden' } onSubmit={ handleSubmit } name='guestbook' data-netlify='true' netlify-honeypot='bot-field'>
              <Field<string> name='name'>
                {
                  ({ input, meta }) =>
                    <SmallTextField label='Votre nom' { ...input } setInputFocus={ isFormDisplayed } showIcon={ false } errorText={ !meta.dirtySinceLastSubmit ? meta.submitError : undefined }
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
              <Field<string> name='website'>
                {
                  ({ input, meta }) => {
                    const value = input.value.trim();
                    const errorText = !meta.dirtySinceLastSubmit && meta.submitError || validateURL(value);
                    return (
                      <SmallTextField label='Votre site web (le cas échéant)' { ...input } showIcon={ !!value } errorText={ errorText }
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
    </section>
  );
}
