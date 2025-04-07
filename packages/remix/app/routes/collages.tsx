import { AnimatePresence } from 'motion/react'
import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import { graphQLQuery } from '#app/shared/graphQLQuery'
import { ANNU, asserts } from '#app/shared/utils'
import { type Route } from './+types/collages'
import { AnimatedOutlet } from './collages/animatedOutlet'
import { isCollage, type Collage } from './collages/collage.types'
import { CollageLink } from './collages/collageLink'
import { getCollagesPage } from './collages/collages.graphql'
import { Title } from './shared/Title'

export async function loader() {
	const data = await graphQLQuery(getCollagesPage, { limit: 1000, skip: 0 })

	ANNU(
		data.collageCollection,
		'The data for the collages page has not been provided!',
	)

	asserts(
		data.collageCollection.items.length === data.collageCollection.total,
		'The data for the collages page is not complete! There are more collages than the ones downloaded. Time to paginate the query!',
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
	params: { slug },
}: Route.ComponentProps) {
	// const collageAnimation = useCollageAnimation()
	// const { state, showCollage } = collageAnimation
	const location = useLocation()

	const animateCollage = location.state?.collagesImgBox !== undefined
	const showCollagePage = slug !== undefined
	const showCollagesPage = !showCollagePage || animateCollage

	// useEffect(() => {
	// 	if (state.type === 'NONE' && location.state?.collagesImgBox) {
	// 		showCollage(location.state.collagesImgBox)
	// 	}
	// }, [location.state?.collagesImgBox, showCollage, state])

	useLayoutEffect(() => {
		if (showCollagesPage) {
			document.documentElement.style.setProperty(
				'--scrollbar-width',
				`${window.innerWidth - document.documentElement.getBoundingClientRect().width}px`,
			)
		}
	}, [showCollagesPage])

	return (
		<>
			{showCollagesPage && (
				<>
					<Title title="Collages" />
					<section>
						{groups.map((group) => (
							<section key={group.year}>
								<h3 className="border-b-1 pb-2 text-right text-xl font-bold">{`Collages ${group.year}`}</h3>
								<section className="grid grid-cols-[repeat(3,320px)] content-start justify-start gap-8 px-1 py-4">
									{group.items.map((item) => (
										<section key={item.slug}>
											<h2 className="text-sx p-4">{item.title}</h2>
											<CollageLink item={item} />
										</section>
									))}
								</section>
							</section>
						))}
					</section>
				</>
			)}
			<AnimatePresence>
				{showCollagePage && (
					/*(!animateCollage || collageAnimation.state.type !== 'NONE') &&*/ <AnimatedOutlet
						key={slug} /*context={collageAnimation}*/
					/>
				)}
			</AnimatePresence>
		</>
	)
}
