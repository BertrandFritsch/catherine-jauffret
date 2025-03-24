import { useRef } from 'react'
import { Link } from 'react-router'
import { Image } from '../shared/image'
import { type Collage } from './collage.types'

type CollageLinkProps = {
	item: Collage
}

export function CollageLink({ item }: CollageLinkProps) {
	const imageRef = useRef<HTMLImageElement>(null)

	return (
		<Link
			to={item.slug}
			preventScrollReset
			state={{ collagesImgBox: imageRef.current?.getBoundingClientRect() }}
		>
			<Image ref={imageRef} image={item.collage} breakpoints={[320]} />
		</Link>
	)
}
