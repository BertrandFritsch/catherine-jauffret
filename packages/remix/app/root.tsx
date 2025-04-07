import { Tooltip } from '@base-ui-components/react/tooltip'
import {
	isRouteErrorResponse,
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from 'react-router'

import { type Route } from './+types/root'
import './app.css'

export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Quicksand:wght@300..700&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap',
	},
]

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="fr"
			className="has-[.collage]:overflow-hidden has-[.collage]:pr-[var(--scrollbar-width)]"
		>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<link rel="icon" href="/favicon.ico" />
				<title>Collages</title>
			</head>
			<body className="isolate">
				<Tooltip.Provider>{children}</Tooltip.Provider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let details = 'An unexpected error occurred.'

	if (isRouteErrorResponse(error)) {
		details = error.status === 404 ? error.data : error.statusText || details
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message
	}

	return (
		<main className="mx-auto flex h-screen max-w-3xl flex-col items-center justify-center text-sm text-red-700 dark:text-red-400">
			<span className="font-mono">{details}</span>
			<Link to="/" className="mt-4 text-blue-500 hover:underline">
				Revenir à la page d'Accueil
			</Link>
		</main>
	)
}
