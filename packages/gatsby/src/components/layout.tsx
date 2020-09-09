import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { SiteTitleQuery } from '../../graphqlTypes';
import { ANNU } from '../helpers';
import Footer from './footer';
import Header from './header';
import classNames from 'classnames';
import { motion } from 'framer-motion';

import 'normalize.css';
import * as layoutStyles from './layout.module.scss';

interface Props {
  overlay: boolean;
  additionalOverlayContent?: React.ReactNode;
  children: React.ReactNode;
}

const defaultProps: Partial<Props> = {
  overlay: false
};

export default function Layout({ overlay, additionalOverlayContent, children }: Props) {
  const [ showOverlay, setShowOverlay ] = React.useState(false);
  const [ preventOverlay, setPreventOverlay ] = React.useState(false);

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
    <motion.div className={ classNames(layoutStyles.container, overlay && layoutStyles.overlay) }
                onHoverStart={ () => setShowOverlay(true) }
                onHoverEnd={ () => setShowOverlay(false) }
                onTap={ () => setPreventOverlay(!preventOverlay) }
                animate={ overlay ? !preventOverlay && showOverlay ? 'overlayHover' : 'overlayInitial' : undefined }
    >
      <Header className={ layoutStyles.header } siteTitle={ data.site.siteMetadata?.title } />
      <main className={ layoutStyles.main }>{ children }</main>
      <Footer className={ layoutStyles.footer }
              socialMedias={ { facebook: data.site.siteMetadata.socialMedias.facebook } }
              additionalContent={ additionalOverlayContent }
      />
    </motion.div>
  );
};

Layout.defaultProps = defaultProps;
