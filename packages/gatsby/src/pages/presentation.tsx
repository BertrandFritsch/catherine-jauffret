import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { PresentationQuery } from '../../graphqlTypes';
import Img from 'gatsby-image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

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
              fixed(width: 302) {
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

  ANNU(data.contentfulPresentation);
  ANNU(data.contentfulPresentation.image?.localFile?.childImageSharp?.fixed);

  return (
    <>
      <SEO title='Présentation' />
      <section className={ indexStyles.section }>
        <Img className={ indexStyles.imagePlaceholder }
             fixed={ data.contentfulPresentation.image.localFile.childImageSharp.fixed }
        />
        <h2>{ data.contentfulPresentation.title }</h2>
        { data.contentfulPresentation.text?.raw && documentToReactComponents(JSON.parse(data.contentfulPresentation.text.raw)) }
        <h5>{ data.contentfulPresentation.author }</h5>
      </section>
    </>
  );
};
