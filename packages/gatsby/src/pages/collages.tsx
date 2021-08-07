import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import { CollagesQuery } from '../../graphqlTypes';
import { CollageContext } from '../components/CollageAnimation';
import SEO from '../components/seo';
import { GatsbyImage } from 'gatsby-plugin-image';
import { NNU } from '../helpers';
import { motion, Variants } from 'framer-motion';

import * as collagesStyles from './collages.module.scss';

export default function Collages() {
  const data = useStaticQuery<CollagesQuery>(graphql`query Collages {
  allContentfulCollage(sort: {fields: date, order: DESC}) {
    nodes {
      slug
      title
      date
      collage {
        title
        localFile {
          childImageSharp {
            gatsbyImageData(width: 320, layout: FIXED)
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

  const collageVariants: Variants = {
    visible: {
      opacity: 1,
      transition: {
        delay: .2,
        duration: .1
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: .1
      }
    }
  }

  const shouldHideCollage = React.useCallback(
    (pathname: string) =>
      (collageContext.state.type === 'ANIMATING_IN' || collageContext.state.type === 'READY') && collageContext.state.pathname === pathname,
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
                          <motion.a data-href={ `/collage/${ node.slug }` }
                                    className={ collagesStyles.linkCollage }
                                    variants={ collageVariants }
                                    initial={ false }
                                    animate={ !shouldHideCollage(`/collage/${ node.slug }`) ? 'visible' : 'hidden' }
                                    onClick={ collageClickHandler }>
                            <GatsbyImage
                              alt={NNU(node.collage?.title)}
                              image={NNU(node.collage?.localFile?.childImageSharp?.gatsbyImageData, `Missing image of collage ${ node.collage?.title }`)}
                              style={ { display: 'block' } } />
                          </motion.a>
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
