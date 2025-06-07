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
  onLoad?: (image: HTMLImageElement) => void
}

export function Image({
  ref,
  className,
  breakpoints,
  image,
  onLoad,
}: ImageProps) {
  ANNU(image.url, `The URL of the image ${image.title} is missing`)
  const onLoadRef = useRef(onLoad)
  onLoadRef.current = onLoad

  const imageRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(img)
        } else {
          ref.current = img
        }
      }

      const onLoad = onLoadRef.current

      if (img && onLoad) {
        if (img.complete) {
          onLoad(img)
        } else {
          img.addEventListener('load', () => onLoad(img))
        }
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
