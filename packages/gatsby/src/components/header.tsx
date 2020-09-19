import { Link } from 'gatsby';
import * as React from 'react';
import classNames from 'classnames';
import { motion, useViewportScroll, Variants } from 'framer-motion';

import * as styles from './header.module.scss';
import variables from './variables.module.scss';

interface Props {
  className?: string;
  siteTitle: string;
}

const defaultProps: Partial<Props> = {
  siteTitle: ``
};

const headerVariants: Variants = {
  overlayInitial: {
    opacity: 0,
    pointerEvents: 'none'
  },

  overlayHover: {
    opacity: 1,
    pointerEvents: 'auto',
    background: variables.overlayBackgroundTop
  }
}

export default function Header({ className, siteTitle }: Props) {
  const { scrollY } = useViewportScroll();
  const [ isCollapsed, setIsCollapsed ] = React.useState(scrollY.get() > 0);
  React.useEffect(() => scrollY.onChange(v => setIsCollapsed(v > 0)), []);

  return (
    <header className={ classNames(styles.header, className) }>
      <motion.div className={ classNames(styles.fixedHeader, { [ styles.collapsed ]: isCollapsed }) }
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
