import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Header from './header';

import 'normalize.css';
import * as layoutStyles from './layout.module.scss';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className={ layoutStyles.container }>
      <Header className={ layoutStyles.header } siteTitle={ data.site.siteMetadata.title } />
      <main className={ layoutStyles.main }>{ children }</main>
      <footer className={ layoutStyles.footer } />
    </div>
  );
};

export default Layout;
