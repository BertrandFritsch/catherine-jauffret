import { type Variants } from 'motion/react'

export const opacityVariants: Variants = {
	overlayNone: {
		opacity: 1,
		pointerEvents: 'auto',
	},

	overlayHidden: {
		opacity: 0,
		pointerEvents: 'none',
	},

	overlayHover: {
		opacity: 1,
		pointerEvents: 'auto',
	},
}
