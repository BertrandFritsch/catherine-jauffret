import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { HomepageQuery } from '../../graphqlTypes';
import { GatsbyImage } from 'gatsby-plugin-image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import SEO from '../components/seo';
import { ANNU, NNU } from '../helpers';

import * as indexStyles from './index.module.scss';

export default function IndexPage() {
  const data = useStaticQuery<HomepageQuery>(graphql`query Homepage {
  contentfulHomepage {
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

  ANNU(data.contentfulHomepage);
  ANNU(data.contentfulHomepage.image?.localFile?.childImageSharp?.gatsbyImageData);

  return <>
    <SEO title='Accueil' />
    <section className={ indexStyles.section }>
      <GatsbyImage
        alt={NNU(data.contentfulHomepage.image?.title)}
        image={NNU(data.contentfulHomepage.image?.localFile?.childImageSharp?.gatsbyImageData)}
        className={ indexStyles.imagePlaceholder } />
      { data.contentfulHomepage.text?.raw && documentToReactComponents(JSON.parse(data.contentfulHomepage.text.raw)) }
      <h5>{ data.contentfulHomepage.author }</h5>
    </section>
  </>;
};
