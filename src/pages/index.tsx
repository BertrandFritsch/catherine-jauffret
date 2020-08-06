import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { HomepageQuery } from '../../graphqlTypes';
import Img from 'gatsby-image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { ANNU } from '../helpers';

import * as indexStyles from './index.module.scss';

export default function IndexPage() {
  const data = useStaticQuery<HomepageQuery>(graphql`
    query Homepage {
      contentfulHomepage {
        title
        image {
          localFile {
            childImageSharp {
              fluid(maxWidth: 500){
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
        text { json }
        author
      }
    }
  `);

  ANNU(data.contentfulHomepage);
  ANNU(data.contentfulHomepage.image?.localFile?.childImageSharp?.fluid);

  return (
    <Layout>
      <SEO title='Accueil' />
      <section className={ indexStyles.section }>
        <Img className={ indexStyles.imagePlaceholder }
             fluid={ data.contentfulHomepage.image.localFile.childImageSharp.fluid }
        />
        <h2>{ data.contentfulHomepage.title }</h2>
        { documentToReactComponents(data.contentfulHomepage.text?.json) }
        <h5>{ data.contentfulHomepage.author }</h5>
      </section>
    </Layout>
  );
};
