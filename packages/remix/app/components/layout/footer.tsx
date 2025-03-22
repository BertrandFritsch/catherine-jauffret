import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import { motion, type Variants } from 'framer-motion'
import { Link } from 'react-router'
import siteMetadata from '#app/assets/siteMetadata.json'

interface Props {
	className?: string
	socialMedias: {
		facebook: string
	}
	additionalContent?: React.ReactNode
	overlay: boolean
}

const footerVariants: Variants = {
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

export default function Footer({
	className,
	socialMedias,
	additionalContent,
	overlay,
}: Props) {
	return (
		<motion.footer
			className={classnames(
				'box-border flex w-full flex-col items-center p-4 text-xs',
				className,
				{
					'fixed bottom-0 left-0 z-[1] bg-[var(--bg-overlay-bottom)]': overlay,
				},
			)}
			variants={footerVariants}
		>
			<div className="flex flex-col items-center [&>*]:mt-2 [&>*:last-child]:mb-2">
				{additionalContent}
				<div className="self-stretch border-t border-solid border-[var(--color-default-foreground)]" />
				<ul className="flex list-none items-center justify-center p-0 font-bold">
					<li>
						<Link
							to="/guestbook"
							className="hover:text-hover ml-4 text-inherit uppercase no-underline [&.active]:border-b-2 [&.active]:border-solid"
							prefetch="intent"
						>
							Livre d'or
						</Link>
					</li>
					<li>
						<Link
							to="/contact"
							className="hover:text-hover ml-4 text-inherit uppercase no-underline [&.active]:border-b-2 [&.active]:border-solid"
							prefetch="intent"
						>
							Contact
						</Link>
					</li>
					<li>
						<a
							href={socialMedias.facebook}
							className="ml-4 text-2xl text-inherit"
						>
							<FontAwesomeIcon icon={faFacebook} />
						</a>
					</li>
				</ul>
				<p>
					Copyright &copy; {new Date().getFullYear()} - {siteMetadata.title}
				</p>
			</div>
		</motion.footer>
	)
}
