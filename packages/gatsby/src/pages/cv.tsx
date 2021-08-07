import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { CvQuery } from '../../graphqlTypes';
import { GatsbyImage } from 'gatsby-plugin-image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import SEO from '../components/seo';
import { ANNU, NNU } from '../helpers';

import * as indexStyles from './index.module.scss';

export default function IndexPage() {
  const data = useStaticQuery<CvQuery>(graphql`query CV {
  contentfulCv {
    title
    image {
      title
      localFile {
        childImageSharp {
          gatsbyImageData(width: 320, layout: FIXED)
        }
      }
    }
    text {
      raw
    }
    author
  }
}
`);

  ANNU(data.contentfulCv);
  ANNU(data.contentfulCv.image?.localFile?.childImageSharp?.gatsbyImageData);

  return <>
    <SEO title='CV' />
    <section className={ indexStyles.section }>
      <GatsbyImage
        alt={NNU(data.contentfulCv.image?.title)}
        image={NNU(data.contentfulCv.image?.localFile?.childImageSharp?.gatsbyImageData)}
        className={ indexStyles.imagePlaceholder } />
      <h2>{ data.contentfulCv.title }</h2>
      { data.contentfulCv.text?.raw && documentToReactComponents(JSON.parse(data.contentfulCv.text.raw)) }
      <h5>{ data.contentfulCv.author }</h5>
    </section>
  </>;
};
