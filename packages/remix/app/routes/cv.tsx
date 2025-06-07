import {
  documentToReactComponents,
  type Options,
} from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import { graphQLQuery } from '#app/shared/graphQLQuery'
import { ANNU, asserts } from '#app/shared/utils'
import { type Route } from './+types/cv'
import { getCVPage } from './cv/cv.graphql'
import { isCV } from './cv/cv.types'
import { FadeInImage } from './shared/fadeInImage'
import { Title } from './shared/Title'

export async function loader() {
  const data = await graphQLQuery(getCVPage)

  ANNU(data.cvCollection, 'The data for the CV page has not been provided!')

  asserts(
    data.cvCollection.items.length > 0,
    'No CV items were found in the API response!',
  )

  const cvItem = data.cvCollection.items[0]

  if (!cvItem || !isCV(cvItem)) {
    throw new Response('The CV data structure is invalid or incomplete!', {
      status: 500,
    })
  }

  return { cvItem }
}

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_, children) => <p className="my-4">{children}</p>,
    [BLOCKS.HEADING_4]: (_, children) => (
      <h4 className="font-lora text-message my-4 italic">{children}</h4>
    ),
    [BLOCKS.QUOTE]: (_, children) => (
      <blockquote className="text-message italic">{children}</blockquote>
    ),
  },
} as const satisfies Options

export default function CV({ loaderData }: Route.ComponentProps) {
  const { cvItem } = loaderData

  return (
    <>
      <Title title="CV" />
      <section className="max-w-[680px] text-sm">
        <FadeInImage
          className="float-left mr-8 mb-4"
          image={cvItem.image}
          breakpoints={[320]}
        />
        <h2 className="my-4 text-2xl font-bold">{cvItem.title}</h2>
        {documentToReactComponents(cvItem.text.json, options)}
        <h5 className="text-right text-sm font-bold">{cvItem.author}</h5>
      </section>
    </>
  )
}
