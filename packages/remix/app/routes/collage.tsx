import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useCollageContext } from '#app/components/layout/collageContext'
import { graphQLQuery } from '#app/shared/graphQLQuery'
import { type Route } from './+types/collage'
import { getCollagePage } from './collage/collage.graphql'
import { isCollage } from './collages/collage.types'
import { Image } from './shared/image'
import { Title } from './shared/Title'

export async function loader({ params }: Route.LoaderArgs) {
  const data = await graphQLQuery(getCollagePage, { slug: params.slug })

  const collage = data.collageCollection?.items?.[0]

  if (!collage || !isCollage(collage)) {
    throw new Response("Le collage demandé n'a pas été trouvé!", {
      status: 404,
    })
  }

  return { collage }
}

export default function Collage({
  loaderData: { collage },
}: Route.ComponentProps) {
  const { onActiveCollageChange, onToggleLayoutOverlayChange } =
    useCollageContext()
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    onActiveCollageChange({ slug: collage.slug, title: collage.title })

    return () => {
      onActiveCollageChange(null)
    }
  }, [collage.slug, collage.title, onActiveCollageChange])

  return (
    <>
      <Title title={collage.title} />
      <motion.section
        className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center opacity-0"
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        onTap={() => {
          onToggleLayoutOverlayChange()
        }}
      >
        <Image
          className="pointer-events-none"
          image={collage.collage}
          onLoad={() => setImageLoaded(true)}
        />
      </motion.section>
    </>
  )
}
