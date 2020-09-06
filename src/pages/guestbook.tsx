import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { faExternalLinkAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GuestbookQuery } from '../../graphqlTypes';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { NNU } from '../helpers';

import * as styles from './guestbook.module.scss';

export default function Collages() {
  const data = useStaticQuery<GuestbookQuery>(graphql`
    query Guestbook {
      allContentfulGuestbook(
        sort: { fields: date, order: DESC }
      ) {
        nodes {
          name
          date
          website
          comment { json }
        }
      }
    }
  `);

  return (
    <Layout>
      <SEO title="Livre d'Or" />
        <section className={ styles.container }>
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
                  <span className={ styles.date }>{ new Date(node.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }</span>
                  <div className={ styles.comment }>
                    { documentToReactComponents(NNU(node.comment).json) }
                  </div>
                </section>
            )
          }
        </section>
    </Layout>
  );
}
