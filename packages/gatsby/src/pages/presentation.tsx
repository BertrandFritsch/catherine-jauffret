import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { PresentationQuery } from '../../graphqlTypes';
import { GatsbyImage } from 'gatsby-plugin-image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { ANNU, NNU } from '../helpers';

import SEO from '../components/seo';

import * as indexStyles from './index.module.scss';

export default function IndexPage() {
  const data = useStaticQuery<PresentationQuery>(graphql`query Presentation {
  contentfulPresentation {
    title
    image {
      title
      localFile {
        childImageSharp {
          gatsbyImageData(width: 302, layout: FIXED)
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

  ANNU(data.contentfulPresentation);

  return (
    <>
      <SEO title='Présentation' />
      <section className={ indexStyles.section }>
        <GatsbyImage
          alt={NNU(data.contentfulPresentation.image?.title)}
          image={data.contentfulPresentation.image?.localFile?.childImageSharp?.gatsbyImageData}
          className={ indexStyles.imagePlaceholder } />
        <h2>{ data.contentfulPresentation.title }</h2>
        { data.contentfulPresentation.text?.raw && documentToReactComponents(JSON.parse(data.contentfulPresentation.text.raw)) }
        <h5>{ data.contentfulPresentation.author }</h5>
      </section>
    </>
  );
};
