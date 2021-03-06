import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { CvQuery } from '../../graphqlTypes';
import Img from 'gatsby-image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import SEO from '../components/seo';
import { ANNU } from '../helpers';

import * as indexStyles from './index.module.scss';

export default function IndexPage() {
  const data = useStaticQuery<CvQuery>(graphql`
    query CV {
      contentfulCv {
        title
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

  ANNU(data.contentfulCv);
  ANNU(data.contentfulCv.image?.localFile?.childImageSharp?.fixed);

  return (
    <>
      <SEO title='CV' />
      <section className={ indexStyles.section }>
        <Img className={ indexStyles.imagePlaceholder }
             fixed={ data.contentfulCv.image.localFile.childImageSharp.fixed }
        />
        <h2>{ data.contentfulCv.title }</h2>
        { data.contentfulCv.text?.raw && documentToReactComponents(JSON.parse(data.contentfulCv.text.raw)) }
        <h5>{ data.contentfulCv.author }</h5>
      </section>
    </>
  );
};
