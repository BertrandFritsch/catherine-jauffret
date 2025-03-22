import {
	Image as UnpicImage,
	type ImageProps as UnpicImageProps,
} from '@unpic/react'
import { type RefObject } from 'react'
import { ANNU } from '#app/shared/utils'
import { type ImageAsset } from './image/image.types'

type ImageProps = Pick<UnpicImageProps, 'breakpoints' | 'operations'> & {
	ref?: RefObject<HTMLImageElement | null>
	className?: string
	image: ImageAsset
}

export function Image({ ref, className, breakpoints, image }: ImageProps) {
	ANNU(image.url, `The URL of the image ${image.title} is missing`)

	return (
		<div
			className={className}
			style={{
				aspectRatio: `${image.width} / ${image.height}`,
				backgroundColor: '#1a1a1a',
				maxWidth: '100vh',
				maxHeight: '100vh',
				width: breakpoints?.[0],
			}}
		>
			<UnpicImage
				ref={ref}
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
