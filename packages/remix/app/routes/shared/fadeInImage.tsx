import { useState } from 'react'
import { type ImageProps, AnimatedImage } from './image'

type FadeInImageProps = Omit<ImageProps, 'onLoad'>

export function FadeInImage(props: FadeInImageProps) {
  const [isLoaded, setIsLoaded] = useState(true)

  console.log({ isLoaded })

  return (
    <AnimatedImage
      {...props}
      initial={{ opacity: 1 }}
      animate={
        !isLoaded ? { opacity: 0, transition: { duration: 0 } } : { opacity: 1 }
      }
      onLoaded={(_: unknown, loaded: boolean) => setIsLoaded(loaded)}
    />
  )
}
