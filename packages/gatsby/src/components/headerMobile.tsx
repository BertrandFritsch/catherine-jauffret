import { Link } from 'gatsby';
import * as React from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion, useViewportScroll, Variants } from 'framer-motion';

import * as styles from './headerMobile.module.scss';

interface Props {
  className?: string;
  siteTitle: string;
  overlay: boolean;
}

const defaultProps: Partial<Props> = {
  siteTitle: ``
};

const overlayVariants: Variants = {
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
    x: '100%',
    y: '-100%',
    scale: 0,
    transition: {
      ease: 'linear',
      type: 'tween'
    }
  },

  expanded: {
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      ease: 'linear',
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

export default function HeaderMobile({ siteTitle, overlay }: Props) {
  const { scrollY } = useViewportScroll();
  const [ isCollapsed, setIsCollapsed ] = React.useState(scrollY.get() > 0);
  React.useEffect(() => scrollY.onChange(v => setIsCollapsed(v > 0)), []);
  const [ isOpen, setIsOpen ] = React.useState(false);

  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(
    () => {
      if (buttonRef.current) {
        const button = buttonRef.current;

        const downHandler = (e: PointerEvent) => {
          if (e.currentTarget instanceof HTMLButtonElement) {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }
        };

        const upHandler = (e: Event) => e.stopPropagation();

        button.addEventListener('pointerdown', downHandler);
        button.addEventListener('pointerup', upHandler);

        return () => {
          button.removeEventListener('pointerdown', downHandler);
          button.removeEventListener('pointerup', upHandler);
        };
      }
    },
    [ isOpen ]
  );

  return (
    <header className={ styles.header } onPointerUp={ () => setIsOpen(false) }>
      <AnimatePresence>
        {
          isOpen &&
          <motion.div className={ styles.backgroundLayer } variants={ backgroundLayerVariants } initial='collapsed' animate='expanded' exit='collapsed' />
        }
      </AnimatePresence>
      <motion.div className={ classNames(styles.fixedHeader, { [ styles.overlay ]: overlay }) } variants={ overlayVariants }>
        <AnimatePresence>
          {
            isOpen &&
            <motion.div className={ styles.menu } variants={ menuVariants } initial='collapsed' animate='expanded' exit='collapsed'>
              <ul>
                <li><Link to='/presentation'>Présentation</Link></li>
                <li><Link to='/collages'>Collages</Link></li>
                <li><Link to='/cv'>Curriculum vitae</Link></li>
                <li><Link to='/guestbook'>Livre d'or</Link></li>
                <li><Link to='/contact'>Contact</Link></li>
              </ul>
            </motion.div>
          }
        </AnimatePresence>
        <motion.h1 variants={ headerVariants } initial={ false } animate={ isCollapsed ? 'collapsed' : 'expanded' }><Link to='/'>{ siteTitle }</Link></motion.h1>
        <button ref={ buttonRef } className={ classNames(styles.hamburger, styles.hamburgerCollapse, { [ styles.isActive ]: isOpen }) } type='button'>
          <span className={ styles.hamburgerBox }>
            <span className={ styles.hamburgerInner } />
          </span>
        </button>
      </motion.div>
      <h2>Dé-coupage</h2>
    </header>
  );
}

HeaderMobile.defaultProps = defaultProps;
