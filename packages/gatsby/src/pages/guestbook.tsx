import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { faExternalLinkAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GuestbookQuery } from '../../graphqlTypes';
import SEO from '../components/seo';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Button, ThemeProvider, StyledEngineProvider } from '@mui/material';
import GuestbookForm from '../components/guestbookForm';
import { theme } from '../components/theme';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import * as styles from './guestbook.module.scss';

const formVariants: Variants = {
  hidden: {
    height: 0
  },

  visible: {
    height: 'auto',
    transition: {
      type: 'just'
    }
  }
};

const buttonVariants: Variants = {
  hidden: {
    height: 0,
    transition: {
      type: 'just'
    }
  },

  visible: {
    height: 'auto'
  }
};

export default function Guestbook() {
  const data = useStaticQuery<GuestbookQuery>(graphql`
    query Guestbook {
      allContentfulGuestbook(
        sort: { fields: date, order: DESC }
      ) {
        nodes {
          name
          date
          website
          comment { raw }
        }
      }
    }
  `);

  const [ displayForm, setDisplayForm ] = React.useState(false);

  return <>
    <SEO title="Livre d'Or" />
    <section className={ styles.container }>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={ theme }>
          <motion.section className={ styles.formSection } variants={ formVariants } initial='hidden' animate={ displayForm ? 'visible' : 'hidden' }>
            <GuestbookForm isFormDisplayed={ displayForm } />
          </motion.section>
          <AnimatePresence>
            {
              !displayForm &&
              <motion.section className={ styles.messageButton } variants={ buttonVariants } initial={ false } animate='visible' exit='hidden'>
                <Button variant='contained' onClick={ () => setDisplayForm(true) }>
                  <span>Laisser un message</span>
                </Button>
              </motion.section>
            }
          </AnimatePresence>
          <section className={ styles.book }>
            {
              data.allContentfulGuestbook.nodes.map(
                (node, i) =>
                  <section key={ i } className={ styles.card }>
                    <FontAwesomeIcon className={ styles.icon } icon={ faUser } />
                    <h2 className={ styles.name }>
                      { node.name }
                      {
                        node.website &&
                        <a className={ styles.website } href={ node.website }><FontAwesomeIcon icon={ faExternalLinkAlt } /></a>
                      }
                    </h2>
                    <span className={ styles.date }>{ new Date(node.date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) }</span>
                    <div className={ styles.comment }>
                      { node.comment?.raw && documentToReactComponents(JSON.parse(node.comment.raw)) }
                    </div>
                  </section>
              )
            }
          </section>
          <AnimatePresence>
            {
              !displayForm &&
              <motion.section className={ styles.messageButton } variants={ buttonVariants } initial={ false } animate='visible' exit='hidden'>
                <Button variant='contained' onClick={ () => setDisplayForm(true) }>
                  <span>Laisser un message</span>
                </Button>
              </motion.section>
            }
          </AnimatePresence>
        </ThemeProvider>
      </StyledEngineProvider>
    </section>
  </>;
}
