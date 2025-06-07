import { useState } from 'react'
import { type ImageProps, AnimatedImage } from './image'

type FadeInImageProps = Omit<ImageProps, 'onLoad'>

export function FadeInImage(props: FadeInImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <AnimatedImage
      {...props}
      initial={false}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      onLoad={() => setIsLoaded(true)}
    />
  )
}
