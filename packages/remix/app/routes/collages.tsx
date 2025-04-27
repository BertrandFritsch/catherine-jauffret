import { motion } from 'motion/react'
import { useLayoutEffect } from 'react'
import { useCollageContext } from '#app/components/layout/collageContext'
import { graphQLQuery } from '#app/shared/graphQLQuery'
import { ANNU } from '#app/shared/utils'
import { type Route } from './+types/collages'
import { isCollage, type Collage } from './collages/collage.types'
import { getCollagesPage } from './collages/collages.graphql'
import { ZoomableCollage } from './collages/zoomableCollage'
import { Title } from './shared/Title'

export async function loader() {
  const data = await graphQLQuery(getCollagesPage, { limit: 1000, skip: 0 })

  ANNU(
    data.collageCollection,
    'The data for the collages page has not been provided!',
  )

  const collages = data.collageCollection.items

  const groups = Object.entries(
    collages.reduce<{
      [year: number]: Collage[]
    }>((acc, item) => {
      if (!isCollage(item)) {
        console.warn(
          `⚠️⚠️⚠️ The collage item '${item?.slug}' is not valid. Please check the data. ⚠️⚠️⚠️`,
        )

        return acc
      }

      const year = new Date(item.date).getFullYear()
      const items = acc[year] ?? []
      acc[year] = [...items, item]
      return acc
    }, {}),
  ).map(([year, items]) => ({ year, items }))

  groups.sort((a, b) => (a.year > b.year ? -1 : 1))

  return { groups }
}

export default function Collages({
  loaderData: { groups },
}: Route.ComponentProps) {
  const {
    activeCollage: activeCollage,
    onToggleLayoutOverlayChange,
    onActiveCollageChange,
  } = useCollageContext()

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      '--scrollbar-width',
      `${window.innerWidth - document.documentElement.getBoundingClientRect().width}px`,
    )
  }, [])

  return (
    <>
      <Title title="Collages" />
      <section>
        {groups.map((group) => (
          <section key={group.year}>
            <h3 className="border-b-1 pb-2 text-right text-xl font-bold">{`Collages ${group.year}`}</h3>
            <section className="grid grid-cols-[repeat(3,320px)] content-start justify-start gap-8 px-1 py-4">
              {group.items.map((item) => (
                <motion.section
                  key={item.slug}
                  onTap={(e: PointerEvent) => {
                    if (activeCollage === null) {
                      onActiveCollageChange({
                        slug: item.slug,
                        title: item.title,
                      })
                    } else {
                      if (e.defaultPrevented) return
                      onToggleLayoutOverlayChange()
                    }
                  }}
                >
                  <h2 className="text-sx p-4">{item.title}</h2>
                  <ZoomableCollage
                    zoomed={activeCollage?.slug === item.slug}
                    item={item}
                    onUnzoom={onActiveCollageChange}
                  />
                </motion.section>
              ))}
            </section>
          </section>
        ))}
      </section>
    </>
  )
}
