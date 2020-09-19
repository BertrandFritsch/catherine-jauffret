import { globalHistory } from '@reach/router';
import { motion } from 'framer-motion';
import { graphql, PageProps } from 'gatsby';
import Img from 'gatsby-image';
import * as React from 'react';
import { CollageQuery } from '../../graphqlTypes';
import SEO from '../components/seo';
import { ANNU } from '../helpers';
import classNames from 'classnames';

import * as collageStyles from './collage.module.scss';

export const query = graphql`
  query Collage($slug: String!) {
    contentfulCollage(slug: { eq: $slug }) {
      title
      date
      collage {
        localFile {
          childImageSharp {
            fluid(maxWidth: 1920, quality: 100) {
              ...GatsbyImageSharpFluid_withWebp
              ...GatsbyImageSharpFluidLimitPresentationSize
            }
          }
        }
      }
    }
  }
`;

interface Props extends PageProps<object, object, { collageThumbnailCoords?: DOMRect }> {
  data: CollageQuery;
}

export default function Collage({ data, location }: Props) {
  ANNU(data.contentfulCollage?.collage?.localFile?.childImageSharp?.fluid);
  const image = data.contentfulCollage?.collage?.localFile?.childImageSharp?.fluid;

  React.useLayoutEffect(
    () => {
      const sbWidth = window.innerWidth - document.documentElement.getBoundingClientRect().width;
      document.documentElement.style.cssText = `overflow: hidden; margin-right: ${ sbWidth }px`;

      return () => {
        document.documentElement.style.cssText = '';
      };
    },
    []
  );

  const collageThumbnailCoords = location.state?.collageThumbnailCoords;

  const [ animating, setAnimating ] = React.useState(collageThumbnailCoords !== undefined);

  const animateValues = React.useMemo(
    () => {
      if (typeof window !== 'undefined' && collageThumbnailCoords) {
        const screenAspectRatio = window.innerWidth / window.innerHeight;
        return {
          x: (collageThumbnailCoords.left + collageThumbnailCoords.width / 2) - (window.innerWidth / 2),
          y: (collageThumbnailCoords.top + collageThumbnailCoords.height / 2) - (window.innerHeight / 2),
          scale: image.aspectRatio > 1 && screenAspectRatio <= image.aspectRatio || image.aspectRatio <= 1 && screenAspectRatio <= image.aspectRatio
                   ? collageThumbnailCoords.width / Math.min(window.innerWidth, image.maxWidth)
                   : collageThumbnailCoords.height / Math.min(window.innerHeight, image.maxHeight)
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
      ease: 'linear',
      type: 'tween'
    }
  };

  const [ cancelExitAnimation, setCancelExitAnimation ] = React.useState(false);
  React.useEffect(
    () =>
      // listen to the kind of navigation to only animate the exit state when going back to the /collages page
      globalHistory.listen(({ action, location: loc }) => {
        if (action !== 'POP' || loc.pathname !== '/collages') {
          setCancelExitAnimation(true);
        }
      }),
    []
  );

  const exitVariants =
    !cancelExitAnimation && animateValues
    ? {
        x: animateValues.x,
        y: animateValues.y,
        scale: animateValues.scale,
        opacity: 1,
        transition: {
          ease: 'linear',
          type: 'tween'
        }
      }
    : undefined;

  return (
    <>
      <SEO title={ data.contentfulCollage.title } />
      <motion.section className={ classNames(collageStyles.container, { [ collageStyles.animate ]: animating }) }
                      initial={ initialVariants }
                      animate={ animateVariants }
                      exit={ exitVariants }
                      onAnimationStart={ () => setAnimating(true) }
                      onAnimationComplete={ () => setAnimating(false) }
                      drag={ collageThumbnailCoords ? 'y' : false }
                      dragConstraints={ { top: 0, bottom: 0 } }
                      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                      dragElastic={ 0.5 }
                      onDragEnd={ (_, { offset: { y } }) => Math.abs(y) > window.innerHeight / 3 && window.history.back() }>
        <Img fluid={ image }
             style={ { flex: 'auto', maxHeight: '100vh', pointerEvents: 'none' } }
             imgStyle={ { objectFit: 'contain' } }
        />
      </motion.section>
    </>
  );
}
