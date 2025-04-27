import { faXmark, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { motion, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useCollageContext } from './collageContext'
import { opacityVariants } from './shared/opacityVariants'

interface Props {
  className?: string
  siteTitle: string
}

const defaultProps: Partial<Props> = {
  siteTitle: ``,
}

export default function Header({ className, siteTitle }: Props) {
  const { activeCollage, isCollagesPage, onActiveCollageChange } =
    useCollageContext()
  const { scrollY } = useScroll()
  const [isCollapsed, setIsCollapsed] = useState(scrollY.get() > 0)
  useEffect(() => scrollY.on('change', (v) => setIsCollapsed(v > 0)), [scrollY])

  return (
    <header
      className={classNames('mt-[var(--spacing-header-desktop)]', className)}
    >
      <motion.div
        className={classNames(
          'fixed top-0 right-0 left-0 z-10 flex flex-col items-center whitespace-nowrap',
          {
            'bg-[var(--bg-overlay-top)]': activeCollage !== null,
            'flex-row justify-center bg-[var(--color-header-collapsed)] shadow-[var(--shadow-header)]':
              activeCollage === null && isCollapsed,
          },
        )}
        layout
        variants={opacityVariants}
      >
        {isCollagesPage && activeCollage && (
          <div className="fixed right-4 top-4 flex gap-4">
            <Link to={`/collage/${activeCollage.slug}`}>
              <FontAwesomeIcon icon={faLink} />
            </Link>
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.25 }}
              onTap={() => {
                onActiveCollageChange(null)
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </motion.div>
          </div>
        )}
        <motion.h1
          className={classNames(
            'text-hover m-0 py-6 text-[length:var(--text-header-desktop)] font-bold uppercase',
            {
              'py-4 text-[length:var(--text-header-desktop-collapsed)]':
                activeCollage === null && isCollapsed,
            },
          )}
          layout
        >
          <NavLink
            to="/"
            className="text-inherit no-underline"
            prefetch="intent"
          >
            {siteTitle}
          </NavLink>
        </motion.h1>
        <motion.h2
          className={classNames('font-lora m-0 text-2xl font-normal italic', {
            'invisible w-0': activeCollage === null && isCollapsed,
          })}
          layout
        >
          Dé-coupage
        </motion.h2>
        <motion.ul
          className="my-6 flex list-none items-center justify-center p-0 font-bold"
          layout
        >
          <li>
            <NavLink
              to="/presentation"
              className="hover:text-hover ml-4 text-inherit uppercase no-underline [&.active]:border-b-2 [&.active]:border-solid"
              prefetch="intent"
            >
              Présentation
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/collages"
              className="hover:text-hover ml-4 text-inherit uppercase no-underline [&.active]:border-b-2 [&.active]:border-solid"
              prefetch="intent"
            >
              Collages
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cv"
              className="hover:text-hover ml-4 text-inherit uppercase no-underline [&.active]:border-b-2 [&.active]:border-solid"
              prefetch="intent"
            >
              Curriculum vitae
            </NavLink>
          </li>
        </motion.ul>
      </motion.div>
    </header>
  )
}

Header.defaultProps = defaultProps
