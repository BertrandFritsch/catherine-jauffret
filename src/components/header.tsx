import * as React from 'react';
import classNames from 'classnames';

import * as headerStyles from './header.module.scss';

interface Props {
  className?: string;
  siteTitle: string
}

const Header = ({ className, siteTitle }: Props) => (
  <header
    className={ classNames(headerStyles.header, className) }
  >
    <h1>{ siteTitle }</h1>
  </header>
);

Header.defaultProps = {
  siteTitle: ``
};

export default Header;
