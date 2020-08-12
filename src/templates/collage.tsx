import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import * as React from 'react';
import { CollageQuery } from '../../graphqlTypes';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { ANNU } from '../helpers';

import * as collageStyles from './collage.module.scss';

export const query = graphql`
  query Collage($slug: String!) {
    contentfulCollage(slug: { eq: $slug }) {
      title
      tags
      date
      collage {
        localFile {
          childImageSharp {
            fluid(maxWidth: 1920, sizes: "(max-width: 1920px) 100vw, 1920px", quality: 100) {
              ...GatsbyImageSharpFluid_withWebp
              ...GatsbyImageSharpFluidLimitPresentationSize
            }
          }
        }
      }
    }
  }
`;

interface Props {
  data: CollageQuery;
}

export default function Collage({ data }: Props) {
  ANNU(data.contentfulCollage?.collage?.localFile?.childImageSharp?.fluid);
  ANNU(data.contentfulCollage?.tags);

  const collageDetails = (
    <h2>{ data.contentfulCollage.title }</h2>
  );

  return (
    <Layout overlay additionalOverlayContent={ collageDetails }>
      <SEO title={ data.contentfulCollage.title } />
      <section className={ collageStyles.section }>
        <Img fluid={ data.contentfulCollage.collage.localFile.childImageSharp.fluid }
             style={ { flex: 'auto', maxHeight: '100%' } }
             imgStyle={ { objectFit: 'contain' } }
        />
      </section>
    </Layout>
  );
}
