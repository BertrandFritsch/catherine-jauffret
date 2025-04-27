import classnames from 'classnames'
import { motion } from 'motion/react'
import { useLayoutEffect, useState } from 'react'
import { Outlet } from 'react-router'
import siteMetadata from '#app/assets/siteMetadata.json'
import { useCollageContext } from './collageContext'
import Footer from './footer'
import Header from './header'
import HeaderMobile from './headerMobile'

export default function LayoutContent() {
  const { activeCollage, showLayoutOverlay } = useCollageContext()
  useLayoutEffect(() => {
    const resizeHandler = () =>
      setShowMobileHeader(!window.matchMedia('(min-width: 768px)').matches)
    window.addEventListener('resize', resizeHandler)
    resizeHandler()

    return () => window.removeEventListener('resize', resizeHandler)
  }, [])
  const [showMobileHeader, setShowMobileHeader] = useState(false)

  return (
    <motion.div
      className={classnames(
        'flex min-h-screen w-full flex-col items-center justify-between',
        { 'z-1': activeCollage !== null },
      )}
      animate={showLayoutOverlay ? 'overlayHover' : 'overlayHidden'}
    >
      {showMobileHeader ? (
        <HeaderMobile
          siteTitle={siteMetadata.title}
          overlay={activeCollage !== null}
        />
      ) : (
        <Header className="flex-none" siteTitle={siteMetadata.title} />
      )}

      <main className="flex-none px-4 py-8">
        <Outlet />
      </main>

      <Footer
        className="flex-none"
        socialMedias={{
          facebook: siteMetadata.socialMedias.facebook,
        }}
        activeCollageDescription={activeCollage?.title}
      />
    </motion.div>
  )
}
