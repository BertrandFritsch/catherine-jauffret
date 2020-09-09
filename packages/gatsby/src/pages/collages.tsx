import { graphql, Link, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { CollagesQuery } from '../../graphqlTypes';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Img from 'gatsby-image';
import { NNU } from '../helpers';

import * as collagesStyles from './collages.module.scss';

export default function Collages() {
  const data = useStaticQuery<CollagesQuery>(graphql`
    query Collages {
      allContentfulCollage(
        sort: { fields: date, order: DESC }
      ) {
        nodes {
          slug
          title
          date
          collage {
            localFile {
              childImageSharp {
                fixed(width: 320) {
                  ...GatsbyImageSharpFixed_withWebp
                }
              }
            }
          }
        }
      }
    }
  `);

  const groups = Object.entries(
    data.allContentfulCollage.nodes.reduce<{ [ year: number ]: CollagesQuery[ 'allContentfulCollage' ][ 'nodes' ] }>(
      (acc, node) => {
        const year = new Date(node.date).getFullYear();
        const nodes = acc[ year ] || [];
        acc[ year ] = [ ...nodes, node ];
        return acc;
      },
      {}
    )
  ).map(([ year, nodes ]) => ({ year, nodes }));

  groups.sort((a, b) => a.year > b.year ? -1 : 1);

  return (
    <Layout>
      <SEO title='Collages' />
      <section>
        {
          groups.map(
            group => (
              <section key={ group.year }>
                <h3 className={ collagesStyles.year }>{ `Collages ${ group.year }` }</h3>
                <section className={ collagesStyles.nodes }>
                  {
                    group.nodes.map(
                      (node, i) => (
                        <section key={ i } className={ collagesStyles.node }>
                          <h2>{ node.title }</h2>
                          <Link to={ `/collage/${ node.slug }` } className={ collagesStyles.linkCollage }>
                            <div className={ collagesStyles.collage }>
                              <Img fixed={ NNU(node.collage?.localFile?.childImageSharp?.fixed) } />
                            </div>
                          </Link>
                        </section>
                      )
                    )
                  }
                </section>
              </section>
            )
          )
        }
      </section>
    </Layout>
  );
}
