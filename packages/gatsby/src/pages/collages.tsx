import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { CollagesQuery } from '../../graphqlTypes';
import { CollageContext } from '../components/CollageAnimation';
import SEO from '../components/seo';
import Img from 'gatsby-image';
import { NNU } from '../helpers';
import classNames from 'classnames';

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

  const collageContext = React.useContext(CollageContext);

  const collageClickHandler = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      collageContext.showCollage(NNU(e.currentTarget.dataset.href), e.currentTarget.getBoundingClientRect());
    },
    [ collageContext ]
  );

  const shouldHideCollage = React.useCallback(
    (pathname: string) =>
      collageContext.state.type !== 'NONE' && collageContext.state.type !== 'STARTING' && collageContext.state.pathname === pathname,
    [ collageContext ]
  );

  return (
    <>
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
                          <a data-href={ `/collage/${ node.slug }` } className={ classNames(collagesStyles.linkCollage, { [ collagesStyles.collageAnimating ]: shouldHideCollage(`/collage/${ node.slug }`) }) } onClick={ collageClickHandler }>
                            <Img style={ { display: 'block' } } fixed={ NNU(node.collage?.localFile?.childImageSharp?.fixed) } />
                          </a>
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
    </>
  );
}
