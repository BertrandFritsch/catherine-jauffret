import { useState } from 'react'
import { NavLink } from 'react-router'
import { AnimatedImage } from '../shared/image'
import { type Collage } from './collage.types'

type CollageLinkProps = {
	item: Collage
}

export function CollageLink({ item }: CollageLinkProps) {
	const [imageDOMRect, setImageDOMRect] = useState<DOMRect | null>(null)
	const [loaded, setLoaded] = useState(false)

	return (
		<NavLink
			to={item.slug}
			preventScrollReset
			state={{ collagesImgBox: imageDOMRect }}
			prefetch="intent"
		>
			<AnimatedImage
				image={item.collage}
				breakpoints={[320]}
				onLoad={(img: HTMLImageElement) => {
					setLoaded(true)
					setImageDOMRect(img.getBoundingClientRect())
				}}
				onHoverStart={(e: PointerEvent) => {
					if (e.target instanceof HTMLImageElement) {
						setImageDOMRect(e.target.getBoundingClientRect())
					}
				}}
				initial={false}
				Header
				animate={
					loaded
						? {
								opacity: 1,
							}
						: {
								opacity: 0,
							}
				}
				transition={{
					duration: 0.6,
				}}
			/>
		</NavLink>
	)
}
