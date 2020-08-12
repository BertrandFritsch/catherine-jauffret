import { Link } from 'gatsby';
import * as React from 'react';
import classNames from 'classnames';
import { motion, useViewportScroll } from 'framer-motion';

import * as headerStyles from './header.module.scss';
import variables from './variables.scss';

interface Props {
  className?: string;
  siteTitle: string;
}

const defaultProps: Partial<Props> = {
  siteTitle: ``
};

const headerVariants = {
  overlayInitial: {
    opacity: 0,
  },

  overlayHover: {
    opacity: 1,
    background: variables.overlayBackgroundTop
  }
}

export default function Header({ className, siteTitle }: Props) {
  const { scrollY } = useViewportScroll();
  const [ isCollapsed, setIsCollapsed ] = React.useState(scrollY.get() > 0);
  React.useEffect(() => scrollY.onChange(v => setIsCollapsed(v > 0)), []);

  return (
    <header className={ classNames(headerStyles.header, className) }>
      <motion.div className={ classNames(headerStyles.fixedHeader, isCollapsed && headerStyles.collapsed) }
                  layout
                  variants={ headerVariants }>
        <motion.h1 layout><Link to='/'>{ siteTitle }</Link></motion.h1>
        <motion.h2 layout>Dé-coupage</motion.h2>
        <motion.ul className={ headerStyles.menu } layout>
          <li><Link to='/presentation' activeClassName={ headerStyles.activePage }>Présentation</Link></li>
          <li><Link to='/collages' activeClassName={ headerStyles.activePage }>Collages</Link></li>
          <li><Link to='/cv' activeClassName={ headerStyles.activePage }>Curriculum vitae</Link></li>
        </motion.ul>
      </motion.div>
    </header>
  );
}

Header.defaultProps = defaultProps;
