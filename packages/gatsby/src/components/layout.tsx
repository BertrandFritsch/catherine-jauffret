import * as React from 'react';
import { useStaticQuery, graphql, PageProps } from 'gatsby';
import { SiteTitleQuery } from '../../graphqlTypes';
import { ANNU } from '../helpers';
import Footer from './footer';
import Header from './header';
import HeaderMobile from './headerMobile';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

import 'normalize.css';
import * as styles from './layout.module.scss';

interface PageContextType {
  layoutOverlay?: {
    pathname: string;
    title?: string;
  };
}

type Props = PageProps<object, PageContextType>

export default function Layout({ pageContext, location, children }: Props) {
  const [ showOverlay, setShowOverlay ] = React.useState<'NO' | 'AUTO' | 'HOVER' | 'YES'>('AUTO');
  const [ showMobileHeader, setShowMobileHeader ] = React.useState(typeof window !== 'undefined' && !window.matchMedia('(min-width: 768px)').matches);

  React.useEffect(
    () => {
      const resizeHandler = () => setShowMobileHeader(!window.matchMedia('(min-width: 768px)').matches);
      window.addEventListener('resize', resizeHandler);

      return () => window.removeEventListener('resize', resizeHandler);
    },
    []
  );

  // store the /collages page to keep it on navigation to a /collage page
  const collagesPageRef = React.useRef<any>(null);
  if (location.pathname === '/collages') {
    collagesPageRef.current = children;
  }
  else if (collagesPageRef.current !== null && location.pathname !== pageContext.layoutOverlay?.pathname) {
    collagesPageRef.current = null;
  }

  const data = useStaticQuery<SiteTitleQuery>(graphql`
    query SiteTitle {
      site {
        siteMetadata {
          title
          socialMedias {
            facebook
          }
        }
      }
    }
  `);

  ANNU(data.site?.siteMetadata?.socialMedias);
  ANNU(data.site.siteMetadata.socialMedias.facebook);

  return (
    <motion.div className={ classNames(styles.container, { [ styles.overlay ]: pageContext.layoutOverlay }) }
                onHoverStart={ () => setShowOverlay(showOverlay === 'AUTO' ? 'HOVER' : showOverlay) }
                onHoverEnd={ () => setShowOverlay(showOverlay === 'HOVER' ? 'AUTO' : showOverlay) }
                onTap={ () => setShowOverlay(showOverlay === 'HOVER' || showOverlay === 'YES' ? 'NO' : 'YES') }
                animate={ pageContext.layoutOverlay ? showOverlay === 'HOVER' || showOverlay === 'YES' ? 'overlayHover' : 'overlayHidden' : 'overlayNone' }
    >
      {
        showMobileHeader
          ? <HeaderMobile siteTitle={ data.site.siteMetadata?.title } overlay={ pageContext.layoutOverlay !== undefined } />
          : <Header className={ styles.header } siteTitle={ data.site.siteMetadata?.title } overlay={ pageContext.layoutOverlay !== undefined } />
      }

      {
        collagesPageRef.current &&
        <main key={ location.pathname } className={ styles.main }>{ collagesPageRef.current }</main>
      }

      <AnimatePresence>
        {
          location.pathname.match('^/collage/') &&
          <motion.main key={ location.pathname }
                       className={ classNames(styles.main, { [ styles.overlayMain ]: location.pathname === pageContext.layoutOverlay?.pathname }) }
                       exit='none'>
            { children }
          </motion.main>
        }
      </AnimatePresence>

      {
        !location.pathname.match('^/collage') &&
        <main key={ location.pathname } className={ styles.main }>
          { children }
        </main>
      }

      <Footer className={ styles.footer }
              socialMedias={ { facebook: data.site.siteMetadata.socialMedias.facebook } }
              additionalContent={ pageContext.layoutOverlay?.title && <h2>{ pageContext.layoutOverlay?.title }</h2> }
              overlay={ pageContext.layoutOverlay !== undefined }
      />
    </motion.div>
  );
};
