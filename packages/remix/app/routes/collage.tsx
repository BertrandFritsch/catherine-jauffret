import classnames from 'classnames'
import {
	motion,
	type PanInfo,
	type TargetAndTransition,
	type Variants,
} from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router'
import { graphQLQuery } from '#app/shared/graphQLQuery'
import { type Route } from './+types/collage'
import { getCollagePage } from './collage/collage.graphql'
import { type useCollageAnimation } from './collages/useCollageAnimation'
import { Image } from './shared/image'
import { isImageAsset } from './shared/image/image.types'
import { Title } from './shared/Title'

export async function loader({ params }: Route.LoaderArgs) {
	const data = await graphQLQuery(getCollagePage, { slug: params.slug })

	const collage = data.collageCollection?.items?.[0]?.collage

	if (!collage || !isImageAsset(collage)) {
		throw new Response("Le collage demandé n'a pas été trouvé!", {
			status: 404,
		})
	}

	return { collage }
}

export default function Collage({
	loaderData: { collage },
}: Route.ComponentProps) {
	const navigate = useNavigate()
	const collageAnimation: ReturnType<typeof useCollageAnimation> =
		useOutletContext()
	const [dragging, setDragging] = useState(false)

	const collageThumbnailCoords =
		collageAnimation.state.type !== 'NONE' ? collageAnimation.state.rect : null

	const animateValues = useMemo(() => {
		if (collageThumbnailCoords) {
			const screenAspectRatio = window.innerWidth / window.innerHeight
			const imageAspectRatio = collage.width / collage.height
			return {
				x:
					collageThumbnailCoords.left +
					collageThumbnailCoords.width / 2 -
					window.innerWidth / 2,
				y:
					collageThumbnailCoords.top +
					collageThumbnailCoords.height / 2 -
					window.innerHeight / 2,
				scale:
					(imageAspectRatio > 1 && screenAspectRatio <= imageAspectRatio) ||
					(imageAspectRatio <= 1 && screenAspectRatio <= imageAspectRatio)
						? collageThumbnailCoords.width /
							Math.min(window.innerWidth, collage.width)
						: collageThumbnailCoords.height /
							Math.min(window.innerHeight, collage.height),
			}
		}
	}, [collage.height, collage.width, collageThumbnailCoords])

	const initialVariants = animateValues && {
		x: animateValues.x,
		y: animateValues.y,
		scale: animateValues.scale,
		opacity: 0,
	}

	const animateVariants = animateValues && {
		x: 0,
		y: 0,
		scale: 1,
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: 'easeIn',
			type: 'tween',
		},
	}

	const exitVariants: TargetAndTransition | undefined =
		collageAnimation.state.type !== 'NONE' && animateValues
			? {
					x: [null, animateValues.x],
					y: [null, animateValues.y],
					scale: [null, animateValues.scale],
					opacity: 1,
					transition: {
						duration: 0.3,
						ease: 'linear',
						type: 'tween',
					},
				}
			: undefined

	const backgroundVariants: Variants = {
		in: {
			opacity: 1,
		},

		out: {
			opacity: 0,
		},
	}

	return (
		<>
			<Title title={collage.title} />
			<motion.div
				className={classnames(
          {
            ['opacity-0']: collageAnimation.state.type !== 'NONE',
					},
          'bg-root-background pointer-events-none fixed top-0 left-0 h-screen w-screen opacity-100',
				)}
				variants={backgroundVariants}
				initial={false}
				animate={
					collageAnimation.state.type === 'ANIMATING_OUT' || dragging
						? 'out'
						: collageAnimation.state.type === 'READY'
							? 'in'
							: undefined
				}
			/>
			<motion.section
				className={classnames(
          {
            ['opacity-0']: collageAnimation.state.type !== 'NONE',
					},
          'fixed top-0 left-0 flex h-screen w-screen items-center justify-center opacity-100',
				)}
				inherit={false}
				initial={initialVariants}
				animate={animateVariants}
				exit={exitVariants}
				onAnimationStart={() => collageAnimation.startAnimating()}
				onAnimationComplete={() => collageAnimation.stopAnimating()}
				drag={collageAnimation.state.type === 'READY' ? 'y' : false}
				whileTap={{ cursor: 'grabbing' }}
				dragConstraints={{ top: 0, bottom: 0 }}
				dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
				dragElastic={0.5}
				onDragStart={() => setDragging(true)}
				onDragEnd={(_: unknown, { offset: { y } }: PanInfo) => {
					setDragging(false)

					if (Math.abs(y) > window.innerHeight / 3) {
						void navigate(-1)
					}
				}}
			>
				<Image image={collage} />
			</motion.section>
		</>
	)
}
