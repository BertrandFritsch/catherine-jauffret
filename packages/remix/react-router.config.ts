import { type Config } from '@react-router/dev/config'

export default {
	// Config options...
	basename: '/',
	// Server-side render by default, to enable SPA mode set this to `false`
	ssr: true,
	prerender: true,
} satisfies Config
