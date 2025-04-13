import { type Config } from '@react-router/dev/config'

export default {
	ssr: true,

	/**
	 * As of today, netlify don't support prerendering
	 * The netlify plugin -- @netlify/vite-plugin-react-router -- cannot be used.
	 * Prefender all the routes in the app and deploy the app to a static host.
	 */
	async prerender({ getStaticPaths}) {
		return getStaticPaths()
	},
} satisfies Config
