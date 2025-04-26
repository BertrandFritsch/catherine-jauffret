import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
	layout("./components/layout.tsx", [
		index('./routes/home.tsx'),
		route('/presentation', './routes/presentation.tsx'),
		route('/cv', './routes/cv.tsx'),
		route('/collages', './routes/collages.tsx', [
			route(':slug', './routes/collage.tsx')
		]),
	])
] as const satisfies RouteConfig
