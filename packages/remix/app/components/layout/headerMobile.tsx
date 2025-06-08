import classnames from 'classnames'
import { AnimatePresence, motion, useScroll, type Variants } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useCollageContext } from './collageContext'
import { opacityVariants } from './shared/opacityVariants'

interface Props {
  className?: string
  siteTitle: string
}

const headerVariants: Variants = {
  collapsed: {
    paddingTop: '1rem',
    paddingBottom: '1rem',
  },

  expanded: {
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem',
  },
}

const menuVariants: Variants = {
  collapsed: {
    x: '100%',
    y: '-100%',
    scale: 0,
    transition: {
      ease: 'linear',
      type: 'tween',
    },
  },

  expanded: {
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      ease: 'linear',
      type: 'tween',
    },
  },
}

const backgroundLayerVariants: Variants = {
  collapsed: {
    opacity: 0,
  },

  expanded: {
    opacity: 0.6,
  },
}

export default function HeaderMobile({ siteTitle }: Props) {
  const { activeCollage } = useCollageContext()
  const { scrollY } = useScroll()
  const [isCollapsed, setIsCollapsed] = useState(scrollY.get() > 0)
  useEffect(() => scrollY.on('change', (v) => setIsCollapsed(v > 0)), [scrollY])
  const [isOpen, setIsOpen] = useState(false)

  const buttonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    if (buttonRef.current) {
      const button = buttonRef.current

      const downHandler = (e: PointerEvent) => {
        if (e.currentTarget instanceof HTMLButtonElement) {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }
      }

      const upHandler = (e: Event) => e.stopPropagation()

      button.addEventListener('pointerdown', downHandler)
      button.addEventListener('pointerup', upHandler)

      return () => {
        button.removeEventListener('pointerdown', downHandler)
        button.removeEventListener('pointerup', upHandler)
      }
    }
  }, [isOpen])

  return (
    <motion.header
      className="mt-[var(--spacing-header-mobile)] self-stretch z-3"
      onPointerUp={() => setIsOpen(false)}
      variants={opacityVariants}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 w-screen h-screen bg-[var(--color-root-background)]"
            variants={backgroundLayerVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          />
        )}
      </AnimatePresence>
      <motion.div
        className="fixed top-0 right-0 left-0 flex"
        initial={false}
        animate={
          activeCollage === null
            ? { backgroundColor: 'var(--color-root-background)' }
            : { backgroundColor: 'var(--bg-overlay-top)' }
        }
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-0 left-0 w-full h-[var(--spacing-mobile-menu)] pt-[var(--spacing-header-mobile)] bg-[var(--color-root-background)] rounded-bl-[var(--rounded-menu-corner)] flex justify-center"
              variants={menuVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              <ul className="my-0 mr-[20%] ml-0 list-none p-0 font-bold">
                <li className="leading-[3rem]">
                  <Link
                    to="/presentation"
                    className="hover:text-hover ml-4 block h-full text-inherit uppercase no-underline"
                  >
                    Présentation
                  </Link>
                </li>
                <li className="leading-[3rem]">
                  <Link
                    to="/collages"
                    className="hover:text-hover ml-4 block h-full text-inherit uppercase no-underline"
                  >
                    Collages
                  </Link>
                </li>
                <li className="leading-[3rem]">
                  <Link
                    to="/cv"
                    className="hover:text-hover ml-4 block h-full text-inherit uppercase no-underline"
                  >
                    Curriculum vitae
                  </Link>
                </li>
                <li className="leading-[3rem]">
                  <Link
                    to="/guestbook"
                    className="hover:text-hover ml-4 block h-full text-inherit uppercase no-underline"
                  >
                    Livre d'or
                  </Link>
                </li>
                <li className="leading-[3rem]">
                  <Link
                    to="/contact"
                    className="hover:text-hover ml-4 block h-full text-inherit uppercase no-underline"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.h1
          className="text-hover mx-4 flex-auto py-6 text-center text-2xl text-[length:var(--text-header-mobile)] font-bold whitespace-nowrap uppercase z-1"
          variants={headerVariants}
          initial={false}
          animate={isCollapsed ? 'collapsed' : 'expanded'}
        >
          <Link to="/" className="text-inherit no-underline">
            {siteTitle}
          </Link>
        </motion.h1>
        <button
          ref={buttonRef}
          className={classnames('hamburger', 'hamburger--collapse', {
            ['is-active']: isOpen,
          })}
          type="button"
        >
          <span className="hamburger-box">
            <span className="hamburger-inner bg-[var(--color-default-foreground)]" />
          </span>
        </button>
      </motion.div>
      <h2 className="font-lora my-0 mb-6 text-center text-2xl font-normal italic">
        Dé-coupage
      </h2>
    </motion.header>
  )
}
