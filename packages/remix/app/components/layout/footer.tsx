import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import siteMetadata from '#app/assets/siteMetadata.json'
import { opacityVariants } from './shared/opacityVariants'

interface Props {
  className?: string
  socialMedias: {
    facebook: string
  }
  activeCollageDescription?: string
}

export default function Footer({
  className,
  socialMedias,
  activeCollageDescription,
}: Props) {
  return (
    <footer className={classnames(className, 'flex justify-center')}>
      <motion.div
        className={classnames('flex flex-col items-center', {
          'fixed bottom-0 z-1 bg-[var(--bg-overlay-bottom)]':
            activeCollageDescription,
        })}
        variants={opacityVariants}
      >
        <h2>{activeCollageDescription}</h2>
        <div className="flex flex-col items-center gap-2 border-t border-solid border-[var(--color-default-foreground)] mt-4 px-8 py-4 text-xs">
          <ul className="flex list-none items-center gap-4 font-bold">
            <li>
              <Link
                to="/guestbook"
                className="hover:text-hover uppercase no-underline [&.active]:border-b-2 [&.active]:border-solid"
                prefetch="intent"
              >
                Livre d'or
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-hover uppercase no-underline [&.active]:border-b-2 [&.active]:border-solid"
                prefetch="intent"
              >
                Contact
              </Link>
            </li>
            <li>
              <a className="hover:text-hover" href={socialMedias.facebook}>
                <FontAwesomeIcon className="text-xl" icon={faFacebook} />
              </a>
            </li>
          </ul>

          <p>
            Copyright &copy; {new Date().getFullYear()} - {siteMetadata.title}
          </p>
        </div>
      </motion.div>
    </footer>
  )
}
