import {
  Image as UnpicImage,
  type ImageProps as UnpicImageProps,
} from '@unpic/react'
import { motion } from 'motion/react'
import { useCallback, useRef, type Ref } from 'react'
import { ANNU } from '#app/shared/utils'
import { type ImageAsset } from './image/image.types'

export type ImageProps = Pick<UnpicImageProps, 'breakpoints' | 'operations'> & {
  ref?: Ref<HTMLImageElement | null>
  className?: string
  image: ImageAsset
  onLoaded?: (image: HTMLImageElement, loaded: boolean) => void
}

export function Image({
  ref,
  className,
  breakpoints,
  image,
  onLoaded,
}: ImageProps) {
  ANNU(image.url, `The URL of the image ${image.title} is missing`)
  const onLoadedRef = useRef(onLoaded)
  onLoadedRef.current = onLoaded

  const imageRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(img)
        } else {
          ref.current = img
        }
      }

      const onLoaded = onLoadedRef.current

      if (img && onLoaded) {
        if (!img.complete) {
          img.addEventListener('load', () => onLoaded(img, true))
        }

        onLoaded(img, img.complete)
      }
    },
    [ref],
  )

  const imageHeight = breakpoints?.[0]
    ? Math.round((image.height / image.width) * breakpoints[0])
    : undefined

  return (
    <div
      className={className}
      style={{
        height: `${imageHeight}px`,
        width: breakpoints?.[0],
      }}
    >
      <UnpicImage
        ref={imageRef}
        className="max-w-screen max-h-screen"
        breakpoints={breakpoints}
        src={image.url}
        alt={image.title}
        operations={{
          contentful: {
            fit: 'scale',
            fm: 'webp',
          },
        }}
      />
    </div>
  )
}

export const AnimatedImage = motion.create(Image)
