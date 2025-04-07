import {
	Image as UnpicImage,
	type ImageProps as UnpicImageProps,
} from '@unpic/react'
import { useCallback, useRef, type Ref } from 'react'
import { ANNU } from '#app/shared/utils'
import { type ImageAsset } from './image/image.types'

type ImageProps = Pick<UnpicImageProps, 'breakpoints' | 'operations'> & {
	ref?: Ref<HTMLImageElement | null>
	className?: string
	image: ImageAsset
	onLoad?: (image: HTMLImageElement) => void
}

export function Image({
	ref,
	className,
	breakpoints,
	image,
	onLoad,
}: ImageProps) {
	ANNU(image.url, `The URL of the image ${image.title} is missing`)
	const onLoadRef = useRef(onLoad)
	onLoadRef.current = onLoad

	const imageRef = useCallback(
		(img: HTMLImageElement | null) => {
			if (ref) {
				if (typeof ref === 'function') {
					ref(img)
				} else {
					ref.current = img
				}
			}

			const onLoad = onLoadRef.current

			if (img && onLoad) {
				if (img.complete) {
					onLoad(img)
				} else {
					img.addEventListener('load', () => onLoad(img))
				}
			}
		},
		[ref],
	)

	return (
		<div
			className={className}
			style={{
				aspectRatio: `${image.width} / ${image.height}`,
				// backgroundColor: '#1a1a1a',
				maxWidth: '100vh',
				maxHeight: '100vh',
				width: breakpoints?.[0],
			}}
		>
			<UnpicImage
				ref={imageRef}
				breakpoints={breakpoints}
				src={image.url}
				alt={image.title}
				operations={{
					contentful: {
						fit: 'scale',
						fm: 'webp',
					},
				}}
				onLoad={(e: Event) => {
					if (
						onLoad &&
						e.currentTarget &&
						e.currentTarget instanceof HTMLImageElement
					) {
						onLoad(e.currentTarget)
					}
				}}
			/>
		</div>
	)
}
