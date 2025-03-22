import {
	documentToReactComponents,
	type Options,
} from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import { graphQLQuery } from '#app/shared/graphQLQuery'
import { ANNU, asserts } from '#app/shared/utils'
import { type Route } from './+types/presentation'
import { getPresentationPage } from './presentation/presentation.graphql'
import { isPresentation } from './presentation/presentation.types'
import { Image } from './shared/image'
import { Title } from './shared/Title'

export async function loader() {
	const data = await graphQLQuery(getPresentationPage)

	ANNU(
		data.presentationCollection,
		'The data for the presentation page has not been provided!',
	)

	asserts(
		data.presentationCollection.items.length > 0,
		'No presentation items were found in the API response!',
	)

	const presentationItem = data.presentationCollection.items[0]

	if (!presentationItem || !isPresentation(presentationItem)) {
		throw new Response(
			'The presentation data structure is invalid or incomplete!',
			{ status: 500 },
		)
	}

	return { presentationItem }
}

const options = {
	renderNode: {
		[BLOCKS.PARAGRAPH]: (_, children) => <p className="my-4">{children}</p>,
	},
} as const satisfies Options

export default function Presentation({ loaderData }: Route.ComponentProps) {
	const { presentationItem } = loaderData

	return (
		<>
			<Title title="Présentation" />
			<section className="max-w-[680px] text-sm">
				<Image
					image={presentationItem.image}
					className="float-left mr-8 mb-4"
					breakpoints={[320]}
				/>
				<h2 className="my-4 text-2xl font-bold">{presentationItem.title}</h2>
				{documentToReactComponents(presentationItem.text.json, options)}
				<h5 className="text-right text-sm font-bold">
					{presentationItem.author}
				</h5>
			</section>
		</>
	)
}
