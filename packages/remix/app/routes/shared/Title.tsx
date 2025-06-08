import siteMetadata from '#app/assets/siteMetadata.json'

type TitleProps = {
	title: string
}

export function Title({ title }: TitleProps) {
	return (
		<title className="text-center text-3xl font-bold text-white">
			{`${title} | ${siteMetadata.title}`}
		</title>
	)
}
