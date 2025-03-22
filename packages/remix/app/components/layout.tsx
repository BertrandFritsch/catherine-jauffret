import classnames from 'classnames'
import { motion } from 'framer-motion'
import { useLayoutEffect, useState } from 'react'
import { Outlet } from 'react-router'
import siteMetadata from '#app/assets/siteMetadata.json'
import Footer from './layout/footer'
import Header from './layout/header'
import HeaderMobile from './layout/headerMobile'

export default function Layout() {
	const [showOverlay, setShowOverlay] = useState<
		'NO' | 'AUTO' | 'HOVER' | 'YES'
	>('AUTO')
	const [showMobileHeader, setShowMobileHeader] = useState(false)

	useLayoutEffect(() => {
		const resizeHandler = () =>
			setShowMobileHeader(!window.matchMedia('(min-width: 768px)').matches)
		window.addEventListener('resize', resizeHandler)
		resizeHandler()

		return () => window.removeEventListener('resize', resizeHandler)
	}, [])

	const pageContext: {
		layoutOverlay:
			| {
					pathname: string
					title?: string
			  }
			| undefined
	} = {
		layoutOverlay: undefined,
	}

	return (
		<motion.div
			className={classnames(
				'flex min-h-screen w-full flex-col items-center justify-between',
				{ 'z-[1]': pageContext.layoutOverlay },
			)}
			onHoverStart={() =>
				setShowOverlay(showOverlay === 'AUTO' ? 'HOVER' : showOverlay)
			}
			onHoverEnd={() =>
				setShowOverlay(showOverlay === 'HOVER' ? 'AUTO' : showOverlay)
			}
			onTap={() =>
				setShowOverlay(
					showOverlay === 'HOVER' || showOverlay === 'YES' ? 'NO' : 'YES',
				)
			}
			animate={
				pageContext.layoutOverlay
					? showOverlay === 'HOVER' || showOverlay === 'YES'
						? 'overlayHover'
						: 'overlayHidden'
					: 'overlayNone'
			}
		>
			{showMobileHeader ? (
				<HeaderMobile
					siteTitle={siteMetadata.title}
					overlay={pageContext.layoutOverlay !== undefined}
				/>
			) : (
				<Header
					className="flex-none"
					siteTitle={siteMetadata.title}
					overlay={pageContext.layoutOverlay !== undefined}
				/>
			)}

			<main className="flex-none px-4 py-8">
				<Outlet />
			</main>

			<Footer
				className="flex-none"
				socialMedias={{
					facebook: siteMetadata.socialMedias.facebook,
				}}
				additionalContent={
					pageContext.layoutOverlay?.title && (
						<h2>{pageContext.layoutOverlay?.title}</h2>
					)
				}
				overlay={pageContext.layoutOverlay !== undefined}
			/>
		</motion.div>
	)
}
