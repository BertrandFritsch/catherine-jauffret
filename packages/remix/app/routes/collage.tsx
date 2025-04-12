import classnames from 'classnames'
import {
	motion,
	useMotionValue,
	useTransform,
	type PanInfo,
	type TargetAndTransition,
	type Variants,
} from 'motion/react'
import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { graphQLQuery } from '#app/shared/graphQLQuery'
import { type Route } from './+types/collage'
import { getCollagePage } from './collage/collage.graphql'
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

export default function Collage({ loaderData }: Route.ComponentProps) {
	const {
		current: { collage },
	} = useRef(loaderData)
	const location = useLocation()
	const navigate = useNavigate()
	const { current: collageThumbnailCoords } = useRef(
		location.state?.collagesImgBox ?? null,
	)

	const yDrag = useMotionValue(0)
	const opacity = useTransform(yDrag, [-400, 0, 400], [0, 1, 0])

	const [loadingState, setLoadingState] = useState<
		'none' | 'thumbnail' | 'loaded'
	>(collageThumbnailCoords ? 'thumbnail' : 'none')

	const loadingVariants = (() => {
		if (collageThumbnailCoords) {
			const screenAspectRatio = window.innerWidth / window.innerHeight
			const imageAspectRatio = collage.width / collage.height
			const animateValues = {
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
			} satisfies TargetAndTransition

			return {
				thumbnail: {
					x: animateValues.x,
					y: animateValues.y,
					scale: animateValues.scale,
				},
				loaded: {
					x: 0,
					y: 0,
					scale: 1,
				},
				exit: {
					x: animateValues.x,
					y: [null, animateValues.y],
					scale: animateValues.scale,
				},
			} as const satisfies Variants
		}
	})()

	const backgroundVariants = {
		thumbnail: {
			opacity: 0,
		},

		loaded: {
			opacity: 1,
		},
	} satisfies Variants

	return (
		<>
			<Title title={collage.title} />
			<motion.div
				className="bg-root-background pointer-events-none fixed top-0 left-0 h-screen w-screen"
				style={{ opacity }}
				variants={backgroundVariants}
				initial={false}
				animate={loadingState}
				exit="thumbnail"
			/>
			{collageThumbnailCoords && (
				<div
					className={classnames('bg-root-background fixed opacity-0', {
						'opacity-100': loadingState === 'loaded',
					})}
					style={{
						left: collageThumbnailCoords.left,
						top: collageThumbnailCoords.top,
						width: collageThumbnailCoords.width,
						height: collageThumbnailCoords.height,
					}}
				/>
			)}
			<motion.section
				className={classnames(
					'collage',
					'fixed top-0 left-0 flex h-screen w-screen items-center justify-center',
				)}
				style={{ y: yDrag }}
				variants={loadingVariants}
				initial={false}
				animate={loadingState}
				exit="exit"
				transition={{
					duration: 0.6,
					ease: 'easeInOut',
					type: 'tween',
				}}
				drag={loadingVariants && loadingState === 'loaded' ? 'y' : false}
				whileTap={{ cursor: 'grabbing' }}
				dragConstraints={{ top: 0, bottom: 0 }}
				dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
				dragElastic={0.5}
				onDragEnd={(_: unknown, { offset: { y } }: PanInfo) => {
					if (Math.abs(y) > window.innerHeight / 3) {
						void navigate(-1)
					}
				}}
			>
				<Image
					className="pointer-events-none"
					image={collage}
					onLoad={() => setLoadingState('loaded')}
				/>
			</motion.section>
		</>
	)
}
