import { Link } from 'gatsby';
import * as React from 'react';
import classNames from 'classnames';
import { motion, useViewportScroll, Variants } from 'framer-motion';

import * as styles from './header.module.scss';

interface Props {
  className?: string;
  siteTitle: string;
  overlay: boolean;
}

const defaultProps: Partial<Props> = {
  siteTitle: ``
};

const headerVariants: Variants = {
  overlayNone: {
    opacity: 1,
    pointerEvents: 'auto'
  },

  overlayHidden: {
    opacity: 0,
    pointerEvents: 'none'
  },

  overlayHover: {
    opacity: 1,
    pointerEvents: 'auto'
  }
}

export default function Header({ className, siteTitle, overlay }: Props) {
  const { scrollY } = useViewportScroll();
  const [ isCollapsed, setIsCollapsed ] = React.useState(scrollY.get() > 0);
  React.useLayoutEffect(() => scrollY.onChange(v => setIsCollapsed(v > 0)), []);

  return (
    <header className={ classNames(styles.header, className) }>
      <motion.div className={ classNames(styles.fixedHeader, { [ styles.overlay ]: overlay, [ styles.collapsed ]: !overlay && isCollapsed }) }
                  layout
                  variants={ headerVariants }>
        <motion.h1 layout><Link to='/'>{ siteTitle }</Link></motion.h1>
        <motion.h2 layout>Dé-coupage</motion.h2>
        <motion.ul className={ styles.menu } layout>
          <li><Link to='/presentation' activeClassName={ styles.activePage }>Présentation</Link></li>
          <li><Link to='/collages' activeClassName={ styles.activePage }>Collages</Link></li>
          <li><Link to='/cv' activeClassName={ styles.activePage }>Curriculum vitae</Link></li>
        </motion.ul>
      </motion.div>
    </header>
  );
}

Header.defaultProps = defaultProps;
