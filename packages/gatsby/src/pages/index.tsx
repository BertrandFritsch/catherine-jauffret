import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { HomepageQuery } from '../../graphqlTypes';
import Img from 'gatsby-image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import SEO from '../components/seo';
import { ANNU } from '../helpers';

import * as indexStyles from './index.module.scss';

export default function IndexPage() {
  const data = useStaticQuery<HomepageQuery>(graphql`
    query Homepage {
      contentfulHomepage {
        image {
          localFile {
            childImageSharp {
              fixed(width: 320) {
                ...GatsbyImageSharpFixed_withWebp
              }
            }
          }
        }
        text { raw }
        author
      }
    }
  `);

  ANNU(data.contentfulHomepage);
  ANNU(data.contentfulHomepage.image?.localFile?.childImageSharp?.fixed);

  return (
    <>
      <SEO title='Accueil' />
      <section className={ indexStyles.section }>
        <Img className={ indexStyles.imagePlaceholder }
             fixed={ data.contentfulHomepage.image.localFile.childImageSharp.fixed }
        />
        { data.contentfulHomepage.text?.raw && documentToReactComponents(JSON.parse(data.contentfulHomepage.text.raw)) }
        <h5>{ data.contentfulHomepage.author }</h5>
      </section>
    </>
  );
};
