import classNames from 'classnames';
import { Link } from 'gatsby';
import * as React from 'react';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, Variants } from 'framer-motion';

import * as footerStyles from './footer.module.scss';
import * as headerStyles from './header.module.scss';
import variables from './variables.scss';

interface Props {
  className?: string;
  socialMedias: {
    facebook: string
  }
  additionalContent?: React.ReactNode;
}

const footerVariants: Variants = {
  overlayInitial: {
    opacity: 0,
    pointerEvents: 'none'
  },

  overlayHover: {
    opacity: 1,
    pointerEvents: 'auto',
    background: variables.overlayBackgroundBottom
  }
};

export default function Footer({ className, socialMedias, additionalContent }: Props) {
  return (
    <motion.footer className={ classNames(footerStyles.footer, className) } variants={ footerVariants }>
      <div className={ footerStyles.container }>
        { additionalContent }
        <div className={ footerStyles.separator } />
        <ul className={ headerStyles.menu }>
          <li><Link to='/'>Livre d'or</Link></li>
          <li><Link to='/contact'>Contact</Link></li>
          <li>
            <a className={ footerStyles.socialLink } href={ socialMedias.facebook }>
              <FontAwesomeIcon icon={ faFacebook } />
            </a>
          </li>
        </ul>
        <p className={ footerStyles.copyright }>Copyright &copy; { new Date().getFullYear() } - Catherine Jauffret</p>
      </div>
    </motion.footer>
  );
}
