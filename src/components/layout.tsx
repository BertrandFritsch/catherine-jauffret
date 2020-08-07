import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { SiteTitleQuery } from '../../graphqlTypes';
import { ANNU } from '../helpers';
import Footer from './footer';
import Header from './header';

import 'normalize.css';
import * as layoutStyles from './layout.module.scss';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
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
    <div className={ layoutStyles.container }>
      <Header className={ layoutStyles.header } siteTitle={ data.site.siteMetadata?.title } />
      <main className={ layoutStyles.main }>{ children }</main>
      <Footer className={ layoutStyles.footer } socialMedias={ { facebook: data.site.siteMetadata.socialMedias.facebook } } />
    </div>
  );
};
