import classnames from 'classnames'
import { delay, motion, type MotionProps, type Variants } from 'motion/react'
import { memo, useState, useEffect } from 'react'
import { useDerivedStateFromProps } from '#app/shared/useDerivedStateFromProps'
import { AnimatedImage } from '../shared/image'
import { COLLAGE_TRANSITION_DURATION } from './collage.constants'
import { type Collage } from './collage.types'

type ZoomableCollageProps = {
  zoomed?: boolean
  item: Collage
  onUnzoom: (state: null) => void
}

export const ZoomableCollage = memo(function ZoomableCollage({
  item,
  zoomed = false,
  onUnzoom,
}: ZoomableCollageProps) {
  const [{ zoomingOut }, setZoomingOut] = useDerivedStateFromProps<{
    wasZoomed: boolean
    zoomingOut: boolean
  }>((prevState) => {
    if (prevState === null || (!prevState.wasZoomed && zoomed)) {
      return { wasZoomed: zoomed, zoomingOut: false }
    }

    if (prevState.wasZoomed && !zoomed) {
      return { wasZoomed: false, zoomingOut: true }
    }

    return prevState
  })

  useEffect(() => {
    if (zoomingOut) {
      const cancel = delay(() => {
        setZoomingOut((prevState) => ({ ...prevState, zoomingOut: false }))
      }, COLLAGE_TRANSITION_DURATION)

      return () => cancel()
    }
  }, [setZoomingOut, zoomingOut])

  const [imageState, setImageState] = useState<'loading' | 'thumbnail'>(
    'loading',
  )

  const imageVariants = {
    loading: {
      opacity: 0,
    },
    thumbnail: {
      opacity: 1,
      x: [null, 0],
      y: [null, 0],
    },
    zoomed: () => {
      const reducingRatio =
        Math.max(item.collage.width - window.innerWidth, 0) >=
        Math.max(item.collage.height - window.innerHeight, 0)
          ? Math.min(window.innerWidth / item.collage.width, 1)
          : Math.min(window.innerHeight / item.collage.height, 1)
      return {
        opacity: 1,
        x: window.innerWidth / 2 - (item.collage.width * reducingRatio) / 2,
        y: window.innerHeight / 2 - (item.collage.height * reducingRatio) / 2,
      }
    },
  } as const satisfies Variants

  const dragProps: MotionProps = !zoomed
    ? {}
    : {
        drag: 'y',
        whileTap: { cursor: 'grabbing' },
        dragConstraints: {
          top: imageVariants.zoomed().y,
          bottom: imageVariants.zoomed().y,
        },
        dragTransition: { bounceStiffness: 100, bounceDamping: 20 },
        dragElastic: 0.5,
        onDragEnd: (e, { offset: { y } }) => {
          e.preventDefault()
          if (Math.abs(y) > item.collage.height / 3) {
            onUnzoom(null)
          }
        },
      }

  return (
    <>
      {(zoomed || zoomingOut) && (
        <motion.div
          className="bg-root-background pointer-events-none fixed top-0 left-0 h-screen w-screen z-1 opacity-0"
          animate={{ opacity: zoomed ? 1 : 0 }}
          transition={{
            duration: COLLAGE_TRANSITION_DURATION / 1000,
          }}
        />
      )}
      <div
        className={classnames('relative', { 'z-2': zoomed || zoomingOut })}
        style={{
          aspectRatio: `${item.collage.width} / ${item.collage.height}`,
        }}
      >
        <motion.div
          className={classnames('cursor-pointer', {
            'opacity-0': imageState === 'loading',
            'fixed top-0 left-0': zoomed,
            'zoomed-collage': zoomed || zoomingOut,
          })}
          variants={imageVariants}
          initial={false}
          animate={zoomed ? 'zoomed' : imageState}
          transition={{
            duration: COLLAGE_TRANSITION_DURATION / 1000,
            type: 'tween',
            ease: 'linear',
          }}
          {...dragProps}
        >
          <AnimatedImage
            className="pointer-events-none"
            image={item.collage}
            layout
            onLoad={() => {
              setImageState('thumbnail')
            }}
            transition={{
              duration: COLLAGE_TRANSITION_DURATION / 1000,
              type: 'tween',
              ease: 'linear',
            }}
          />
        </motion.div>
      </div>
    </>
  )
})
