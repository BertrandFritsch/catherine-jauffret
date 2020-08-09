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
    contentfulCollage(slug: { eq: $slug}) {
      title
      tags
      date
      collage {
        localFile {
          childImageSharp {
            fluid(quality: 100){
              ...GatsbyImageSharpFluid_withWebp
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

  return (
    <Layout>
      <SEO title={ data.contentfulCollage.title } />
        <section>
          <h2>{ data.contentfulCollage.title }</h2>
          <Img className={ collageStyles.collagePlaceholder }
               fluid={ data.contentfulCollage.collage.localFile.childImageSharp.fluid }
          />
          <div>
            <span>{
              data.contentfulCollage.tags.trim().split(/\s+/).map(
                tag => (
                  <span key={ tag } className={ collageStyles.tag }>{ tag }</span>
                )
              )
            }</span>
            <span>{ new Date(data.contentfulCollage.date).toLocaleDateString() }</span>
          </div>
        </section>
    </Layout>
  );
}
