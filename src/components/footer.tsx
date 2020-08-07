import classNames from 'classnames';
import { Link } from 'gatsby';
import * as React from 'react';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as footerStyles from './footer.module.scss';
import * as headerStyles from './header.module.scss';

interface Props {
  className?: string;
  socialMedias: {
    facebook: string
  }
}

export default function Footer({ className, socialMedias }: Props) {
  return (
    <footer className={ classNames(footerStyles.footer, className) }>
      <ul className={ headerStyles.menu }>
        <li><Link to='/'>Livre d'or</Link></li>
        <li><Link to='/'>Contact</Link></li>
        <li>
          <a className={ footerStyles.socialLink } href={ socialMedias.facebook }>
            <FontAwesomeIcon icon={ faFacebook } />
          </a>
        </li>
      </ul>
    </footer>
  );
}
