import classNames from 'classnames';
import { Link } from 'gatsby';
import * as React from 'react';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, Variants } from 'framer-motion';

import * as styles from './footer.module.scss';
import * as headerStyles from './header.module.scss';

interface Props {
  className?: string;
  socialMedias: {
    facebook: string
  }
  additionalContent?: React.ReactNode;
  overlay: boolean;
}

const footerVariants: Variants = {
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
};

export default function Footer({ className, socialMedias, additionalContent, overlay }: Props) {
  return (
    <motion.footer className={ classNames(styles.footer, className, { [ styles.overlay ]: overlay }) } variants={ footerVariants }>
      <div className={ styles.container }>
        { additionalContent }
        <div className={ styles.separator } />
        <ul className={ headerStyles.menu }>
          <li><Link to='/guestbook'>Livre d'or</Link></li>
          <li><Link to='/contact'>Contact</Link></li>
          <li>
            <a className={ styles.socialLink } href={ socialMedias.facebook }>
              <FontAwesomeIcon icon={ faFacebook } />
            </a>
          </li>
        </ul>
        <p>Copyright &copy; { new Date().getFullYear() } - Catherine Jauffret</p>
      </div>
    </motion.footer>
  );
}
