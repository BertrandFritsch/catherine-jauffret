import { Link } from 'gatsby';
import * as React from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion, useViewportScroll, Variants } from 'framer-motion';

import * as styles from './headerMobile.module.scss';

interface Props {
  className?: string;
  siteTitle: string;
}

const defaultProps: Partial<Props> = {
  siteTitle: ``
};

const headerVariants: Variants = {
  collapsed: {
    paddingTop: '1rem',
    paddingBottom: '1rem'
  },

  expanded: {
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem'
  }
};

const menuVariants: Variants = {
  collapsed: {
    x: '20%',
    y: '-75%',
    scale: 0,
    transition: {
      type: 'tween'
    }
  },

  expanded: {
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: 'tween'
    }
  }
};

const backgroundLayerVariants: Variants = {
  collapsed: {
    opacity: 0
  },

  expanded: {
    opacity: .6
  }
};

export default function HeaderMobile({ className, siteTitle }: Props) {
  const { scrollY } = useViewportScroll();
  const [ isCollapsed, setIsCollapsed ] = React.useState(scrollY.get() > 0);
  React.useEffect(() => scrollY.onChange(v => setIsCollapsed(v > 0)), []);
  const [ isOpen, setIsOpen ] = React.useState(false);

  return (
    <header className={ styles.header } onClick={ () => setIsOpen(false) }>
      <AnimatePresence>
        {
          isOpen &&
          <motion.div className={ styles.backgroundLayer } variants={ backgroundLayerVariants } initial='collapsed' animate='expanded' exit='collapsed' />
        }
      </AnimatePresence>
      <motion.div className={ styles.fixedHeader }>
        <motion.h1 variants={ headerVariants } initial={ false } animate={ isCollapsed ? 'collapsed' : 'expanded' }><Link to='/'>{ siteTitle }</Link></motion.h1>
        <button className={ classNames(styles.hamburger, styles.hamburgerCollapse, { [ styles.isActive ]: isOpen }) } type='button' onClick={ e => (setIsOpen(!isOpen), e.stopPropagation()) }>
          <span className={ styles.hamburgerBox }>
            <span className={ styles.hamburgerInner } />
          </span>
        </button>
        <AnimatePresence>
          {
            isOpen &&
            <motion.div className={ styles.menu } variants={ menuVariants } initial='collapsed' animate='expanded' exit='collapsed'>
              <ul>
                <li><Link to='/presentation' activeClassName={ styles.activePage }>Présentation</Link></li>
                <li><Link to='/collages' activeClassName={ styles.activePage }>Collages</Link></li>
                <li><Link to='/cv' activeClassName={ styles.activePage }>Curriculum vitae</Link></li>
              </ul>
            </motion.div>
          }
        </AnimatePresence>
      </motion.div>
      <h2>Dé-coupage</h2>
    </header>
  );
}

HeaderMobile.defaultProps = defaultProps;
