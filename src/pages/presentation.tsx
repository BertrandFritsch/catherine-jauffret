import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { PresentationQuery } from '../../graphqlTypes';
import Img from 'gatsby-image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { ANNU } from '../helpers';

import * as indexStyles from './index.module.scss';

export default function IndexPage() {
  const data = useStaticQuery<PresentationQuery>(graphql`
    query Presentation {
      contentfulPresentation {
        title
        image {
          localFile {
            childImageSharp {
              fixed(width: 302, quality: 100){
                ...GatsbyImageSharpFixed_withWebp
              }
            }
          }
        }
        text { json }
        author
      }
    }
  `);

  ANNU(data.contentfulPresentation);
  ANNU(data.contentfulPresentation.image?.localFile?.childImageSharp?.fixed);

  return (
    <Layout>
      <SEO title='Présentation' />
      <section className={ indexStyles.section }>
        <Img className={ indexStyles.imagePlaceholder }
             fixed={ data.contentfulPresentation.image.localFile.childImageSharp.fixed }
        />
        <h2>{ data.contentfulPresentation.title }</h2>
        { documentToReactComponents(data.contentfulPresentation.text?.json) }
        <h5>{ data.contentfulPresentation.author }</h5>
      </section>
    </Layout>
  );
};
