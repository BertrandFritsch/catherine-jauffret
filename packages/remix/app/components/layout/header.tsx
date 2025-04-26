import classNames from 'classnames'
import { motion, useScroll } from 'motion/react'
import { useLayoutEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { opacityVariants } from './shared/opacityVariants'

interface Props {
	className?: string
	siteTitle: string
	overlay: boolean
}

const defaultProps: Partial<Props> = {
	siteTitle: ``,
}

export default function Header({ className, siteTitle, overlay }: Props) {
	const { scrollY } = useScroll()
	const [isCollapsed, setIsCollapsed] = useState(scrollY.get() > 0)
	useLayoutEffect(
		() => scrollY.on('change', (v) => setIsCollapsed(v > 0)),
		[scrollY],
	)

	return (
		<header
			className={classNames('mt-[var(--spacing-header-desktop)]', className)}
		>
			<motion.div
				className={classNames(
					'fixed top-0 right-0 left-0 z-10 flex flex-col items-center whitespace-nowrap',
					{
						'bg-[var(--bg-overlay-top)]': overlay,
						'flex-row justify-center bg-[var(--color-header-collapsed)] shadow-[var(--shadow-header)]':
							!overlay && isCollapsed,
					},
				)}
				layout
				variants={opacityVariants}
			>
				<motion.h1
					className={classNames(
						'text-hover m-0 py-6 text-[length:var(--text-header-desktop)] font-bold uppercase',
						{
							'py-4 text-[length:var(--text-header-desktop-collapsed)]':
								!overlay && isCollapsed,
						},
					)}
					layout
				>
					<NavLink
						to="/"
						className="text-inherit no-underline"
						prefetch="intent"
					>
						{siteTitle}
					</NavLink>
				</motion.h1>
				<motion.h2
					className={classNames('font-lora m-0 text-2xl font-normal italic', {
						'invisible w-0': !overlay && isCollapsed,
					})}
					layout
				>
					Dé-coupage
				</motion.h2>
				<motion.ul
					className="my-6 flex list-none items-center justify-center p-0 font-bold"
					layout
				>
					<li>
						<NavLink
							to="/presentation"
							className="hover:text-hover ml-4 text-inherit uppercase no-underline [&.active]:border-b-2 [&.active]:border-solid"
							prefetch="intent"
						>
							Présentation
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/collages"
							className="hover:text-hover ml-4 text-inherit uppercase no-underline [&.active]:border-b-2 [&.active]:border-solid"
							prefetch="intent"
						>
							Collages
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/cv"
							className="hover:text-hover ml-4 text-inherit uppercase no-underline [&.active]:border-b-2 [&.active]:border-solid"
							prefetch="intent"
						>
							Curriculum vitae
						</NavLink>
					</li>
				</motion.ul>
			</motion.div>
		</header>
	)
}

Header.defaultProps = defaultProps
