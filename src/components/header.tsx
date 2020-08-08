import { Link } from 'gatsby';
import * as React from 'react';
import classNames from 'classnames';

import * as headerStyles from './header.module.scss';

interface Props {
  className?: string;
  siteTitle: string
}

export default function Header({ className, siteTitle }: Props) {
  return (
    <header
      className={ classNames(headerStyles.header, className) }
    >
      <h1><Link to='/'>{ siteTitle }</Link></h1>
      <h2>Dé-coupage</h2>
      <ul className={ headerStyles.menu }>
        <li><Link to='/presentation' activeClassName={ headerStyles.activePage }>Présentation</Link></li>
        <li><Link to='/' activeClassName={ headerStyles.activePage }>Collages</Link></li>
        <li><Link to='/' activeClassName={ headerStyles.activePage }>Curriculum vitae</Link></li>
      </ul>
    </header>
  );
}

Header.defaultProps = {
  siteTitle: ``
};
