import { motion, TargetAndTransition, Variants } from 'framer-motion';
import { graphql, PageProps } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import * as React from 'react';
import { CollageQuery } from '../../graphqlTypes';
import { CollageContext } from '../components/CollageAnimation';
import SEO from '../components/seo';
import { ANNU, NNU } from '../helpers';
import classNames from 'classnames';

import * as styles from './collage.module.scss';

export const query = graphql`query Collage($slug: String!) {
  contentfulCollage(slug: {eq: $slug}) {
    title
    date
    collage {
      title
      localFile {
        childImageSharp {
          gatsbyImageData(width: 1920, layout: CONSTRAINED)
        }
      }
    }
  }
}
`;

interface Props extends PageProps {
  data: CollageQuery;
}

export default function Collage({ data }: Props) {
  ANNU(data.contentfulCollage?.collage?.localFile?.childImageSharp?.gatsbyImageData);
  const image = data.contentfulCollage?.collage?.localFile?.childImageSharp?.gatsbyImageData;

  const [ dragging, setDragging ] = React.useState(false);

  const collageContextValue = React.useContext(CollageContext);
  const collageThumbnailCoords = collageContextValue.state.type !== 'NONE' ? collageContextValue.state.rect : null;

  const animateValues = React.useMemo(
    () => {
      if (collageThumbnailCoords) {
        ANNU(window);
        const screenAspectRatio = window.innerWidth / window.innerHeight;
        const imageAspectRatio = image.width / image.height;
        return {
          x: (collageThumbnailCoords.left + collageThumbnailCoords.width / 2) - (window.innerWidth / 2),
          y: (collageThumbnailCoords.top + collageThumbnailCoords.height / 2) - (window.innerHeight / 2),
          scale: imageAspectRatio > 1 && screenAspectRatio <= imageAspectRatio || imageAspectRatio <= 1 && screenAspectRatio <= imageAspectRatio
                   ? collageThumbnailCoords.width / Math.min(window.innerWidth, image.width)
                   : collageThumbnailCoords.height / Math.min(window.innerHeight, image.height)
        };
      }
    },
    []
  );

  const initialVariants = animateValues && {
    x: animateValues.x,
    y: animateValues.y,
    scale: animateValues.scale,
    opacity: 0
  };

  const animateVariants = animateValues && {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: .3,
      ease: 'easeIn',
      type: 'tween'
    }
  };

  const exitVariants: TargetAndTransition | undefined =
    collageContextValue.state.type !== 'NONE' && animateValues
      ? {
          x: [ null, animateValues.x ],
          y: [ null, animateValues.y ],
          scale: [ null, animateValues.scale ],
          opacity: 1,
          transition: {
            duration: .3,
            ease: 'linear',
            type: 'tween'
          }
        }
      : undefined;

  const backgroundVariants: Variants = {
    in: {
      opacity: 1
    },

    out: {
      opacity: 0
    }
  };

  return (
    <>
      <SEO title={ NNU(data.contentfulCollage?.title) } />
      <motion.div className={ classNames(styles.backgroundLayer, { [ styles.animate ]: collageContextValue.state.type !== 'NONE' }) }
                  variants={ backgroundVariants }
                  initial={ false }
                  animate={ collageContextValue.state.type === 'ANIMATING_OUT' || dragging ? 'out' : collageContextValue.state.type === 'READY' ? 'in' : undefined } />
      <motion.section className={ classNames(styles.container, { [ styles.animate ]: collageContextValue.state.type !== 'NONE' }) }
                      inherit={ false }
                      initial={ initialVariants }
                      animate={ animateVariants }
                      exit={ exitVariants }
                      onAnimationStart={ () => collageContextValue.startAnimating() }
                      onAnimationComplete={ () => collageContextValue.stopAnimating() }
                      drag={ collageContextValue.state.type === 'READY' ? 'y' : false }
                      whileTap={ { cursor: "grabbing" } }
                      dragConstraints={ { top: 0, bottom: 0 } }
                      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                      dragElastic={ 0.5 }
                      onDragStart={ () => setDragging(true) }
                      onDragEnd={ (_, { offset: { y } }) => (setDragging(false), Math.abs(y) > window.innerHeight / 3 && window.history.back()) }>
        <GatsbyImage
          alt={NNU(data.contentfulCollage?.collage?.title)}
          image={image}
          style={ { flex: 'auto', maxHeight: '100vh', pointerEvents: 'none' } }
          imgStyle={ { objectFit: 'contain' } } />
      </motion.section>
    </>
  );
}
